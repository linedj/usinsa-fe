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
  OAuthLoginRequest,
  OAuthLoginEnvelope,
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
    if (!result) {
      throw new Error('로그인 응답 데이터가 없습니다.')
    }
    return result
  },
  async signup(payload: SignUpRequest): Promise<void> {
    const { data } = await http.post<SignUpEnvelope>('/api/v1/auth/signup', payload)
    if (!data.success) {
      throw new Error(data.error?.message ?? '회원가입에 실패했습니다.')
    }
  },
  async oauthLogin(payload: OAuthLoginRequest): Promise<LoginPayload> {
    const { data } = await http.post<OAuthLoginEnvelope>('/api/v1/auth/oauth/login', payload)
    const result = unwrapResponse<LoginPayload>(data)
    if (!result) {
      throw new Error('OAuth 로그인 응답 데이터가 없습니다.')
    }
    return result
  },
  redirectToOauth(provider: 'google' | 'kakao' | 'naver') {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
      const callbackUrl = `${window.location.origin}/oauth/callback/${provider}`
      const oauthUrl = `${API_BASE_URL}/api/v1/auth/oauth/${provider}?redirect_uri=${encodeURIComponent(callbackUrl)}`
      
      // 리다이렉트 전에 콜백 URL을 저장 (에러 처리용)
      sessionStorage.setItem('oauth_provider', provider)
      sessionStorage.setItem('oauth_callback_url', callbackUrl)
      
      window.location.href = oauthUrl
    } catch (error) {
      console.error('OAuth 리다이렉트 실패:', error)
      throw new Error('OAuth 리다이렉트에 실패했습니다.')
    }
  },
  async logout(): Promise<void> {
    await http.post<LogoutEnvelope>('/api/v1/auth/logout')
  },
  async refresh(refreshToken?: string): Promise<TokenPair> {
    const token = refreshToken ?? tokenStorage.getTokens()?.refreshToken
    if (!token) {
      throw new Error('갱신 토큰이 없습니다.')
    }
    const { data } = await http.post<TokenPairEnvelope>('/api/v1/auth/refresh', {
      refreshToken: token,
    })
    const result = unwrapResponse<TokenPair>(data)
    if (!result) {
      throw new Error('토큰 갱신 응답 데이터가 없습니다.')
    }
    return result
  },
}
