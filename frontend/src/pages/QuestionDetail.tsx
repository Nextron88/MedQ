import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Layout from '../components/Layout'
import type { Question, QuestionImage, QuestionVideo } from '../types'

const IMAGE_BUCKET = 'question_images'
const LABEL_MAP: Record<string, string> = {
  exp_image: 'Explanation',
  inQuestion_image: 'In-Question',
  reference_image: 'Reference',
}
const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

function getYouTubeEmbedUrl(url: string, start?: number | null, end?: number | null) {
  try {
    const u = new URL(url)
    let videoId = ''
    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1)
    } else {
      videoId = u.searchParams.get('v') ?? ''
    }
    if (!videoId) return null
    let embed = `https://www.youtube.com/embed/${videoId}?rel=0`
    if (start) embed += `&start=${start}`
    if (end) embed += `&end=${end}`
    return embed
  } catch {
    return null
  }
}

export default function QuestionDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [question, setQuestion] = useState<Question | null>(null)
  const [images, setImages] = useState<QuestionImage[]>([])
  const [video, setVideo] = useState<QuestionVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      const [qRes, iRes, vRes] = await Promise.all([
        supabase.from('questions').select('*').eq('id', id).single(),
        supabase.from('question_images').select('*').eq('question_id', id),
        supabase.from('question_videos').select('*').eq('question_id', id).maybeSingle(),
      ])

      if (qRes.error) { setError(qRes.error.message); setLoading(false); return }
      setQuestion(qRes.data as Question)
      setImages((iRes.data ?? []) as QuestionImage[])
      setVideo(vRes.data as QuestionVideo | null)
      setLoading(false)
    }
    fetchData()
  }, [id])

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(storagePath)
    return data.publicUrl
  }

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center py-32">
        <div className="w-5 h-5 border-2 border-dm-accent border-t-transparent rounded-full animate-spin" />
      </div>
    </Layout>
  )

  if (error || !question) return (
    <Layout>
      <div className="py-32 text-center text-xs text-red-400">{error ?? 'Question not found'}</div>
    </Layout>
  )

  const correctIndex = question.correct_answer.charCodeAt(0) - 97

  return (
    <Layout>
      <div className="max-w-3xl">
        {/* Back + Edit */}
        <div className="flex items-center justify-between mb-5">
          <button
            id="back-btn"
            onClick={() => navigate('/questions')}
            className="flex items-center gap-1.5 text-xs text-dm-text2 hover:text-dm-text transition-colors duration-150"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Questions
          </button>
          <button
            id="edit-btn"
            onClick={() => navigate(`/questions/${question.id}/edit`)}
            className="btn-secondary flex items-center gap-1.5 text-xs py-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>
        </div>

        {/* Meta badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {[question.subject, question.system, question.topic].filter(Boolean).map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded bg-dm-hover text-dm-text2 border border-dm-border">
              {tag}
            </span>
          ))}
          <span className="text-xs font-mono text-dm-placeholder ml-auto self-center">#{question.id}</span>
        </div>

        {/* Statement */}
        <div className="card p-5 mb-4">
          <p className="text-sm text-dm-text leading-relaxed">{question.statement}</p>
        </div>

        {/* Options */}
        <div className="card p-5 mb-4">
          <p className="section-title">Options</p>
          <ul className="space-y-1.5">
            {question.options.map((opt, i) => (
              <li
                key={i}
                className={[
                  'flex items-start gap-3 px-3 py-2.5 rounded-md text-sm border',
                  i === correctIndex
                    ? 'bg-emerald-900/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-dm-hover border-dm-border text-dm-text2',
                ].join(' ')}
              >
                <span className={[
                  'w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5',
                  i === correctIndex ? 'bg-emerald-600 text-white' : 'bg-dm-input text-dm-text2',
                ].join(' ')}>
                  {OPTION_LETTERS[i]}
                </span>
                <span>{opt}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-emerald-500 font-medium">
            Correct answer: {OPTION_LETTERS[correctIndex]}
          </p>
        </div>

        {/* Explanation */}
        <div className="card p-5 mb-4">
          <p className="section-title">Explanation</p>
          <p className="text-sm text-dm-text2 leading-relaxed whitespace-pre-wrap">{question.explanation}</p>
        </div>

        {/* Correct % */}
        {question.correct_pct != null && (
          <div className="card p-5 mb-4 flex items-center gap-4">
            <div>
              <p className="text-xs text-dm-text2 mb-1 uppercase tracking-widest">Correct %</p>
              <p className="text-xl font-semibold text-dm-text">{question.correct_pct}%</p>
            </div>
            <div className="flex-1 h-1.5 bg-dm-input rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-emerald-600 rounded-full"
                style={{ width: `${question.correct_pct}%` }}
              />
            </div>
          </div>
        )}

        {/* Images */}
        {images.length > 0 && (
          <div className="card p-5 mb-4">
            <p className="section-title">Images</p>
            <div className="space-y-3">
              {images.map((img) => (
                <div key={img.id} className="border border-dm-border rounded-md overflow-hidden">
                  <img
                    src={getImageUrl(img.storage_path)}
                    alt={img.caption ?? 'Question image'}
                    className="w-full object-contain max-h-72 bg-dm-input"
                  />
                  <div className="px-3 py-2.5 flex items-center gap-2 bg-dm-card border-t border-dm-border">
                    <span className="text-xs px-2 py-0.5 bg-dm-accent/10 text-dm-accent rounded border border-dm-accent/20">
                      {LABEL_MAP[img.type] ?? img.type}
                    </span>
                    {img.caption && <span className="text-xs text-dm-text2">{img.caption}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Video */}
        {video && (() => {
          const embedUrl = getYouTubeEmbedUrl(video.video_url, video.start_time, video.end_time)
          return (
            <div className="card p-5 mb-4">
              <p className="section-title">Video</p>
              {embedUrl ? (
                <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
                  <iframe
                    src={embedUrl}
                    title="Question video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              ) : (
                <a href={video.video_url} target="_blank" rel="noreferrer" className="text-xs text-dm-accent underline break-all">
                  {video.video_url}
                </a>
              )}
              <div className="flex items-center gap-4 mt-3 text-xs text-dm-text2">
                {video.start_time != null && <span>Start: {video.start_time}s</span>}
                {video.end_time != null && <span>End: {video.end_time}s</span>}
                {video.caption && <span>{video.caption}</span>}
              </div>
            </div>
          )
        })()}

        <p className="text-xs text-dm-placeholder text-right mt-2">
          Created {new Date(question.created_at).toLocaleString()}
        </p>
      </div>
    </Layout>
  )
}
