import { QueryClient } from "@tanstack/react-query"
import { supabase } from "./supabase"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false,
    },
    mutations: {
      retry: 2,
    },
  },
})

// ----- Auth Integration -----

supabase.auth.onAuthStateChange((event) => {
  if (event === "SIGNED_OUT") {
    queryClient.clear()
  } else if (event === "TOKEN_REFRESHED") {
    queryClient.invalidateQueries()
  }
})
