import type { Session, User } from "@supabase/supabase-js"
import { createContext, use, type PropsWithChildren } from "react"
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
