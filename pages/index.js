import {useState, useEffect} from 'react'
import InputForm from '../components/InputForm'
import SummaryCard from '../components/SummaryCard'
import KeyPointsList from '../components/KeyPointsList'
import QuizCard from '../components/QuizCard'
import Loader from '../components/Loader'
import ErrorMessage from '../components/ErrorMessage'

export default function Home(){
  const [topic, setTopic] = useState('Photosynthesis')
  const [grade, setGrade] = useState('6')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [simplified, setSimplified] = useState(true)
  const [lastSearches, setLastSearches] = useState([])

  useEffect(()=>{
    const raw = localStorage.getItem('ala_last_searches')
    if(raw) setLastSearches(JSON.parse(raw))
  },[])

  function saveSearch(entry){
    const next = [entry, ...lastSearches].slice(0,3)
    setLastSearches(next)
    localStorage.setItem('ala_last_searches', JSON.stringify(next))
  }

  async function generate(payload){
    setError(null)
    setLoading(true)
    setResult(null)
    try{
      const r = await fetch('/api/generate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
      if(!r.ok){
        const txt = await r.text()
        throw new Error(txt)
      }
      const json = await r.json()
      setResult(json)
      saveSearch({topic:payload.topic, grade:payload.grade, time:Date.now(), summary: json.summary || json.originalSummary})
    }catch(err){
      setError(err.message || 'fetch failed')
    }finally{ setLoading(false) }
  }

  return (
    <div className="min-h-screen py-10">
      <header className="max-w-4xl mx-auto px-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">AI Learning Assistant</h1>
            <p className="text-gray-600">Learn any topic in seconds</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-6">
        <InputForm
          onGenerate={()=>generate({topic, grade})}
          onRegenerate={()=>generate({topic, grade})}
          loading={loading}
          lastSearches={lastSearches}
          setTopic={setTopic}
          setGrade={setGrade}
          topic={topic}
          grade={grade}
        />

        {loading && <Loader />}

        {error && <ErrorMessage message={error} onRetry={()=>generate({topic, grade})} />}

        {result && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <SummaryCard summary={simplified ? result.summary : (result.originalSummary || result.summary)} originalSummary={result.originalSummary} simplifiedMode={simplified} onToggleMode={()=>setSimplified(s=>!s)} onRegenerate={()=>generate({topic, grade})} />
              <KeyPointsList points={result.keyPoints || []} />
            </div>

            <div className="space-y-4">
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold">Quick Quiz</h3>
                <div className="mt-4">
                  <QuizCard quiz={result.quiz || []} />
                </div>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
