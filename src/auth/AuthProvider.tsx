import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/api/authApi'
import { http } from '@/api/http'
import type { LoginRequest, SignUpRequest } from '@/api/types'

type UserInfo = {
  memberId: number
  email: string
  name: string
  nickname: string
}

type AuthContextValue = {
  user: UserInfo | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  signup: (payload: SignUpRequest) => Promise<void>
  redirectToOauth: (provider: 'google' | 'kakao' | 'naver') => void
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  async login() {},
  async signup() {},
  redirectToOauth: () => {},
  async logout() {},
  async fetchMe() {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [loading, setLoading] = useState(true) // 초기 me() 호출 대기
  const [error, setError] = useState<string | null>(null)

  // 앱 시작 시 쿠키로 로그인 상태 복원
  const fetchMe = useCallback(async () => {
    try {
      const { data } = await http.get<{ success: boolean; data: UserInfo }>('/api/v1/auth/me')
      setUser(data.success ? data.data : null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    fetchMe().finally(() => setLoading(false))
  }, [fetchMe])

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      // 일반 로그인: 백엔드가 쿠키에 토큰을 기록하고 JSON도 반환
      await authApi.login(payload)
      await fetchMe()
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchMe])

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

  const redirectToOauth = useCallback((provider: 'google' | 'kakao' | 'naver') => {
    authApi.redirectToOauth(provider)
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await authApi.logout()
    } finally {
      setUser(null)
      setLoading(false)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      loading,
      error,
      login,
      signup,
      redirectToOauth,
      logout,
      fetchMe,
    }),
    [user, loading, error, login, signup, redirectToOauth, logout, fetchMe],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
