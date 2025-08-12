export type GenerateType = 'qcm' | 'flashcards' | 'summary'

export async function generateWithAI(type: GenerateType, text: string) {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type, text })
  })
  if (res.ok) return res.json()
  // fallback client-side if function not configured
  const key = import.meta.env.VITE_OPENAI_API_KEY
  if (!key) throw new Error('Aucune IA configurée')
  const payload = buildPrompt(type, text)
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es un assistant pédagogique qui génère du contenu JSON strict.' },
        { role: 'user', content: payload }
      ],
      temperature: 0.2
    })
  })
  const data = await response.json()
  const content = data.choices?.[0]?.message?.content || ''
  return JSON.parse(content)
}

function buildPrompt(type: GenerateType, text: string) {
  if (type === 'qcm') {
    return `Génère 10 questions QCM en JSON: [{"question":"...","options":["A","B","C","D"],"answer_index":0}]. Texte:\n${text}`
  }
  if (type === 'flashcards') {
    return `Génère 20 flashcards en JSON: [{"front":"...","back":"..."}]. Texte:\n${text}`
  }
  return `Fais un résumé concis en JSON: {"summary":"..."}. Texte:\n${text}`
}