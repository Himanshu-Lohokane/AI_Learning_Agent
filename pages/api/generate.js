import { generateStructuredContent, tryParseJson, repairToJson, simplifySummary } from '../../lib/ai'

export default async function handler(req, res){
  if(req.method !== 'POST') return res.status(405).end()
  const { topic, grade } = req.body || {}
  if(!topic || !grade) return res.status(400).json({error:'Topic and grade are required'})

  try{
    // 1. Get structured content from AI
    const raw = await generateStructuredContent(topic, grade)
    
    // Mock handling (if enabled in lib/ai.js)
    if (process.env.USE_MOCK_AI === 'true') {
      const mockData = JSON.parse(raw);
      return res.status(200).json({
        summary: `Standard explanation for ${topic} at grade ${grade} level.`,
        simplifiedSummary: mockData.summary,
        keyPoints: mockData.keyPoints,
        quiz: mockData.quiz
      })
    }

    let parsed = tryParseJson(raw)
    if(!parsed){
      const repaired = await repairToJson(raw, topic, grade)
      parsed = tryParseJson(repaired)
    }
    
    if(!parsed) throw new Error('Failed to parse AI response into JSON')

    // 2. Paraphrasing Requirement: Generate the simplified version
    const normalSummary = parsed.summary
    const simplifiedSummary = await simplifySummary(normalSummary, grade)

    // 3. Return structured data for the frontend
    return res.status(200).json({ 
      summary: normalSummary, 
      simplifiedSummary: simplifiedSummary, 
      keyPoints: parsed.keyPoints.slice(0, 5), 
      quiz: parsed.quiz.slice(0, 8).map(q => ({
        ...q,
        options: Array.isArray(q.options) ? q.options.slice(0, 4) : ['A','B','C','D']
      }))
    })

  } catch(err) {
    console.error(err)
    return res.status(500).json({error: err.message})
  }
}
