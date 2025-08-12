import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import RequireAuth from '../components/RequireAuth'

interface Flashcard { id: string; front: string; back: string; course_id: string }

export default function Flashcards() {
  const { user } = useStore()
  const [cards, setCards] = useState<Flashcard[]>([])
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    if (!user) return
    supabase.from('flashcards').select('*').eq('user_id', user.id).then(({ data }) => setCards((data as any) || []))
  }, [user])

  const next = () => { setFlipped(false); setIndex(i => (i + 1) % Math.max(cards.length, 1)) }
  const prev = () => { setFlipped(false); setIndex(i => (i - 1 + Math.max(cards.length, 1)) % Math.max(cards.length, 1)) }

  const current = cards[index]

  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Flashcards</h1>
        {current ? (
          <div className="space-y-3">
            <div className="rounded-lg border p-6 min-h-40 cursor-pointer" onClick={()=>setFlipped(f => !f)}>
              {!flipped ? <div className="font-medium whitespace-pre-wrap">{current.front}</div> : <div className="whitespace-pre-wrap text-neutral-600 dark:text-neutral-300">{current.back}</div>}
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-md border px-3 py-1 text-sm" onClick={prev}>Précédent</button>
              <button className="rounded-md border px-3 py-1 text-sm" onClick={next}>Suivant</button>
            </div>
          </div>
        ) : (
          <div>Aucune flashcard.</div>
        )}
      </div>
    </RequireAuth>
  )
}