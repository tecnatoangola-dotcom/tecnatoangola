import { useEffect, useMemo, useState } from 'react'
import { AuthContext } from './authContext.js'
import { isSupabaseConfigured, supabase } from './supabase.js'

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(() => !isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let active = true

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      setSession(data.session)
      setLoading(false)
    })

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!active) return
      setSession(next)
      setLoading(false)
    })

    return () => {
      active = false
      subscription.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo(() => {
    async function signIn({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      return data
    }

    async function signUp({ nome, email, password }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
          // em produção o domínio é o mesmo; em dev a origem do localhost
          emailRedirectTo: `${window.location.origin}/confirmacao`,
        },
      })
      if (error) throw error
      return data
    }

    async function signOut() {
      await supabase.auth.signOut()
    }

    return {
      session,
      user: session?.user ?? null,
      loading,
      signIn,
      signUp,
      signOut,
    }
  }, [session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
