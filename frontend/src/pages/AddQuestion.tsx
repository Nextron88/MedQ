import { useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'
import Layout from '../components/Layout'
import type { ImageUploadItem, VideoFormData } from '../types'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']
const IMAGE_BUCKET = 'question_images'
const IMAGE_TYPES = [
  { value: 'exp_image', label: 'Explanation Image' },
  { value: 'inQuestion_image', label: 'In-Question Image' },
  { value: 'reference_image', label: 'Reference Image' },
] as const

const emptyVideo: VideoFormData = { video_url: '', start_time: '', end_time: '', caption: '' }

export default function AddQuestion() {
  const navigate = useNavigate()

  const [statement, setStatement] = useState('')
  const [options, setOptions] = useState<string[]>(['', '', '', ''])
  const [correctAnswer, setCorrectAnswer] = useState('a')
  const [explanation, setExplanation] = useState('')
  const [subject, setSubject] = useState('')
  const [system, setSystem] = useState('')
  const [topic, setTopic] = useState('')
  const [correctPct, setCorrectPct] = useState('')
  const [imageItems, setImageItems] = useState<ImageUploadItem[]>([])
  const [hasVideo, setHasVideo] = useState(false)
  const [video, setVideo] = useState<VideoFormData>(emptyVideo)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const updateOption = (i: number, val: string) =>
    setOptions((prev) => prev.map((o, idx) => (idx === i ? val : o)))
  const addOption = () => { if (options.length < 6) setOptions((prev) => [...prev, '']) }
  const removeOption = (i: number) => {
    if (options.length <= 4) return
    const next = options.filter((_, idx) => idx !== i)
    setOptions(next)
    if (correctAnswer.charCodeAt(0) - 97 > next.length - 1) setCorrectAnswer('a')
  }

  const addImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    setImageItems((prev) => [...prev, ...files.map((f) => ({ file: f, caption: '', type: 'exp_image' as const }))])
    e.target.value = ''
  }
  const updateImageCaption = (i: number, caption: string) =>
    setImageItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, caption } : item)))
  const updateImageType = (i: number, type: ImageUploadItem['type']) =>
    setImageItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, type } : item)))
  const removeImage = (i: number) =>
    setImageItems((prev) => prev.filter((_, idx) => idx !== i))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    try {
      const { data: qData, error: qError } = await supabase
        .from('questions')
        .insert({ statement, options, correct_answer: correctAnswer, explanation, subject, system, topic,
          correct_pct: correctPct !== '' ? parseFloat(correctPct) : null })
        .select('id').single()

      if (qError) throw new Error(qError.message)
      const questionId = qData.id as number

      for (let i = 0; i < imageItems.length; i++) {
        const item = imageItems[i]
        const storagePath = `${questionId}_img_${i + 1}.png`
        const { error: uploadError } = await supabase.storage
          .from(IMAGE_BUCKET).upload(storagePath, item.file, { upsert: true })
        if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`)
        const { error: imgRowError } = await supabase.from('question_images')
          .insert({ question_id: questionId, storage_path: storagePath, caption: item.caption || null, type: item.type })
        if (imgRowError) throw new Error(imgRowError.message)
      }

      if (hasVideo && video.video_url.trim()) {
        const { error: vidError } = await supabase.from('question_videos').insert({
          question_id: questionId, video_url: video.video_url.trim(),
          start_time: video.start_time !== '' ? parseInt(video.start_time) : null,
          end_time: video.end_time !== '' ? parseInt(video.end_time) : null,
          caption: video.caption || null,
        })
        if (vidError) throw new Error(vidError.message)
      }

      navigate('/questions')
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed')
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl">
        <div className="mb-5">
          <h1 className="text-base font-semibold text-dm-text">Add Question</h1>
          <p className="text-xs text-dm-text2 mt-0.5">Fill in all fields and submit to save to the database.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Statement */}
          <div className="card p-5">
            <p className="section-title">Statement</p>
            <textarea id="statement" required rows={4} value={statement}
              onChange={(e) => setStatement(e.target.value)}
              placeholder="Enter the question stem…" className="input resize-y" />
          </div>

          {/* Options */}
          <div className="card p-5">
            <p className="section-title">Answer Options</p>
            <div className="space-y-2">
              {options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-dm-input text-dm-text2 text-xs font-bold flex items-center justify-center shrink-0">
                    {OPTION_LETTERS[i]}
                  </span>
                  <input id={`option-${i}`} type="text" required value={opt}
                    onChange={(e) => updateOption(i, e.target.value)}
                    placeholder={`Option ${OPTION_LETTERS[i]}`} className="input flex-1" />
                  {options.length > 4 && (
                    <button type="button" onClick={() => removeOption(i)} className="btn-danger px-2 py-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
            {options.length < 6 && (
              <button type="button" onClick={addOption} id="add-option-btn"
                className="mt-3 text-xs text-dm-accent hover:text-dm-accent-hover font-medium flex items-center gap-1 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Add option ({options.length}/6)
              </button>
            )}
            <div className="mt-4 pt-4 border-t border-dm-border">
              <label htmlFor="correct-answer" className="label">Correct Answer</label>
              <select id="correct-answer" value={correctAnswer}
                onChange={(e) => setCorrectAnswer(e.target.value)} className="input w-28">
                {options.map((_, i) => (
                  <option key={i} value={String.fromCharCode(97 + i)}>{OPTION_LETTERS[i]}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Explanation */}
          <div className="card p-5">
            <p className="section-title">Explanation</p>
            <textarea id="explanation" required rows={5} value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain the correct answer…" className="input resize-y" />
          </div>

          {/* Classification */}
          <div className="card p-5">
            <p className="section-title">Classification</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="subject" className="label">Subject</label>
                <input id="subject" type="text" required value={subject}
                  onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Cardiology" className="input" />
              </div>
              <div>
                <label htmlFor="system" className="label">System</label>
                <input id="system" type="text" required value={system}
                  onChange={(e) => setSystem(e.target.value)} placeholder="e.g. Cardiovascular" className="input" />
              </div>
              <div>
                <label htmlFor="topic" className="label">Topic</label>
                <input id="topic" type="text" required value={topic}
                  onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Heart Failure" className="input" />
              </div>
              <div>
                <label htmlFor="correct-pct" className="label">
                  Correct % <span className="text-dm-placeholder font-normal">(optional)</span>
                </label>
                <input id="correct-pct" type="number" min="0" max="100" step="0.1"
                  value={correctPct} onChange={(e) => setCorrectPct(e.target.value)}
                  placeholder="e.g. 72.5" className="input" />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="card p-5">
            <p className="section-title">Images</p>
            {imageItems.length > 0 && (
              <div className="space-y-2 mb-3">
                {imageItems.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start p-3 border border-dm-border rounded-md bg-dm-input">
                    <img src={URL.createObjectURL(item.file)} alt=""
                      className="w-14 h-14 object-cover rounded border border-dm-border2 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <input type="text" value={item.caption}
                        onChange={(e) => updateImageCaption(i, e.target.value)}
                        placeholder="Caption (optional)" className="input text-xs" />
                      <select value={item.type}
                        onChange={(e) => updateImageType(i, e.target.value as ImageUploadItem['type'])}
                        className="input text-xs">
                        {IMAGE_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <button type="button" onClick={() => removeImage(i)} className="btn-danger px-2 py-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label htmlFor="image-upload"
              className="flex items-center justify-center gap-2 w-full py-5 border border-dashed border-dm-border2 rounded-md text-xs text-dm-text2 hover:border-dm-accent hover:text-dm-accent cursor-pointer transition-colors duration-150">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Click to add images
              <input id="image-upload" type="file" accept="image/*" multiple onChange={addImages} className="hidden" />
            </label>
          </div>

          {/* Video */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title mb-0">Video</p>
              <button type="button" id="toggle-video-btn"
                onClick={() => { setHasVideo((v) => !v); setVideo(emptyVideo) }}
                className={['relative inline-flex h-5 w-9 rounded-full transition-colors duration-200',
                  hasVideo ? 'bg-dm-accent' : 'bg-dm-input'].join(' ')}>
                <span className={['absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                  hasVideo ? 'translate-x-4' : 'translate-x-0'].join(' ')} />
              </button>
            </div>
            {hasVideo ? (
              <div className="space-y-3">
                <div>
                  <label htmlFor="video-url" className="label">YouTube URL</label>
                  <input id="video-url" type="url" value={video.video_url}
                    onChange={(e) => setVideo((v) => ({ ...v, video_url: e.target.value }))}
                    placeholder="https://www.youtube.com/watch?v=..." className="input" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="start-time" className="label">Start (seconds)</label>
                    <input id="start-time" type="number" min="0" value={video.start_time}
                      onChange={(e) => setVideo((v) => ({ ...v, start_time: e.target.value }))}
                      placeholder="e.g. 30" className="input" />
                  </div>
                  <div>
                    <label htmlFor="end-time" className="label">End (seconds)</label>
                    <input id="end-time" type="number" min="0" value={video.end_time}
                      onChange={(e) => setVideo((v) => ({ ...v, end_time: e.target.value }))}
                      placeholder="e.g. 90" className="input" />
                  </div>
                </div>
                <div>
                  <label htmlFor="video-caption" className="label">Caption (optional)</label>
                  <input id="video-caption" type="text" value={video.caption}
                    onChange={(e) => setVideo((v) => ({ ...v, caption: e.target.value }))}
                    placeholder="Describe the video…" className="input" />
                </div>
              </div>
            ) : (
              <p className="text-xs text-dm-placeholder">Toggle on to attach a YouTube video to this question.</p>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-950/40 border border-red-900/50 rounded-md text-xs text-red-400">
              <svg className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {submitError}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pb-8">
            <button id="submit-btn" type="submit" disabled={submitting} className="btn-primary px-6">
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving…
                </span>
              ) : 'Save Question'}
            </button>
            <button type="button" onClick={() => navigate('/questions')}
              className="btn-secondary" disabled={submitting}>Cancel</button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
