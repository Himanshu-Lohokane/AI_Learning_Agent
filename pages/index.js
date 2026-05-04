import { useState, useEffect, useRef } from 'react'
import Head from 'next/head'

function useTypewriter(text, speed = 12) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const prev = useRef('')

  useEffect(() => {
    if (!text) { setDisplayed(''); setDone(false); return }
    if (text === prev.current) return
    prev.current = text
    setDone(false)
    setDisplayed('')
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return { displayed, done }
}

function readingTime(text) {
  if (!text) return null
  const words = text.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

function gradeLabel(grade) {
  const g = parseInt(grade)
  if (g <= 3) return 'Beginner'
  if (g <= 6) return 'Elementary'
  if (g <= 9) return 'Intermediate'
  return 'Advanced'
}

export default function Home() {
  const [topic, setTopic]       = useState('')
  const [grade, setGrade]       = useState('6')
  const [loading, setLoading]   = useState(false)
  const [result, setResult]     = useState(null)
  const [error, setError]       = useState('')

  const [history, setHistory]   = useState([])
  const [answers, setAnswers]   = useState({})
  const [copied, setCopied]     = useState(false)
  const [currentTopic, setCurrentTopic] = useState('')
  const [currentGrade, setCurrentGrade] = useState('6')

  const summaryText = result?.summary ?? ''
  const { displayed: typedSummary, done: typingDone } = useTypewriter(summaryText)

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
    setCopied(false)
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: q, grade })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResult(data)
      setCurrentTopic(q)
      setCurrentGrade(grade)
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

  const retryQuiz = () => setAnswers({})

  const copyText = () => {
    if (!result) return
    navigator.clipboard.writeText(summaryText).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePrint = () => window.print()

  const totalQuestions = result?.quiz?.length ?? 0
  const answeredCount  = Object.keys(answers).length
  const correctCount   = result?.quiz
    ? result.quiz.filter((q, i) => answers[i] === q.correctAnswer).length
    : 0
  const quizComplete   = answeredCount === totalQuestions && totalQuestions > 0
  const quizPassed     = correctCount >= Math.ceil(totalQuestions / 2)

  const suggestedTopics = ['Black Holes', 'Ancient Rome', 'Photosynthesis', 'Quantum Computing']

  return (
    <>
      <Head>
        <title>Learning Assistant</title>
        <meta name="description" content="AI-powered educational content generator." />
      </Head>

      <div className={`page ${!result && !loading ? 'landing-layout' : ''}`}>

        {/* Header */}
        <header className="site-header">
          <h1>Learning Assistant</h1>
          <p>Get clear summaries, key points, and quizzes on any topic.</p>
        </header>

        {/* Search Form */}
        <div className="form-container">
          <div className="form-row">
            <input
              type="text"
              placeholder="Topic — e.g. Plate Tectonics"
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

          {!result && !loading && (
            <div className="suggestions">
              <span className="history-label">Try searching:</span>
              {suggestedTopics.map((h, i) => (
                <button key={i} className="history-chip" onClick={() => { setTopic(h); submit(h) }}>
                  {h}
                </button>
              ))}
            </div>
          )}

          {history.length > 0 && result && (
            <div className="history-row">
              <span className="history-label">Recent</span>
              {history.map((h, i) => (
                <button key={i} className="history-chip" onClick={() => { setTopic(h); submit(h) }}>
                  {h}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State Features */}
        {!result && !loading && !error && (
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">📚</div>
              <h3>Smart Summaries</h3>
              <p>Generated based on your grade level for maximum clarity.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">⚡</div>
              <h3>Key Takeaways</h3>
              <p>Fast learning with 3–5 high-impact bullet points.</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📝</div>
              <h3>Instant Quizzes</h3>
              <p>Test your knowledge immediately with interactive questions.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && <div className="error-box">{error}</div>}

        {/* Results */}
        {result && (
          <div className="result-area" id="printable">
            <hr className="divider" />

            {/* Meta Row */}
            <div className="meta-row">
              <div className="meta-tags">
                <span className="meta-tag">Grade {currentGrade}</span>
                <span className="meta-tag">{gradeLabel(currentGrade)}</span>
                <span className="meta-tag">{readingTime(result.summary)}</span>
              </div>
              <div className="meta-actions no-print">
                <button className="icon-btn" onClick={copyText} title="Copy summary">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
                <button className="icon-btn" onClick={handlePrint} title="Save as PDF">
                  Print
                </button>
              </div>
            </div>

            {/* Summary */}
            <section style={{ marginTop: '28px' }}>
              <p className="section-label" style={{ marginBottom: '20px' }}>Summary</p>
              <p className="summary-text">
                {typedSummary}
                {!typingDone && <span className="cursor-blink">|</span>}
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
              <div className="quiz-header">
                <p className="section-label">Quiz</p>
                {totalQuestions > 0 && (
                  <span className="quiz-progress no-print">
                    {answeredCount}/{totalQuestions} answered
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {totalQuestions > 0 && (
                <div className="progress-bar-track no-print">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                  />
                </div>
              )}

              <div className="quiz-questions">
                {result.quiz.map((q, qi) => (
                  <div key={qi}>
                    <p className="quiz-q">{qi + 1}. {q.question}</p>
                    <div className="options-list">
                      {q.options.map((opt, oi) => {
                        const answered    = answers[qi] !== undefined
                        const isCorrect   = opt === q.correctAnswer
                        const isSelected  = answers[qi] === opt
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
                            {answered && isCorrect && <span className="opt-badge pass">✓</span>}
                            {answered && isSelected && !isCorrect && <span className="opt-badge fail">✗</span>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Score Card */}
              {quizComplete && (
                <div className={`score-card ${quizPassed ? 'pass' : 'fail'} no-print`}>
                  <div className="score-number">{correctCount}/{totalQuestions}</div>
                  <div className="score-label">
                    {quizPassed ? 'Nice work! You passed.' : 'Keep studying — you\'ll get it!'}
                  </div>
                  <button className="retry-btn" onClick={retryQuiz}>Try Again</button>
                </div>
              )}
            </section>

            {/* Bottom Actions */}
            <div className="actions-row no-print">
              <button className="btn-ghost" onClick={() => submit()}>Regenerate</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
