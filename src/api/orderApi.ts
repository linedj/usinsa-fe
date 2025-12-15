import { http } from './http'
import type { OrderResponse, OrderCreateRequest, OrderUpdateRequest } from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  }
  return envelope.data
}

export const orderApi = {
  /**
   * 주문 생성
   */
  async createOrder(payload: OrderCreateRequest): Promise<OrderResponse> {
    const { data } = await http.post<{ success?: boolean; data?: OrderResponse; error?: { message?: string } }>(
      '/api/v1/orders',
      payload
    )
    return unwrapResponse<OrderResponse>(data)
  },

  /**
   * 주문 단건 조회
   */
  async getOrder(id: number): Promise<OrderResponse> {
    const { data } = await http.get<{ success?: boolean; data?: OrderResponse; error?: { message?: string } }>(
      `/api/v1/orders/${id}`
    )
    return unwrapResponse<OrderResponse>(data)
  },

  /**
   * 전체 주문 조회
   */
  async getAllOrders(): Promise<OrderResponse[]> {
    const { data } = await http.get<{ success?: boolean; data?: OrderResponse[]; error?: { message?: string } }>(
      '/api/v1/orders'
    )
    return unwrapResponse<OrderResponse[]>(data)
  },

  /**
   * 주문 수정
   */
  async updateOrder(orderId: number, payload: OrderUpdateRequest): Promise<OrderResponse> {
    const { data } = await http.put<{ success?: boolean; data?: OrderResponse; error?: { message?: string } }>(
      `/api/v1/orders/${orderId}`,
      payload
    )
    return unwrapResponse<OrderResponse>(data)
  },

  /**
   * 주문 취소
   */
  async cancelOrder(orderId: number): Promise<OrderResponse> {
    const { data } = await http.post<{ success?: boolean; data?: OrderResponse; error?: { message?: string } }>(
      `/api/v1/orders/${orderId}/cancel`
    )
    return unwrapResponse<OrderResponse>(data)
  },
}
