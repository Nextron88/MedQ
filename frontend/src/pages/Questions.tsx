import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Layout from '../components/Layout'
import type { Question } from '../types'

export default function Questions() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchQuestions = async () => {
      const { data, error } = await supabase
        .from('questions')
        .select('id, subject, system, topic, correct_pct, created_at')
        .order('id', { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setQuestions(data as Question[])
      }
      setLoading(false)
    }
    fetchQuestions()
  }, [])

  return (
    <Layout>
      <div className="max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-base font-semibold text-dm-text">Questions</h1>
            {!loading && (
              <p className="text-xs text-dm-text2 mt-0.5">
                {questions.length} question{questions.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
          <button
            id="add-question-btn"
            onClick={() => navigate('/add-question')}
            className="btn-primary"
          >
            <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-5 h-5 border-2 border-dm-accent border-t-transparent rounded-full animate-spin" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-20 text-xs text-red-400">
              Error: {error}
            </div>
          ) : questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-dm-placeholder">
              <svg className="w-8 h-8 mb-3 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-xs">No questions yet.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dm-border bg-dm-hover">
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-dm-text2 uppercase tracking-widest w-16">ID</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-dm-text2 uppercase tracking-widest">Subject</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-dm-text2 uppercase tracking-widest">System</th>
                  <th className="text-left px-5 py-2.5 text-xs font-medium text-dm-text2 uppercase tracking-widest">Topic</th>
                  <th className="text-right px-5 py-2.5 text-xs font-medium text-dm-text2 uppercase tracking-widest w-28">Correct %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dm-border">
                {questions.map((q) => (
                  <tr
                    key={q.id}
                    id={`question-row-${q.id}`}
                    onClick={() => navigate(`/questions/${q.id}`)}
                    className="hover:bg-dm-hover cursor-pointer transition-colors duration-100"
                  >
                    <td className="px-5 py-3 text-dm-text2 font-mono text-xs">{q.id}</td>
                    <td className="px-5 py-3 text-dm-text text-sm">{q.subject || '—'}</td>
                    <td className="px-5 py-3 text-dm-text2 text-sm">{q.system || '—'}</td>
                    <td className="px-5 py-3 text-dm-text2 text-sm">{q.topic || '—'}</td>
                    <td className="px-5 py-3 text-right">
                      {q.correct_pct != null ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-900/30 text-emerald-400">
                          {q.correct_pct}%
                        </span>
                      ) : (
                        <span className="text-dm-placeholder text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  )
}
