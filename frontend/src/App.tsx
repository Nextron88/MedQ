import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Questions from './pages/Questions'
import QuestionDetail from './pages/QuestionDetail'
import AddQuestion from './pages/AddQuestion'
import EditQuestion from './pages/EditQuestion'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/questions" replace />} />
        <Route
          path="/questions"
          element={
            <ProtectedRoute>
              <Questions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id"
          element={
            <ProtectedRoute>
              <QuestionDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/questions/:id/edit"
          element={
            <ProtectedRoute>
              <EditQuestion />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-question"
          element={
            <ProtectedRoute>
              <AddQuestion />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/questions" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
