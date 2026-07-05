import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, signOut } from '../lib/auth'

export default function TopBar() {
  const [email, setEmail] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getUser().then((user) => setEmail(user?.email ?? null))
  }, [])

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="h-12 bg-dm-sidebar border-b border-dm-border flex items-center justify-between px-6 shrink-0">
      <div className="text-xs text-dm-text2">
        {email && (
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            {email}
          </span>
        )}
      </div>
      <button
        id="logout-btn"
        onClick={handleLogout}
        className="flex items-center gap-1.5 text-xs text-dm-text2 hover:text-dm-text transition-colors duration-150 px-2.5 py-1.5 rounded-md hover:bg-dm-hover"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </header>
  )
}
