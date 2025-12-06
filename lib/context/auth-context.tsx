import type {  Session, User } from "@supabase/supabase-js"
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react"
import { useStorageState } from "../hooks/use-storage-state"
import { supabase } from "../config/supabase"

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
  const [[isStorageLoading, sessionString], setSessionString] =
    useStorageState("session")
  const [isValidating, setIsValidating] = useState(false)

  const session = useMemo<Session | null>(
    () => (sessionString ? JSON.parse(sessionString) : null),
    [sessionString]
  )
  const user = session?.user ?? null

  const updateSession = useCallback(
    (newSession: Session | null) => {
      if (newSession) {
        setSessionString(JSON.stringify(newSession))
      } else {
        setSessionString(null)
      }
    },
    [setSessionString]
  )

  const validateSession = useCallback(async () => {
    if (isStorageLoading) return

    setIsValidating(true)
    try {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        updateSession(null)
      } else if (sessionString) {
        const currentSession = JSON.parse(sessionString)
        const {
          data: { session: freshSession },
        } = await supabase.auth.getSession()

        if (freshSession && JSON.stringify(freshSession) !== sessionString) {
          updateSession(freshSession)
        }
      }
    } catch (err) {
      console.error("Session validation error:", err)
      updateSession(null)
    } finally {
      setIsValidating(false)
    }
  }, [isStorageLoading, sessionString, updateSession])

  useEffect(() => {
    validateSession()
  }, [])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      updateSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [updateSession])

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (data.session) updateSession(data.session)
    },
    [updateSession]
  )

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    updateSession(null)
  }, [updateSession])

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        session,
        user,
        isLoading: isStorageLoading || isValidating,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
