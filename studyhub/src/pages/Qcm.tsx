import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import RequireAuth from '../components/RequireAuth'

interface QcmQuestion { id: string; question: string; options: string[]; answer_index: number; course_id: string }

export default function Qcm() {
  const { user } = useStore()
  const [questions, setQuestions] = useState<QcmQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, number | null>>({})
  const [score, setScore] = useState<number | null>(null)

  useEffect(() => {
    if (!user) return
    supabase.from('qcm_questions').select('*').eq('user_id', user.id).then(({ data }) => setQuestions((data as any) || []))
  }, [user])

  const submit = () => {
    let s = 0
    for (const q of questions) {
      if (answers[q.id] === q.answer_index) s++
    }
    setScore(Math.round((s / Math.max(1, questions.length)) * 100))
  }

  return (
    <RequireAuth>
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">QCM</h1>
        <div className="space-y-6">
          {questions.map(q => (
            <div key={q.id} className="rounded-lg border p-4">
              <div className="font-medium mb-2">{q.question}</div>
              <div className="grid gap-2">
                {q.options?.map((opt, idx) => (
                  <label key={idx} className="flex items-center gap-2 text-sm">
                    <input type="radio" name={q.id} checked={answers[q.id] === idx} onChange={()=>setAnswers(a=>({...a,[q.id]:idx}))}/>
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          {questions.length > 0 && <button onClick={submit} className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">Valider</button>}
          {score !== null && <div className="text-sm">Score: {score}%</div>}
        </div>
      </div>
    </RequireAuth>
  )
}