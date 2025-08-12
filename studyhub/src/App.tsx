import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Calendar as CalendarIcon, FileText, Layers3, NotebookText, Home, Sun, Moon } from 'lucide-react'
import './index.css'

const Auth = lazy(() => import('./pages/Auth'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CalendarPage = lazy(() => import('./pages/Calendar'))
const Courses = lazy(() => import('./pages/Courses'))
const Qcm = lazy(() => import('./pages/Qcm'))
const Flashcards = lazy(() => import('./pages/Flashcards'))
const Summaries = lazy(() => import('./pages/Summaries'))

function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    root.classList.toggle('dark', !isDark)
    localStorage.setItem('theme', !isDark ? 'dark' : 'light')
  }
  return (
    <button onClick={toggle} className="inline-flex items-center gap-2 rounded-md border px-3 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800">
      <Sun className="h-4 w-4 dark:hidden" />
      <Moon className="h-4 w-4 hidden dark:block" />
      Thème
    </button>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 backdrop-blur bg-white/70 dark:bg-neutral-950/70 border-b">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <Layers3 className="h-5 w-5 text-sky-500" /> StudyHub
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/dashboard" className="hover:text-sky-500 flex items-center gap-1"><Home className="h-4 w-4"/> Dashboard</Link>
            <Link to="/calendar" className="hover:text-sky-500 flex items-center gap-1"><CalendarIcon className="h-4 w-4"/> Calendrier</Link>
            <Link to="/courses" className="hover:text-sky-500 flex items-center gap-1"><FileText className="h-4 w-4"/> Cours</Link>
            <Link to="/qcm" className="hover:text-sky-500 flex items-center gap-1"><NotebookText className="h-4 w-4"/> QCM</Link>
            <Link to="/flashcards" className="hover:text-sky-500 flex items-center gap-1"><NotebookText className="h-4 w-4"/> Flashcards</Link>
            <Link to="/summaries" className="hover:text-sky-500 flex items-center gap-1"><NotebookText className="h-4 w-4"/> Résumés</Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default function App() {
  // set theme from storage
  if (typeof document !== 'undefined') {
    const stored = localStorage.getItem('theme')
    if (stored) document.documentElement.classList.toggle('dark', stored === 'dark')
  }
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-10 text-center">Chargement…</div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/auth" element={<Layout><Auth /></Layout>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
          <Route path="/courses" element={<Layout><Courses /></Layout>} />
          <Route path="/qcm" element={<Layout><Qcm /></Layout>} />
          <Route path="/flashcards" element={<Layout><Flashcards /></Layout>} />
          <Route path="/summaries" element={<Layout><Summaries /></Layout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
