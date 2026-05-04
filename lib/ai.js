const OPENROUTER_ENDPOINT = process.env.OPENROUTER_ENDPOINT || 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3-haiku'
const KEY = process.env.OPENROUTER_API_KEY

async function callOpenRouter(messages){
  if(!KEY || KEY === 'your_openrouter_api_key_here') {
    throw new Error('Please set your REAL OpenRouter API Key in .env.local')
  }
  
  const res = await fetch(OPENROUTER_ENDPOINT, {
    method:'POST',
    headers:{
      'Content-Type':'application/json',
      'Authorization': `Bearer ${KEY}`,
      'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
      'X-Title': process.env.SITE_NAME || 'AI Learning Assistant',
    },
    body: JSON.stringify({model: MODEL, messages, temperature:0.2, max_tokens:800})
  })

  if(!res.ok){
    const txt = await res.text()
    throw new Error(`OpenRouter error: ${res.status} ${txt}`)
  }
  const j = await res.json()
  return j.choices?.[0]?.message?.content || j.output || JSON.stringify(j)
}

export async function generateStructuredContent(topic, grade){
  if(process.env.USE_MOCK_AI === 'true'){
    return JSON.stringify({
      summary: `[MOCK MODE] This is a demo explanation about ${topic} for grade ${grade}. To see real AI results, set USE_MOCK_AI=false in your .env.local and add your real API key.`,
      keyPoints: [`Demo point 1 about ${topic}`, `Demo point 2`, `Demo point 3`],
      quiz: [
        { question: `Question about ${topic}?`, options: ['A','B','C','D'], correctAnswer: 'A' }
      ]
    })
  }

  const sys = `You are a helpful assistant that outputs ONLY JSON. Produce a JSON object with keys: summary, keyPoints, quiz. summary: a short explanation suitable for a grade ${grade} student. keyPoints: an array of 3-5 short bullets. quiz: array of 3 questions, each question object must have 'question', 'options' (4 strings), and 'correctAnswer' (string). Respond with JSON only.`
  const user = `Topic: ${topic}\nGrade: ${grade}`
  return await callOpenRouter([{role:'system', content: sys}, {role:'user', content: user}])
}

export function tryParseJson(text){
  try{ return JSON.parse(text) }catch(e){
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    if(start!==-1 && end!==-1){
      const sub = text.slice(start, end+1)
      try{ return JSON.parse(sub) }catch(e2){ return null }
    }
    return null
  }
}

export async function simplifySummary(summary, grade){
  const sys = `You are a tutor. Rewrite the following text in simpler language suitable for a student in grade ${grade}. Keep it short. Output only the rewritten summary.`
  const user = `Text:\n${summary}`
  return await callOpenRouter([{role:'system',content:sys},{role:'user',content:user}])
}

export async function repairToJson(malformed, topic, grade){
  const sys = `You are a JSON fixer. Given some text, extract and return a valid JSON object that matches this schema: {summary: string, keyPoints: [string], quiz: [{question:string, options:[string], correctAnswer: string}]}. Do NOT include any extra fields.`
  const user = `Original content:\n${malformed}\nTopic:${topic}\nGrade:${grade}`
  return await callOpenRouter([{role:'system',content:sys},{role:'user',content:user}])
}
