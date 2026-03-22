export const config = {
  runtime: "nodejs",
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  try {
    const apiKey = process.env.OPENROUTER_API_KEY
    if (!apiKey) {
      res.status(500).json({ error: "Missing OPENROUTER_API_KEY" })
      return
    }

    const body = req.body || {}
    const history = Array.isArray(body.messages) ? body.messages : []
    const systemPrompt = typeof body.systemPrompt === "string" ? body.systemPrompt.trim() : ""
    const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : "openai/gpt-4o-mini"
    const temperature = Number.isFinite(Number(body.temperature)) ? Number(body.temperature) : 0.7
    const maxTokens = Number.isFinite(Number(body.maxTokens)) ? Number(body.maxTokens) : 400

    const messages = history
      .filter((message) => message && typeof message.content === "string" && message.content.trim())
      .map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: message.content,
      }))

    if (systemPrompt) {
      messages.unshift({ role: "system", content: systemPrompt })
    }

    if (!messages.length) {
      res.status(400).json({ error: "At least one message is required" })
      return
    }

    const openRouterRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      res.status(openRouterRes.status).json({
        error: openRouterData?.error?.message || "OpenRouter request failed",
      })
      return
    }

    const text = openRouterData?.choices?.[0]?.message?.content?.trim() || "No response."
    res.status(200).json({ text })
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : "OpenRouter proxy failed",
    })
  }
}
