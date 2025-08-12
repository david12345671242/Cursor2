import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { session, setSession } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [setSession])

  if (loading) return <div className="p-10 text-center">Chargement…</div>
  if (!session) return <Navigate to="/auth" replace />
  return <>{children}</>
}