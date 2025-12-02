import type { components } from '#backend/apiV1/schema'

export type LoginRequest = components['schemas']['LoginReq']
export type LoginEnvelope = components['schemas']['RsDataLoginRes']
export type LoginPayload = components['schemas']['LoginRes']

export type SignUpRequest = components['schemas']['SignUpReq']
export type SignUpEnvelope = components['schemas']['RsDataVoid']

export type OAuthLoginRequest = components['schemas']['OAuthLoginReq']
export type OAuthLoginEnvelope = components['schemas']['RsDataLoginRes']

export type TokenPair = components['schemas']['TokenPair']
export type TokenPairEnvelope = components['schemas']['RsDataTokenPair']

export type RefreshRequest = components['schemas']['RefreshReq']
export type LogoutEnvelope = components['schemas']['RsDataVoid']
export type ErrorDetail = components['schemas']['ErrorDetail']

export type ApiSuccessResponse<T> = {
  success?: boolean
  status?: number
  error?: ErrorDetail
  data?: T
}
