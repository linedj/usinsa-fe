import { http } from './http'
import type { ProductResponse, ProductCreateRequest, ProductOptionResponse, ProductOptionCreateRequest } from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  }
  return envelope.data
}

export const productApi = {
  /**
   * 상품 등록
   */
  async createProduct(payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.post<{ success?: boolean; data?: ProductResponse; error?: { message?: string } }>(
      '/api/v1/products',
      payload
    )
    return unwrapResponse<ProductResponse>(data)
  },

  /**
   * 상품 수정
   */
  async updateProduct(id: number, payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.put<{ success?: boolean; data?: ProductResponse; error?: { message?: string } }>(
      `/api/v1/products/${id}`,
      payload
    )
    return unwrapResponse<ProductResponse>(data)
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
    const { data } = await http.get<{ success?: boolean; data?: ProductResponse; error?: { message?: string } }>(
      `/api/v1/products/${id}`
    )
    return unwrapResponse<ProductResponse>(data)
  },

  /**
   * 상품 전체 조회
   */
  async getAllProducts(): Promise<ProductResponse[]> {
    const { data } = await http.get<{ success?: boolean; data?: ProductResponse[]; error?: { message?: string } }>(
      '/api/v1/products'
    )
    return unwrapResponse<ProductResponse[]>(data)
  },

  /**
   * 상품 옵션 추가
   */
  async addOption(productId: number, payload: ProductOptionCreateRequest): Promise<ProductOptionResponse> {
    const { data } = await http.post<{ success?: boolean; data?: ProductOptionResponse; error?: { message?: string } }>(
      `/api/v1/products/${productId}/options`,
      payload
    )
    return unwrapResponse<ProductOptionResponse>(data)
  },

  /**
   * Elasticsearch 인덱스 재구축
   */
  async reindexProducts(): Promise<string> {
    const { data } = await http.post<string>('/api/v1/products/reindex')
    return data
  },
}
