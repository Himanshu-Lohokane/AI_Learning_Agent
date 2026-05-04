import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [grade, setGrade] = useState('6')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [simplified, setSimplified] = useState(false)
  const [history, setHistory] = useState([])
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('ai_history') || '[]')
      setHistory(saved)
    } catch {}
  }, [])

  const saveHistory = (t) => {
    const updated = [t, ...history.filter(h => h !== t)].slice(0, 3)
    setHistory(updated)
    localStorage.setItem('ai_history', JSON.stringify(updated))
  }

  const submit = async (overrideTopic) => {
    const q = overrideTopic ?? topic
    if (!q.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    setAnswers({})
    setSimplified(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q, grade })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      saveHistory(q)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const pick = (qIdx, option) => {
    if (answers[qIdx] !== undefined) return
    setAnswers(prev => ({ ...prev, [qIdx]: option }))
  }

  return (
    <>
      <Head>
        <title>Learning Assistant</title>
        <meta name="description" content="Enter a topic and grade to get an explanation, key points, and a quiz." />
      </Head>

      <div className="page">
        {/* Header */}
        <header className="site-header">
          <h1>Learning Assistant</h1>
          <p>Enter a topic and grade to get a summary, key points, and a short quiz.</p>
        </header>

        {/* Search Form */}
        <div className="form-row">
          <input
            type="text"
            placeholder="Topic — e.g. The French Revolution"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
          />
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={() => submit()} disabled={loading}>
            {loading ? <span className="spinner" /> : 'Generate'}
          </button>
        </div>

        {/* Recent Searches */}
        {history.length > 0 && (
          <div className="history-row">
            <span className="history-label">Recent</span>
            {history.map((h, i) => (
              <button key={i} className="history-chip" onClick={() => { setTopic(h); submit(h) }}>
                {h}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && <div className="error-box">{error}</div>}

        {/* Results */}
        {result && (
          <>
            <hr className="divider" />

            {/* Summary */}
            <section>
              <div className="toggle-row">
                <p className="section-label">Summary</p>
                <div className="toggle-pills">
                  <button
                    className={`toggle-pill ${!simplified ? 'active' : ''}`}
                    onClick={() => setSimplified(false)}
                  >
                    Normal
                  </button>
                  <button
                    className={`toggle-pill ${simplified ? 'active' : ''}`}
                    onClick={() => setSimplified(true)}
                  >
                    Simplified
                  </button>
                </div>
              </div>
              <p className="summary-text">
                {simplified ? result.simplifiedSummary : result.summary}
              </p>
            </section>

            <hr className="divider" />

            {/* Key Points */}
            <section>
              <p className="section-label">Key Points</p>
              <ul className="points-list">
                {result.keyPoints.map((point, i) => (
                  <li key={i}>
                    <span className="point-number">{i + 1}</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>

            <hr className="divider" />

            {/* Quiz */}
            <section>
              <p className="section-label">Quiz</p>
              <div className="quiz-questions">
                {result.quiz.map((q, qi) => (
                  <div key={qi}>
                    <p className="quiz-q">{q.question}</p>
                    <div className="options-list">
                      {q.options.map((opt, oi) => {
                        const answered = answers[qi] !== undefined
                        const isCorrect = opt === q.correctAnswer
                        const isSelected = answers[qi] === opt
                        let cls = 'option-btn'
                        if (answered && isCorrect) cls += ' correct'
                        else if (answered && isSelected) cls += ' wrong'
                        return (
                          <button
                            key={oi}
                            className={cls}
                            disabled={answered}
                            onClick={() => pick(qi, opt)}
                          >
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Regenerate */}
            <div className="actions-row">
              <button className="btn-ghost" onClick={() => submit()}>
                Regenerate
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
