import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { User } from '../types'
import { users } from '../data/users'
import { getSession, setSession } from '../utils/storage'
import * as api from '../services/api'

interface AuthContextValue {
  user: User | null
  authStatus: 'anonymous' | 'password' | 'authenticated'
  mfaStatus: 'pending' | 'verified'
  login: (officerId: string, password: string) => Promise<void>
  verifyMfa: (code: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readUser(): { user: User | null; authStatus: AuthContextValue['authStatus']; mfaStatus: AuthContextValue['mfaStatus'] } {
  const s = getSession()
  const user = s.currentUserId ? users.find((u) => u.id === s.currentUserId) ?? null : null
  return { user: s.authStatus === 'authenticated' || s.authStatus === 'password' ? user : null, authStatus: s.authStatus, mfaStatus: s.mfaStatus }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readUser)

  const refresh = useCallback(() => setState(readUser()), [])

  const login = useCallback(async (officerId: string, password: string) => {
    await api.login(officerId, password)
    setState(readUser())
  }, [])

  const verifyMfa = useCallback(async (code: string) => {
    await api.verifyMFA(code)
    setState(readUser())
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setSession({ currentUserId: null, authStatus: 'anonymous', mfaStatus: 'pending' })
    setState(readUser())
  }, [])

  const value = useMemo(
    () => ({ ...state, login, verifyMfa, logout, refresh }),
    [state, login, verifyMfa, logout, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
