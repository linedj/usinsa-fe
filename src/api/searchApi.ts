import { http } from './http'
import type { ProductSearchDto } from './types'

// RsData 래퍼 타입
interface RsDataWrapper<T> {
  success: boolean
  status: number
  error?: {
    code: string
    message: string
  }
  data?: T
}

// 응답에서 데이터 추출 헬퍼 함수
const unwrapData = <T>(wrapper: RsDataWrapper<T>): T => {
  if (!wrapper.success || !wrapper.data) {
    throw new Error(wrapper.error?.message ?? '요청이 실패했습니다.')
  }
  return wrapper.data
}

export const searchApi = {
  /**
   * 상품 검색
   */
  async searchProducts(keyword: string, userId?: number): Promise<ProductSearchDto[]> {
    const params = new URLSearchParams({ keyword })
    if (userId) {
      params.append('userId', userId.toString())
    }
    const { data } = await http.get<RsDataWrapper<ProductSearchDto[]>>(`/api/v1/search?${params.toString()}`)
    return unwrapData(data)
  },

  /**
   * 인기 검색어 조회
   */
  async getTrendingKeywords(): Promise<string[]> {
    const { data } = await http.get<RsDataWrapper<string[]>>('/api/v1/search/trend')
    return unwrapData(data)
  },

  /**
   * 사용자별 최근 검색어 조회
   */
  async getUserSearchHistory(userId: number): Promise<string[]> {
    const { data } = await http.get<RsDataWrapper<string[]>>(`/api/v1/search/history/${userId}`)
    return unwrapData(data)
  },
}
