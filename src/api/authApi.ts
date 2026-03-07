import { http } from './http'
import type {
  LoginEnvelope,
  LoginPayload,
  LoginRequest,
  LogoutEnvelope,
  SignUpRequest,
  SignUpEnvelope,
} from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success) throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  return envelope.data
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginPayload> {
    const { data } = await http.post<LoginEnvelope>('/api/v1/auth/login', payload)
    const result = unwrapResponse<LoginPayload>(data)
    if (!result) throw new Error('로그인 응답 데이터가 없습니다.')
    return result
  },

  async signup(payload: SignUpRequest): Promise<void> {
    const { data } = await http.post<SignUpEnvelope>('/api/v1/auth/signup', payload)
    if (!data.success) throw new Error(data.error?.message ?? '회원가입에 실패했습니다.')
  },

  /**
   * OAuth 로그인 시작
   * Spring Security /oauth2/authorization/:provider → 인가 서버 리다이렉트
   * 완료 후 SuccessHandler가 JWT 쿠키 세팅 → /oauth/callback/:provider 리다이렉트
   */
  redirectToOauth(provider: 'google' | 'kakao' | 'naver') {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
    sessionStorage.setItem('oauth_provider', provider)
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
  },

  async logout(): Promise<void> {
    await http.post<LogoutEnvelope>('/api/v1/auth/logout')
  },
}
