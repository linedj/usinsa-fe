import axios from 'axios'
import type { TokenPairEnvelope } from './types'
import { tokenStorage } from '@/auth/tokenStorage'

declare module 'axios' {
  interface AxiosRequestConfig {
    __isRetryRequest?: boolean
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const http = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 전송을 위해 필수
})

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키 전송을 위해 필수
})

const requestNewTokens = async () => {
  const refreshToken = tokenStorage.getTokens()?.refreshToken
  if (!refreshToken) {
    return null
  }

  try {
    const { data } = await refreshClient.post<TokenPairEnvelope>(
      '/api/v1/auth/refresh',
      { refreshToken },
    )
    return data.data ?? null
  } catch {
    return null
  }
}

http.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getTokens()?.accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

http.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error

    // 백엔드에서 반환한 커스텀 에러 메시지 추출
    if (response?.data) {
      const errorData = response.data
      
      // RsData 형식의 에러 응답 처리
      if (errorData.error && errorData.error.message) {
        error.message = errorData.error.message
      }
    }

    // 401 에러가 아니거나 재시도 요청인 경우 에러 반환
    if (response?.status !== 401 || config.__isRetryRequest) {
      return Promise.reject(error)
    }

    // 토큰 갱신 시도
    if (!refreshPromise) {
      refreshPromise = (async () => {
        const tokenPair = await requestNewTokens()
        if (!tokenPair) {
          tokenStorage.clear()
          return null
        }
        tokenStorage.setTokens(tokenPair)
        return tokenPair.accessToken ?? null
      })()
    }

    const newAccessToken = await refreshPromise
    refreshPromise = null
    
    if (!newAccessToken) {
      return Promise.reject(error)
    }

    config.__isRetryRequest = true
    config.headers.Authorization = `Bearer ${newAccessToken}`
    return http(config)
  },
)
