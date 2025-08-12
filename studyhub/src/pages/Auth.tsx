import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useStore } from '../store/useStore'
import { LogIn } from 'lucide-react'

export default function Auth() {
  const { setSession } = useStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    return () => listener.subscription.unsubscribe()
  }, [setSession])

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage('Compte créé. Vérifiez votre email pour confirmer.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleOAuth = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
      if (error) throw error
    } catch (e: any) {
      setMessage(e.message)
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!email) return setMessage('Entrez votre email')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/auth'
    })
    if (error) setMessage(error.message)
    else setMessage('Email de réinitialisation envoyé')
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4 flex items-center gap-2"><LogIn className="h-5 w-5"/> Connexion</h1>
      <div className="space-y-3">
        <input value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" type="email" className="w-full rounded-md border bg-transparent px-3 py-2"/>
        <input value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mot de passe" type="password" className="w-full rounded-md border bg-transparent px-3 py-2"/>
        <div className="flex items-center gap-3">
          <button disabled={loading} onClick={handleAuth} className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
            {mode === 'signup' ? 'Créer un compte' : 'Se connecter'}
          </button>
          <button disabled={loading} onClick={()=>setMode(mode==='signup'?'signin':'signup')} className="text-sm underline">
            {mode === 'signup' ? 'Déjà un compte ?' : "Pas de compte ? S'inscrire"}
          </button>
          <button disabled={loading} onClick={resetPassword} className="text-sm underline">Mot de passe oublié</button>
        </div>
        <div>
          <button disabled={loading} onClick={handleOAuth} className="rounded-md border px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">Continuer avec Google</button>
        </div>
        {message && <p className="text-sm text-red-500">{message}</p>}
      </div>
    </div>
  )
}