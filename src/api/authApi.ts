import { http } from './http'
import { tokenStorage } from '@/auth/tokenStorage'
import type {
  LoginEnvelope,
  LoginPayload,
  LoginRequest,
  LogoutEnvelope,
  TokenPair,
  TokenPairEnvelope,
  SignUpRequest,
  SignUpEnvelope,
} from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success) {
    throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  }
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
   * Spring Security가 /oauth2/authorization/:provider 를 자동 처리하여
   * 인가 서버로 리다이렉트한다.
   * 인증 완료 후 SuccessHandler가 JWT를 HttpOnly 쿠키에 담아
   * /oauth/callback/:provider 로 리다이렉트한다.
   */
  redirectToOauth(provider: 'google' | 'kakao' | 'naver') {
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
    sessionStorage.setItem('oauth_provider', provider)
    window.location.href = `${API_BASE_URL}/oauth2/authorization/${provider}`
  },

  async logout(): Promise<void> {
    await http.post<LogoutEnvelope>('/api/v1/auth/logout')
  },

  async refresh(refreshToken?: string): Promise<TokenPair> {
    const token = refreshToken ?? tokenStorage.getTokens()?.refreshToken
    if (!token) throw new Error('갱신 토큰이 없습니다.')
    const { data } = await http.post<TokenPairEnvelope>('/api/v1/auth/refresh', { refreshToken: token })
    const result = unwrapResponse<TokenPair>(data)
    if (!result) throw new Error('토큰 갱신 응답 데이터가 없습니다.')
    return result
  },
}
