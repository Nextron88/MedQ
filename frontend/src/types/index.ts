// ============================================================
// Supabase table types
// ============================================================

export interface Question {
  id: number
  statement: string
  options: string[]
  correct_answer: string // 'a' | 'b' | 'c' | 'd' | 'e' | 'f'
  explanation: string
  subject: string
  system: string
  topic: string
  correct_pct: number | null
  created_at: string
}

export interface QuestionImage {
  id: string
  question_id: number
  storage_path: string
  caption: string | null
  type: 'exp_image' | 'inQuestion_image' | 'reference_image'
}

export interface QuestionVideo {
  id: string
  question_id: number
  video_url: string
  start_time: number | null
  end_time: number | null
  caption: string | null
}

// ============================================================
// Form types
// ============================================================

export interface ImageUploadItem {
  file: File
  caption: string
  type: 'exp_image' | 'inQuestion_image' | 'reference_image'
}

export interface VideoFormData {
  video_url: string
  start_time: string
  end_time: string
  caption: string
}
