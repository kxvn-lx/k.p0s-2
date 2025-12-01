import type { Session, User } from "@supabase/supabase-js"
import { createContext, use, useEffect, type PropsWithChildren } from "react"
import { useStorageState } from "./hooks/use-storage-state"
import { supabase } from "./supabase"

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  session: Session | null
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  signIn: async () => {},
  signOut: async () => {},
  session: null,
  user: null,
  isLoading: false,
})

export function useAuth() {
  const value = use(AuthContext)
  if (!value) {
    throw new Error("useAuth must be wrapped in a <AuthProvider />")
  }
  return value
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [[isLoading, sessionString], setSessionString] =
    useStorageState("session")

  const session: Session | null = sessionString
    ? JSON.parse(sessionString)
    : null
  const user = session?.user ?? null

  // Validate session on mount and listen for auth state changes
  useEffect(() => {
    // Validate the cached session with Supabase
    const validateSession = async () => {
      const { data, error } = await supabase.auth.getSession()

      if (error || !data.session) {
        // Session is invalid or expired, clear it
        if (sessionString) {
          setSessionString(null)
        }
      } else if (data.session) {
        // Session is valid, update storage with fresh session
        const freshSessionString = JSON.stringify(data.session)
        if (freshSessionString !== sessionString) {
          setSessionString(freshSessionString)
        }
      }
    }

    if (!isLoading) {
      validateSession()
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setSessionString(JSON.stringify(session))
      } else {
        setSessionString(null)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isLoading, sessionString, setSessionString])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      throw error
    }

    if (data.session) {
      setSessionString(JSON.stringify(data.session))
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw error
    }

    setSessionString(null)
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
