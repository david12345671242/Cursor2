import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import RequireAuth from '../components/RequireAuth'

interface Summary { id: string; content: string; course_id: string; created_at: string }

export default function Summaries() {
  const { user } = useStore()
  const [summaries, setSummaries] = useState<Summary[]>([])

  useEffect(() => {
    if (!user) return
    supabase.from('summaries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => setSummaries((data as any) || []))
  }, [user])

  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Résumés</h1>
        <div className="grid gap-4">
          {summaries.map(s => (
            <div key={s.id} className="rounded-lg border p-4">
              <div className="text-xs text-neutral-500 mb-2">{new Date(s.created_at).toLocaleString()}</div>
              <div className="whitespace-pre-wrap">{s.content}</div>
            </div>
          ))}
          {summaries.length === 0 && <div>Aucun résumé.</div>}
        </div>
      </div>
    </RequireAuth>
  )
}