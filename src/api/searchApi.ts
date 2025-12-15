import { http } from './http'
import type { ProductSearchDto } from './types'

export const searchApi = {
  /**
   * 상품 검색
   */
  async searchProducts(keyword: string, userId?: number): Promise<ProductSearchDto[]> {
    const params = new URLSearchParams({ keyword })
    if (userId) {
      params.append('userId', userId.toString())
    }
    const { data } = await http.get<ProductSearchDto[]>(`/api/v1/search?${params.toString()}`)
    return data
  },

  /**
   * 인기 검색어 조회
   */
  async getTrendingKeywords(): Promise<string[]> {
    const { data } = await http.get<string[]>('/api/v1/search/trend')
    return data
  },

  /**
   * 사용자별 최근 검색어 조회
   */
  async getUserSearchHistory(userId: number): Promise<string[]> {
    const { data } = await http.get<string[]>(`/api/v1/search/history/${userId}`)
    return data
  },
}
