import { Link } from 'react-router-dom'
import { Calendar, FileText, NotebookText, Layers3, Sparkles } from 'lucide-react'

import RequireAuth from '../components/RequireAuth'

export default function Dashboard() {
  return (
    <RequireAuth>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold flex items-center gap-2"><Layers3 className="h-5 w-5 text-sky-500"/> StudyHub</h1>
        <Link to="/auth" className="text-sm underline">Changer de compte</Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/calendar" className="rounded-lg border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center gap-2 font-medium"><Calendar className="h-4 w-4"/> Calendrier</div>
          <p className="text-sm text-neutral-500">Planifiez vos révisions</p>
        </Link>
        <Link to="/courses" className="rounded-lg border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center gap-2 font-medium"><FileText className="h-4 w-4"/> Importation de cours</div>
          <p className="text-sm text-neutral-500">PDF, DOCX, images</p>
        </Link>
        <Link to="/qcm" className="rounded-lg border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center gap-2 font-medium"><NotebookText className="h-4 w-4"/> QCM</div>
          <p className="text-sm text-neutral-500">Générez et révisez</p>
        </Link>
        <Link to="/flashcards" className="rounded-lg border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center gap-2 font-medium"><NotebookText className="h-4 w-4"/> Flashcards</div>
          <p className="text-sm text-neutral-500">Répétition espacée</p>
        </Link>
        <Link to="/summaries" className="rounded-lg border p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900">
          <div className="flex items-center gap-2 font-medium"><NotebookText className="h-4 w-4"/> Résumés</div>
          <p className="text-sm text-neutral-500">Synthèses automatiques</p>
        </Link>
        <div className="rounded-lg border p-4">
          <div className="flex items-center gap-2 font-medium"><Sparkles className="h-4 w-4 text-sky-500"/> Stats (bientôt)</div>
          <p className="text-sm text-neutral-500">Progression, temps passé, réussite</p>
        </div>
      </div>
    </div>
    </RequireAuth>
  )
}