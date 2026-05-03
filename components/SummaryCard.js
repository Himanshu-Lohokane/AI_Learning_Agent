import {useState} from 'react'

export default function SummaryCard({summary, originalSummary, onToggleMode, simplifiedMode, onRegenerate}){
  return (
    <div className="glass-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold">Summary</h2>
          <p className="text-sm text-gray-500">{simplifiedMode ? 'Simplified for learners' : 'Normal explanation'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={onRegenerate} className="px-3 py-2 rounded-lg bg-white/80 border">Regenerate</button>
          <div className="flex items-center space-x-2 text-sm">
            <span>Normal</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={simplifiedMode} onChange={onToggleMode} className="sr-only" />
              <span className={`w-11 h-6 bg-gray-200 rounded-full block ${simplifiedMode ? 'after:translate-x-5 bg-gradient-to-r from-blue-500 to-purple-600' : ''}`} />
            </label>
            <span>Simplified</span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-gray-800 leading-relaxed">{summary}</p>
      </div>
    </div>
  )
}
