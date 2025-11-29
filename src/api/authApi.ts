import { http } from './http'
import { tokenStorage } from '@/auth/tokenStorage'
import type {
  LoginEnvelope,
  LoginPayload,
  LoginRequest,
  LogoutEnvelope,
  TokenPair,
  TokenPairEnvelope,
} from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  }
  return envelope.data
}

export const authApi = {
  async login(payload: LoginRequest): Promise<LoginPayload> {
    const { data } = await http.post<LoginEnvelope>('/api/v1/auth/login', payload)
    return unwrapResponse<LoginPayload>(data)
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
    return unwrapResponse<TokenPair>(data)
  },
}

