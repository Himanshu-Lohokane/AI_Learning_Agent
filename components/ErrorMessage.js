export default function ErrorMessage({message, onRetry}){
  return (
    <div className="glass-card p-4 border-red-200">
      <div className="text-red-700 font-semibold">Something went wrong</div>
      <div className="text-sm text-red-600 mt-2">{message}</div>
      <div className="mt-3">
        <button onClick={onRetry} className="px-4 py-2 rounded-lg bg-red-600 text-white">Retry</button>
      </div>
    </div>
  )
}
