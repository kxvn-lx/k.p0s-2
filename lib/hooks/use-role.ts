import { useAuth } from "@/lib/context/auth-context"
import { useSalesmanModeStore } from "@/lib/store/salesman-mode-store"

// ----- Types -----
type Role = "Admin" | "Salesman" | string

interface UseRoleResult {
  /** The actual role from user metadata */
  actualRole: Role
  /** The effective role considering salesman mode (for display logic) */
  effectiveRole: Role
  /** Whether the user is effectively an admin (can be toggled by salesman mode) */
  isAdmin: boolean
  /** Whether the actual authenticated user is an admin */
  isActualAdmin: boolean
  /** Whether salesman mode is active */
  isSalesmanModeEnabled: boolean
  /** Toggle salesman mode (only available for admins) */
  setIsSalesmanModeEnabled: (enabled: boolean) => void
}

/**
 * Custom hook to get the user's role, considering salesman mode.
 * 
 * When salesman mode is enabled, an admin will see the app as a salesman would.
 * The actual role remains unchanged - only the effective role (for UI rendering) changes.
 */
export function useRole(): UseRoleResult {
  const { user } = useAuth()
  const { isSalesmanModeEnabled, setIsSalesmanModeEnabled } = useSalesmanModeStore()

  const actualRole: Role = user?.app_metadata?.role ?? "Salesman"
  const isActualAdmin = actualRole === "Admin"

  // Effective role: if admin has salesman mode on, they see as salesman
  const effectiveRole: Role = isActualAdmin && isSalesmanModeEnabled ? "Salesman" : actualRole
  const isAdmin = effectiveRole === "Admin"

  return {
    actualRole,
    effectiveRole,
    isAdmin,
    isActualAdmin,
    isSalesmanModeEnabled,
    setIsSalesmanModeEnabled,
  }
}
