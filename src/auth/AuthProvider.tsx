import { createContext, useCallback, useMemo, useState } from 'react'
import { authApi } from '@/api/authApi'
import type { LoginPayload, LoginRequest, TokenPair, SignUpRequest, OAuthLoginRequest } from '@/api/types'
import { tokenStorage, type AuthTokens, type StoredAuth } from './tokenStorage'

type AuthContextValue = {
  user: LoginPayload | null
  tokens: AuthTokens | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  signup: (payload: SignUpRequest) => Promise<void>
  oauthLogin: (payload: OAuthLoginRequest) => Promise<void>
  redirectToOauth: (provider: 'google' | 'kakao' | 'naver') => void
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
  async signup() {},
  async oauthLogin() {},
  redirectToOauth: () => {},
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

  const signup = useCallback(async (payload: SignUpRequest) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.signup(payload)
    } catch (err) {
      setError(err instanceof Error ? err.message : '회원가입에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const oauthLogin = useCallback(async (payload: OAuthLoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      const loginResponse = await authApi.oauthLogin(payload)
      const tokensFromLogin = toTokenPair(loginResponse)
      tokenStorage.hydrate(loginResponse, tokensFromLogin)
      updateState(tokenStorage.getSnapshot())
    } catch (err) {
      tokenStorage.clear()
      updateState(tokenStorage.getSnapshot())
      setError(err instanceof Error ? err.message : 'OAuth 로그인에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const redirectToOauth = useCallback((provider: 'google' | 'kakao' | 'naver') => {
    authApi.redirectToOauth(provider)
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
      signup,
      oauthLogin,
      redirectToOauth,
      logout,
      refreshTokens,
    }),
    [snapshot, loading, error, login, signup, oauthLogin, redirectToOauth, logout, refreshTokens],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

