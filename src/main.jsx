import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { supabase, supabaseEnabled } from './lib/supabaseClient'
import './index.css'

function SupabaseAuthBridge() {
  const [isLoading, setIsLoading] = React.useState(true)
  const [user, setUser] = React.useState(null)

  React.useEffect(() => {
    let mounted = true

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!mounted) return
      setUser(data.session?.user ?? null)
      setIsLoading(false)
    }

    loadSession()

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const onSignIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const onSignUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <App
      auth={{
        enabled: true,
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        onSignIn,
        onSignUp,
        onLogout,
      }}
    />
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {supabaseEnabled ? (
      <SupabaseAuthBridge />
    ) : (
      <App
        auth={{
          enabled: true,
          user: null,
          isAuthenticated: false,
          isLoading: false,
          onSignIn: async () => {
            throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
          },
          onSignUp: async () => {
            throw new Error('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local')
          },
          onLogout: async () => {},
        }}
      />
    )}
  </React.StrictMode>,
)
