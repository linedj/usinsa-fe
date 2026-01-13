import { http } from './http'
import type { OrderResponse, OrderCreateRequest, OrderUpdateRequest } from './types'

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

export const orderApi = {
  /**
   * 주문 생성
   */
  async createOrder(payload: OrderCreateRequest): Promise<OrderResponse> {
    const { data } = await http.post<RsDataWrapper<OrderResponse>>('/api/v1/orders', payload)
    return unwrapData(data)
  },

  /**
   * 주문 단건 조회
   */
  async getOrder(id: number): Promise<OrderResponse> {
    const { data } = await http.get<RsDataWrapper<OrderResponse>>(`/api/v1/orders/${id}`)
    return unwrapData(data)
  },

  /**
   * 전체 주문 조회
   */
  async getAllOrders(): Promise<OrderResponse[]> {
    const { data } = await http.get<RsDataWrapper<OrderResponse[]>>('/api/v1/orders')
    return unwrapData(data)
  },

  /**
   * 주문 수정
   */
  async updateOrder(orderId: number, payload: OrderUpdateRequest): Promise<OrderResponse> {
    const { data } = await http.put<RsDataWrapper<OrderResponse>>(`/api/v1/orders/${orderId}`, payload)
    return unwrapData(data)
  },

  /**
   * 주문 취소
   */
  async cancelOrder(orderId: number): Promise<OrderResponse> {
    const { data } = await http.post<RsDataWrapper<OrderResponse>>(`/api/v1/orders/${orderId}/cancel`)
    return unwrapData(data)
  },
}
