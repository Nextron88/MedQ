import { type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

interface Props {
  children: ReactNode
}

export default function ProtectedRoute({ children }: Props) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dm-bg">
        <div className="w-5 h-5 border-2 border-dm-accent border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // No valid session → send to login, no exceptions
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
