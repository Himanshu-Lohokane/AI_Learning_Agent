export default function KeyPointsList({points}){
  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold">Key Points</h3>
      <ul className="mt-4 space-y-3">
        {points.map((p,i)=> (
          <li key={i} className="flex items-start space-x-3">
            <div className="mt-1 w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">✓</div>
            <div className="text-gray-700">{p}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
