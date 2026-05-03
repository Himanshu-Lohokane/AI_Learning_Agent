import {useState} from 'react'

export default function QuizCard({quiz}){
  return (
    <div className="space-y-4">
      {quiz.map((q,qi)=> (
        <QuestionCard key={qi} q={q} index={qi} />
      ))}
    </div>
  )
}

function QuestionCard({q, index}){
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)

  function choose(i){
    if(locked) return
    setSelected(i)
    setLocked(true)
  }

  const correctIndex = typeof q.correctAnswer === 'number' ? q.correctAnswer : q.options.indexOf(q.correctAnswer)

  return (
    <div className="glass-card p-4">
      <div className="font-medium">{index+1}. {q.question}</div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
        {q.options.map((opt,oi)=>{
          const isCorrect = correctIndex === oi
          const isSelected = selected === oi
          const bg = locked ? (isCorrect ? 'bg-green-50 border-green-400' : (isSelected ? 'bg-red-50 border-red-400' : 'bg-white')) : 'bg-white'
          return (
            <button key={oi} onClick={()=>choose(oi)} disabled={locked} className={`p-3 text-left rounded-lg border ${bg} border-gray-200`}>{opt}</button>
          )
        })}
      </div>
      {locked && (
        <div className="mt-3 text-sm">{ (typeof q.correctAnswer === 'number' ? (selected===correctIndex ? 'Correct!' : 'Incorrect') : (q.options[selected] === q.correctAnswer ? 'Correct!' : 'Try again')) }</div>
      )}
    </div>
  )
}
