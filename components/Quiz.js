import {useState} from 'react'

export default function Quiz({quiz}){
  const [answers, setAnswers] = useState(Array(quiz.length).fill(null))

  function choose(qIdx, optIdx){
    const next = answers.slice();
    next[qIdx] = optIdx;
    setAnswers(next);
  }

  return (
    <div>
      {quiz.map((q,qi)=> (
        <div key={qi} style={{marginBottom:12}}>
          <div style={{fontWeight:600}}>{qi+1}. {q.question}</div>
          <div>
            {q.options.map((opt,oi)=> (
              <label key={oi} style={{display:'block',marginTop:6}}>
                <input type="radio" name={`q${qi}`} checked={answers[qi]===oi} onChange={()=>choose(qi,oi)} /> {opt}
                {answers[qi]!==null && (
                  <span style={{marginLeft:8, color: (q.correctAnswer===oi || q.correctAnswer===opt) ? 'green' : 'red'}}>
                    {(q.correctAnswer===oi || q.correctAnswer===opt) ? ' Correct' : ' Incorrect'}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
