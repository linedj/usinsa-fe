import axios from 'axios'
import type { TokenPairEnvelope } from './types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

/**
 * 공통 axios 인스턴스
 * withCredentials: true — HttpOnly 쿠키(JWT)를 모든 요청에 자동 포함
 */
export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// 토큰 갱신 전용 클라이언트 (인터셉터 무한루프 방지)
const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

declare module 'axios' {
  interface AxiosRequestConfig {
    __isRetryRequest?: boolean
  }
}

let refreshPromise: Promise<boolean> | null = null

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error

    // 백엔드 RsData 에러 메시지 추출
    if (response?.data?.error?.message) {
      error.message = response.data.error.message
    }

    if (response?.status !== 401 || config.__isRetryRequest) {
      return Promise.reject(error)
    }

    // 401 → Refresh Token 쿠키로 갱신 시도
    if (!refreshPromise) {
      refreshPromise = refreshClient
        .post<TokenPairEnvelope>('/api/v1/auth/refresh', {})
        .then((r) => r.data.success ?? false)
        .catch(() => false)
        .finally(() => { refreshPromise = null })
    }

    const ok = await refreshPromise
    if (!ok) return Promise.reject(error)

    config.__isRetryRequest = true
    return http(config)
  },
)
