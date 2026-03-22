import { normalizePart, normalizePartQuery, wait } from "./_lib/parts.js"

export const config = {
  runtime: "nodejs",
}

export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      res.status(405).json({ error: "Method not allowed" })
      return
    }

    const token = process.env.APIFY_API_TOKEN || process.env.VITE_APIFY_API_TOKEN
    const actorId = process.env.APIFY_ROCKAUTO_ACTOR_ID || process.env.VITE_APIFY_ROCKAUTO_ACTOR_ID

    if (!token || !actorId) {
      res.status(500).json({ error: "Missing APIFY_API_TOKEN or APIFY_ROCKAUTO_ACTOR_ID" })
      return
    }

    const year = String(req.query.year || "")
    const make = String(req.query.make || "")
    const model = String(req.query.model || "")
    const trim = String(req.query.trim || "")
    const partQuery = String(req.query.partQuery || "")

    if (!year || !make || !model) {
      res.status(400).json({ error: "year, make, and model are required" })
      return
    }

    const normalizedPart = normalizePartQuery(partQuery)
    const catalogQuery = [make, model, year, normalizedPart].filter(Boolean).join(" ")

    const actorInput = {
      year,
      make,
      model,
      trim,
      catalogQuery,
      vehicle: { year, make, model, trim },
      query: catalogQuery,
    }

    const startEndpoint = `https://api.apify.com/v2/acts/${encodeURIComponent(actorId)}/runs?token=${encodeURIComponent(token)}`
    const startRes = await fetch(startEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actorInput),
    })

    if (!startRes.ok) {
      const details = await startRes.text()
      res.status(502).json({ error: "Apify run start failed", details })
      return
    }

    const started = await startRes.json()
    const runId = started?.data?.id
    const datasetId = started?.data?.defaultDatasetId

    if (!runId || !datasetId) {
      res.status(502).json({ error: "Apify run metadata missing" })
      return
    }

    const maxWaitMs = 50000
    const pollEveryMs = 2000
    let elapsed = 0
    let status = started?.data?.status

    const topItemsEndpoint = `https://api.apify.com/v2/datasets/${encodeURIComponent(datasetId)}/items?token=${encodeURIComponent(token)}&format=json&clean=1&limit=10`

    const readTopItems = async () => {
      const itemsRes = await fetch(topItemsEndpoint)
      if (!itemsRes.ok) return []
      const data = await itemsRes.json()
      return Array.isArray(data) ? data : []
    }

    const sendParts = (rawItems) => {
      const parts = rawItems
        .map(normalizePart)
        .filter((part) => part.name)
        .slice(0, 10)
      res.status(200).json({ parts, count: parts.length })
    }

    while (!["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(status) && elapsed < maxWaitMs) {
      const previewItems = await readTopItems()
      if (previewItems.length >= 10) {
        fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}/abort?token=${encodeURIComponent(token)}`, {
          method: "POST",
        }).catch(() => {})
        sendParts(previewItems)
        return
      }

      await wait(pollEveryMs)
      elapsed += pollEveryMs

      const runStatusRes = await fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}?token=${encodeURIComponent(token)}`)
      if (!runStatusRes.ok) continue
      const runStatusData = await runStatusRes.json()
      status = runStatusData?.data?.status
    }

    const finalItems = await readTopItems()
    if (finalItems.length > 0) {
      sendParts(finalItems)
      return
    }

    if (status !== "SUCCEEDED") {
      res.status(504).json({
        error: "Apify run did not finish successfully",
        status: status || "UNKNOWN",
      })
      return
    }

    sendParts([])
  } catch (err) {
    res.status(500).json({
      error: "RockAuto proxy failed",
      details: err instanceof Error ? err.message : "Unknown error",
    })
  }
}
