exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' }
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return { statusCode: 200, body: JSON.stringify({ error: 'OPENAI_API_KEY not set' }) }
  const { type, text } = JSON.parse(event.body || '{}')
  const prompt = buildPrompt(type, text)
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un assistant pédagogique qui génère du contenu JSON strict.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  })
  const data = await resp.json()
  const content = data.choices?.[0]?.message?.content || 'null'
  try {
    const parsed = JSON.parse(content)
    return { statusCode: 200, body: JSON.stringify(parsed) }
  } catch {
    return { statusCode: 200, body: JSON.stringify({ raw: content }) }
  }
}

function buildPrompt(type, text) {
  if (type === 'qcm') {
    return `Génère 10 questions QCM en JSON: [{"question":"...","options":["A","B","C","D"],"answer_index":0}]. Texte:\n${text}`
  }
  if (type === 'flashcards') {
    return `Génère 20 flashcards en JSON: [{"front":"...","back":"..."}]. Texte:\n${text}`
  }
  return `Fais un résumé concis en JSON: {"summary":"..."}. Texte:\n${text}`
}