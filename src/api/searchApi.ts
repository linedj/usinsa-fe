import { http } from './http'
import type { ProductSearchDto, RagResponseDto } from './types'

// 백엔드 Search API는 RsData 래퍼 없이 직접 데이터를 반환합니다
export const searchApi = {
  /**
   * 상품 검색 (키워드 기반, Elasticsearch/ZincSearch)
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
   * RAG 기반 상품 추천 (Hybrid Search + Gemini)
   * 자연어 문장 검색어에 대해 추천 문장과 근거 상품 목록을 함께 반환합니다.
   */
  async getRagRecommendation(keyword: string): Promise<RagResponseDto> {
    const params = new URLSearchParams({ keyword })
    const { data } = await http.get<RagResponseDto>(`/api/v1/search/rag?${params.toString()}`)
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
