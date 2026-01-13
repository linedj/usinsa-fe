import { http } from './http'
import type { 
  ProductResponse, 
  ProductCreateRequest, 
  ProductOptionResponse, 
  ProductOptionCreateRequest,
  ProductLikeResponse,
  ProductLikeStatusResponse
} from './types'

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

export const productApi = {
  /**
   * 상품 등록
   */
  async createProduct(payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.post<RsDataWrapper<ProductResponse>>('/api/v1/products', payload)
    return unwrapData(data)
  },

  /**
   * 상품 수정
   */
  async updateProduct(id: number, payload: ProductCreateRequest): Promise<ProductResponse> {
    const { data } = await http.put<RsDataWrapper<ProductResponse>>(`/api/v1/products/${id}`, payload)
    return unwrapData(data)
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
    const { data } = await http.get<RsDataWrapper<ProductResponse>>(`/api/v1/products/${id}`)
    return unwrapData(data)
  },

  /**
   * 상품 전체 조회
   */
  async getAllProducts(): Promise<ProductResponse[]> {
    const { data } = await http.get<RsDataWrapper<ProductResponse[]>>('/api/v1/products')
    return unwrapData(data)
  },

  /**
   * 상품 옵션 추가
   */
  async addOption(productId: number, payload: ProductOptionCreateRequest): Promise<ProductOptionResponse> {
    const { data } = await http.post<RsDataWrapper<ProductOptionResponse>>(
      `/api/v1/products/${productId}/options`,
      payload
    )
    return unwrapData(data)
  },

  /**
   * Elasticsearch 인덱스 재구축
   */
  async reindexProducts(): Promise<string> {
    const { data } = await http.post<RsDataWrapper<string>>('/api/v1/products/reindex')
    return unwrapData(data)
  },

  /**
   * 좋아요 추가
   */
  async addLike(productId: number, memberId: number): Promise<ProductLikeResponse> {
    const { data } = await http.post<RsDataWrapper<ProductLikeResponse>>(
      `/api/v1/products/${productId}/like`,
      null,
      { params: { memberId } }
    )
    return unwrapData(data)
  },

  /**
   * 좋아요 취소
   */
  async removeLike(productId: number, memberId: number): Promise<ProductLikeResponse> {
    const { data } = await http.delete<RsDataWrapper<ProductLikeResponse>>(
      `/api/v1/products/${productId}/like`,
      { params: { memberId } }
    )
    return unwrapData(data)
  },

  /**
   * 좋아요 상태 조회
   */
  async getLikeStatus(productId: number, memberId: number): Promise<ProductLikeStatusResponse> {
    const { data } = await http.get<RsDataWrapper<ProductLikeStatusResponse>>(
      `/api/v1/products/${productId}/like`,
      { params: { memberId } }
    )
    return unwrapData(data)
  },

  /**
   * 좋아요 개수 조회
   */
  async getLikeCount(productId: number): Promise<number> {
    const { data } = await http.get<RsDataWrapper<number>>(`/api/v1/products/${productId}/like/count`)
    return unwrapData(data)
  },
}
