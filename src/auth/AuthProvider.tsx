import { createContext, useCallback, useMemo, useState } from 'react'
import { authApi } from '@/api/authApi'
import type { LoginPayload, LoginRequest, TokenPair } from '@/api/types'
import { tokenStorage, type AuthTokens, type StoredAuth } from './tokenStorage'

type AuthContextValue = {
  user: LoginPayload | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  logout: () => Promise<void>
  refreshTokens: () => Promise<void>
}

const defaultSnapshot: StoredAuth = tokenStorage.getSnapshot()

export const AuthContext = createContext<AuthContextValue>({
  user: defaultSnapshot.user,
  tokens: defaultSnapshot.tokens,
  isAuthenticated: Boolean(defaultSnapshot.tokens?.accessToken),
  loading: false,
  error: null,
  async login() {},
  async logout() {},
  async refreshTokens() {},
})

const toTokenPair = (payload?: LoginPayload | null): TokenPair | null => {
  if (!payload?.accessToken || !payload.refreshToken) {
    return null
  }
  return {
    accessToken: payload.accessToken,
    refreshToken: payload.refreshToken,
    accessExpEpochSec: payload.accessTokenExp,
    refreshExpEpochSec: payload.refreshTokenExp,
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [snapshot, setSnapshot] = useState<StoredAuth>(defaultSnapshot)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const updateState = (next: StoredAuth) => {
    setSnapshot(next)
  }

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const loginResponse = await authApi.login(payload)
      const tokensFromLogin = toTokenPair(loginResponse)
      tokenStorage.hydrate(loginResponse, tokensFromLogin)
      updateState(tokenStorage.getSnapshot())
    } catch (err) {
      tokenStorage.clear()
      updateState(tokenStorage.getSnapshot())
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await authApi.logout()
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그아웃에 실패했습니다.')
    } finally {
      tokenStorage.clear()
      updateState(tokenStorage.getSnapshot())
      setLoading(false)
    }
  }, [])

  const refreshTokens = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const refreshed = await authApi.refresh()
      tokenStorage.setTokens(refreshed)
      updateState(tokenStorage.getSnapshot())
    } catch (err) {
      setError(err instanceof Error ? err.message : '토큰 갱신에 실패했습니다.')
      tokenStorage.clear()
      updateState(tokenStorage.getSnapshot())
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user: snapshot.user,
      tokens: snapshot.tokens,
      isAuthenticated: Boolean(snapshot.tokens?.accessToken),
      loading,
      error,
      login,
      logout,
      refreshTokens,
    }),
    [snapshot, loading, error, login, logout, refreshTokens],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

