import {useState} from 'react'
import {MotionConfig, motion} from 'framer-motion'

export default function InputForm({onGenerate, onRegenerate, loading, lastSearches, setTopic, setGrade, topic, grade}){
  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="glass-card p-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Enter Topic</label>
            <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Photosynthesis" className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </div>
          <div className="w-40 mt-4 md:mt-0">
            <label className="block text-sm font-medium text-gray-700">Grade</label>
            <select value={grade} onChange={e=>setGrade(e.target.value)} className="mt-2 w-full p-3 rounded-xl border border-gray-200 focus:outline-none">
              {Array.from({length:12}).map((_,i)=> <option key={i} value={i+1}>{i+1}</option>)}
            </select>
          </div>
          <div className="mt-4 md:mt-0 md:ml-auto flex items-center space-x-3">
            <button onClick={onGenerate} disabled={loading} className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:scale-105 transform transition">
              {loading ? 'Generating...' : 'Generate Content'}
            </button>
            <button onClick={onRegenerate} disabled={loading} className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700">Regenerate</button>
          </div>
        </div>

        {lastSearches?.length>0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {lastSearches.map((s,idx)=> (
              <button key={idx} onClick={()=>{ setTopic(s.topic); setGrade(s.grade) }} className="px-3 py-1 rounded-full bg-white/70 text-sm">{s.topic} - Grade {s.grade}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
