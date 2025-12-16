import { http } from './http'
import type { ProductResponse, ProductCreateRequest, ProductOptionResponse, ProductOptionCreateRequest } from './types'

// 백엔드 Product/Cart API는 RsData 래퍼 없이 직접 데이터를 반환합니다
export const productApi = {
  /**
   * 상품 등록
   */
  async createProduct(payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.post<ProductResponse>('/api/v1/products', payload)
    return data
  },

  /**
   * 상품 수정
   */
  async updateProduct(id: number, payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.put<ProductResponse>(`/api/v1/products/${id}`, payload)
    return data
  },

  /**
   * 상품 삭제
   */
  async deleteProduct(id: number): Promise<void> {
    await http.delete(`/api/v1/products/${id}`)
  },

  /**
   * 상품 단건 조회
   */
  async getProduct(id: number): Promise<ProductResponse> {
    const { data } = await http.get<ProductResponse>(`/api/v1/products/${id}`)
    return data
  },

  /**
   * 상품 전체 조회
   */
  async getAllProducts(): Promise<ProductResponse[]> {
    const { data } = await http.get<ProductResponse[]>('/api/v1/products')
    return data
  },

  /**
   * 상품 옵션 추가
   */
  async addOption(productId: number, payload: ProductOptionCreateRequest): Promise<ProductOptionResponse> {
    const { data } = await http.post<ProductOptionResponse>(
      `/api/v1/products/${productId}/options`,
      payload
    )
    return data
  },

  /**
   * Elasticsearch 인덱스 재구축
   */
  async reindexProducts(): Promise<string> {
    const { data } = await http.post<string>('/api/v1/products/reindex')
    return data
  },
}
