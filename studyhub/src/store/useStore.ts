import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'

interface AppState {
  session: Session | null
  user: User | null
  setSession: (session: Session | null) => void
}

export const useStore = create<AppState>((set) => ({
  session: null,
  user: null,
  setSession: (session) => set({ session, user: session?.user ?? null })
}))