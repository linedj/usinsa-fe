import { http } from './http'
import type { 
  OrderResponse, 
  OrderCreateRequest, 
  OrderUpdateRequest,
  OrderedProductCreateRequest,
  OrderedProductResponse 
} from './types'

// 백엔드 Order API
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

// 주문 상품 API
export const orderedProductApi = {
  /**
   * 주문 상품 등록
   */
  async createOrderedProduct(payload: OrderedProductCreateRequest): Promise<OrderedProductResponse> {
    const { data } = await http.post<OrderedProductResponse>('/api/v1/ordered-products', payload)
    return data
  },

  /**
   * 주문 상품 단건 조회
   */
  async getOrderedProduct(id: number): Promise<OrderedProductResponse> {
    const { data } = await http.get<OrderedProductResponse>(`/api/v1/ordered-products/${id}`)
    return data
  },

  /**
   * 주문 상품 전체 조회
   */
  async getAllOrderedProducts(): Promise<OrderedProductResponse[]> {
    const { data } = await http.get<OrderedProductResponse[]>('/api/v1/ordered-products')
    return data
  },

  /**
   * 주문 상품 수정
   */
  async updateOrderedProduct(id: number, quantity: number): Promise<OrderedProductResponse> {
    const { data } = await http.put<OrderedProductResponse>(
      `/api/v1/ordered-products/${id}`,
      { quantity }
    )
    return data
  },

  /**
   * 주문 상품 삭제
   */
  async deleteOrderedProduct(id: number): Promise<void> {
    await http.delete(`/api/v1/ordered-products/${id}`)
  },
}
