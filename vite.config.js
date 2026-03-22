import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const readJsonBody = (req) => new Promise((resolve, reject) => {
  let body = ''
  req.on('data', chunk => {
    body += chunk
    if (body.length > 1024 * 1024) {
      reject(new Error('Request body too large'))
    }
  })
  req.on('end', () => {
    try {
      resolve(body ? JSON.parse(body) : {})
    } catch {
      reject(new Error('Invalid JSON body'))
    }
  })
  req.on('error', reject)
})

const parsePrice = (value) => {
  if (value == null) return null
  const n = Number(String(value).replace(/[^0-9.]/g, ''))
  return Number.isFinite(n) ? n : null
}

const normalizePartQuery = (value) => {
  const raw = String(value || '').trim()
  if (!raw) return 'Wiper Blade'

  const cleaned = raw
    .toLowerCase()
    .replace(/\([^)]*\)/g, ' ')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const partAliases = {
    'cabin air filter': 'Cabin Air Filter',
    'engine air filter': 'Engine Air Filter',
    'spark plugs': 'Spark Plug',
    'spark plug': 'Spark Plug',
    'wiper blades': 'Wiper Blade',
    'wiper blade': 'Wiper Blade',
    'rear brake pads': 'Rear Brake Pad',
    'rear brake pad': 'Rear Brake Pad',
    'battery replacement': 'Car Battery',
    'battery': 'Car Battery',
    'front brake pads': 'Front Brake Pad',
    'front brake pad': 'Front Brake Pad',
  }

  if (partAliases[cleaned]) return partAliases[cleaned]
  return cleaned.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')
}

const normalizePart = (item, index) => {
  const name = item.partName || item.name || item.title || item.description || 'Unknown Part'
  const cat = item.category || item.partCategory || item.section || 'Other'
  const am = parsePrice(item.price) ?? parsePrice(item.aftermarketPrice) ?? parsePrice(item.amPrice) ?? 40
  const oem = parsePrice(item.oemPrice) ?? parsePrice(item.listPrice) ?? Math.round(am * 1.6)

  return {
    id: item.id || index + 1,
    name,
    cat,
    diff: 1,
    time: '-',
    oem,
    am,
    csat: 90,
    hasGuide: false,
    brand: item.brand || item.manufacturer || '',
    partNumber: item.partNumber || item.sku || '',
    url: item.url || item.link || '',
  }
}

const rockAutoProxyPlugin = (env) => {
  const token = env.VITE_APIFY_API_TOKEN
  const actorId = env.VITE_APIFY_ROCKAUTO_ACTOR_ID

  const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  return {
    name: 'rockauto-proxy',
    configureServer(server) {
      server.middlewares.use('/api/rockauto', async (req, res) => {
        try {
          if (!token || !actorId) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing VITE_APIFY_API_TOKEN or VITE_APIFY_ROCKAUTO_ACTOR_ID' }))
            return
          }

          const url = new URL(req.url || '/', 'http://localhost')
          const year = url.searchParams.get('year') || ''
          const make = url.searchParams.get('make') || ''
          const model = url.searchParams.get('model') || ''
          const trim = url.searchParams.get('trim') || ''
          const partQuery = (url.searchParams.get('partQuery') || '').trim()

          if (!year || !make || !model) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'year, make, and model are required' }))
            return
          }

          const normalizedPart = normalizePartQuery(partQuery)
          const catalogQuery = [make, model, year, normalizedPart].filter(Boolean).join(' ')
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
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(actorInput),
          })

          if (!startRes.ok) {
            const details = await startRes.text()
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Apify run start failed', details }))
            return
          }

          const started = await startRes.json()
          const runId = started?.data?.id
          const datasetId = started?.data?.defaultDatasetId

          if (!runId || !datasetId) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Apify run metadata missing' }))
            return
          }

          const maxWaitMs = 120000
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
            const parts = rawItems.map(normalizePart).filter(part => part.name).slice(0, 10)
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ parts, count: parts.length }))
          }

          while (!['SUCCEEDED', 'FAILED', 'TIMED-OUT', 'ABORTED'].includes(status) && elapsed < maxWaitMs) {
            const previewItems = await readTopItems()
            if (previewItems.length >= 10) {
              // We already have enough results for UI, so stop the run to avoid unnecessary crawling.
              fetch(`https://api.apify.com/v2/actor-runs/${encodeURIComponent(runId)}/abort?token=${encodeURIComponent(token)}`, { method: 'POST' }).catch(() => {})
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

          if (status !== 'SUCCEEDED') {
            res.statusCode = 504
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Apify run did not finish successfully', status: status || 'UNKNOWN' }))
            return
          }

          sendParts([])
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'RockAuto proxy failed', details: err instanceof Error ? err.message : 'Unknown error' }))
        }
      })
    },
  }
}

const openRouterProxyPlugin = (env) => {
  const apiKey = env.OPENROUTER_API_KEY

  return {
    name: 'openrouter-proxy',
    configureServer(server) {
      server.middlewares.use('/api/ai-chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        try {
          if (!apiKey) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing OPENROUTER_API_KEY in environment' }))
            return
          }

          const body = await readJsonBody(req)
          const history = Array.isArray(body?.messages) ? body.messages : []
          const systemPrompt = typeof body?.systemPrompt === 'string' ? body.systemPrompt.trim() : ''
          const model = typeof body?.model === 'string' && body.model.trim() ? body.model.trim() : 'openai/gpt-4o-mini'
          const temperature = Number.isFinite(Number(body?.temperature)) ? Number(body.temperature) : 0.7
          const maxTokens = Number.isFinite(Number(body?.maxTokens)) ? Number(body.maxTokens) : 400

          const messages = history
            .filter(message => message && typeof message.content === 'string' && message.content.trim())
            .map(message => ({
              role: message.role === 'assistant' ? 'assistant' : 'user',
              content: message.content,
            }))

          if (systemPrompt) {
            messages.unshift({ role: 'system', content: systemPrompt })
          }

          if (!messages.length) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'At least one message is required' }))
            return
          }

          const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              temperature,
              max_tokens: maxTokens,
              messages,
            }),
          })

          const openRouterData = await openRouterRes.json()
          if (!openRouterRes.ok) {
            res.statusCode = openRouterRes.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({
              error: openRouterData?.error?.message || 'OpenRouter request failed',
            }))
            return
          }

          const text = openRouterData?.choices?.[0]?.message?.content?.trim() || 'No response.'
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ text }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: err instanceof Error ? err.message : 'OpenRouter proxy failed' }))
        }
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), rockAutoProxyPlugin(env), openRouterProxyPlugin(env)],
  }
})
