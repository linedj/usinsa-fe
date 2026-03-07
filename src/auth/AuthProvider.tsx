import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '@/api/authApi'
import { cartApi } from '@/api/cartApi'
import { http } from '@/api/http'
import { guestId } from '@/utils/guestId'
import type { LoginRequest, MeResponse, SignUpRequest } from '@/api/types'

type AuthContextValue = {
  user: MeResponse | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  login: (payload: LoginRequest) => Promise<void>
  signup: (payload: SignUpRequest) => Promise<void>
  redirectToOauth: (provider: 'google' | 'kakao' | 'naver') => void
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  /** OAuth 로그인 완료 후 OauthCallbackPage에서 호출 */
  afterOAuthLogin: () => Promise<void>
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
  async afterOAuthLogin() {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMe = useCallback(async () => {
    try {
      const { data } = await http.get<{ success: boolean; data: MeResponse }>('/api/v1/auth/me')
      setUser(data.success ? data.data : null)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    fetchMe().finally(() => setLoading(false))
  }, [fetchMe])

  /**
   * 로그인 성공 후 비회원 장바구니 병합 처리
   * - guestId가 존재하는 경우에만 병합 API 호출
   * - 병합 성공 후 guestId 제거
   * - 실패해도 로그인 자체는 성공으로 처리 (장바구니는 유실되지 않음)
   */
  const mergeGuestCartIfNeeded = useCallback(async (memberId: number) => {
    if (!guestId.exists()) return
    try {
      await cartApi.mergeGuestCart(memberId)
      guestId.clear()
    } catch (err) {
      // 병합 실패 시 guestId를 유지해 다음 기회에 재시도 가능하도록 함
      console.warn('비회원 장바구니 병합 실패 (guestId 유지):', err)
    }
  }, [])

  const login = useCallback(async (payload: LoginRequest) => {
    setLoading(true)
    setError(null)
    try {
      await authApi.login(payload)
      const { data } = await http.get<{ success: boolean; data: MeResponse }>('/api/v1/auth/me')
      const me = data.success ? data.data : null
      setUser(me)

      // 로그인 성공 후 비회원 장바구니 병합
      if (me?.memberId) {
        await mergeGuestCartIfNeeded(me.memberId)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
      throw err
    } finally {
      setLoading(false)
    }
  }, [mergeGuestCartIfNeeded])

  /**
   * OAuth 로그인 완료 후 OauthCallbackPage에서 호출
   * 쿠키가 이미 세팅된 상태이므로 me() 조회 + 병합만 수행
   */
  const afterOAuthLogin = useCallback(async () => {
    try {
      const { data } = await http.get<{ success: boolean; data: MeResponse }>('/api/v1/auth/me')
      const me = data.success ? data.data : null
      setUser(me)

      if (me?.memberId) {
        await mergeGuestCartIfNeeded(me.memberId)
      }
    } catch (err) {
      console.error('OAuth 로그인 후처리 실패:', err)
    }
  }, [mergeGuestCartIfNeeded])

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
      // guestId는 유지 — 로그아웃 후 비회원으로 돌아와도 장바구니 접근 가능
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
      afterOAuthLogin,
    }),
    [user, loading, error, login, signup, redirectToOauth, logout, fetchMe, afterOAuthLogin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
