import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser, TokenPair } from '../types'

interface AuthState {
  user: AuthUser | null
  accessToken: string | null
  refreshToken: string | null
  setTokens: (tokens: TokenPair, user?: AuthUser) => void
  setUser: (user: AuthUser) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: (tokens, user) =>
        set((state) => ({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user: user ?? state.user,
        })),
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    { name: 'planner-auth' },
  ),
)
