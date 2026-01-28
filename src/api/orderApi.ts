import { http } from './http'
import type { OrderResponse, OrderCreateRequest, OrderUpdateRequest } from './types'

// 백엔드 Order API는 RsData 래퍼 없이 직접 데이터를 반환합니다
export const orderApi = {
  /**
   * 주문 생성
   */
  async createOrder(payload: OrderCreateRequest): Promise<OrderResponse> {
    const { data } = await http.post<OrderResponse>('/api/v1/orders', payload)
    return data
  },

  /**
   * 주문 단건 조회
   */
  async getOrder(id: number): Promise<OrderResponse> {
    const { data } = await http.get<OrderResponse>(`/api/v1/orders/${id}`)
    return data
  },

  /**
   * 전체 주문 조회
   */
  async getAllOrders(): Promise<OrderResponse[]> {
    const { data } = await http.get<OrderResponse[]>('/api/v1/orders')
    return data
  },

  /**
   * 주문 수정
   */
  async updateOrder(orderId: number, payload: OrderUpdateRequest): Promise<OrderResponse> {
    const { data } = await http.put<OrderResponse>(`/api/v1/orders/${orderId}`, payload)
    return data
  },

  /**
   * 주문 취소
   */
  async cancelOrder(orderId: number): Promise<OrderResponse> {
    const { data } = await http.post<OrderResponse>(`/api/v1/orders/${orderId}/cancel`)
    return data
  },
}
