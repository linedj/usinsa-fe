import { http } from './http'
import type { CartResponse, CartCreateRequest, CartGuestCreateRequest, CartUpdateRequest } from './types'

const unwrapResponse = <T>(envelope: { success?: boolean; data?: T; error?: { message?: string } }) => {
  if (!envelope.success || !envelope.data) {
    throw new Error(envelope.error?.message ?? '요청이 실패했습니다.')
  }
  return envelope.data
}

export const cartApi = {
  /**
   * 회원 장바구니 생성
   */
  async createCart(payload: CartCreateRequest): Promise<CartResponse> {
    const { data } = await http.post<{ success?: boolean; data?: CartResponse; error?: { message?: string } }>(
      '/api/v1/carts',
      payload
    )
    return unwrapResponse<CartResponse>(data)
  },

  /**
   * 비회원 장바구니 생성
   */
  async createGuestCart(payload: CartGuestCreateRequest): Promise<CartResponse> {
    const { data } = await http.post<{ success?: boolean; data?: CartResponse; error?: { message?: string } }>(
      '/api/v1/carts/guest',
      payload
    )
    return unwrapResponse<CartResponse>(data)
  },

  /**
   * 장바구니 단건 조회
   */
  async getCart(id: number): Promise<CartResponse> {
    const { data } = await http.get<{ success?: boolean; data?: CartResponse; error?: { message?: string } }>(
      `/api/v1/carts/${id}`
    )
    return unwrapResponse<CartResponse>(data)
  },

  /**
   * 모든 장바구니 조회 (관리자용)
   */
  async getAllCarts(): Promise<CartResponse[]> {
    const { data } = await http.get<{ success?: boolean; data?: CartResponse[]; error?: { message?: string } }>(
      '/api/v1/carts'
    )
    return unwrapResponse<CartResponse[]>(data)
  },

  /**
   * 회원 장바구니 조회
   */
  async getMemberCarts(memberId: number): Promise<CartResponse[]> {
    const { data } = await http.get<{ success?: boolean; data?: CartResponse[]; error?: { message?: string } }>(
      `/api/v1/carts/member/${memberId}`
    )
    return unwrapResponse<CartResponse[]>(data)
  },

  /**
   * 비회원 장바구니 조회
   */
  async getGuestCarts(): Promise<CartResponse[]> {
    const { data } = await http.get<{ success?: boolean; data?: CartResponse[]; error?: { message?: string } }>(
      '/api/v1/carts/guest'
    )
    return unwrapResponse<CartResponse[]>(data)
  },

  /**
   * 비회원 장바구니를 회원 장바구니로 병합
   */
  async mergeGuestCart(memberId: number): Promise<CartResponse[]> {
    const { data } = await http.post<{ success?: boolean; data?: CartResponse[]; error?: { message?: string } }>(
      `/api/v1/carts/merge/${memberId}`
    )
    return unwrapResponse<CartResponse[]>(data)
  },

  /**
   * 장바구니 수량 수정
   */
  async updateCart(id: number, payload: CartUpdateRequest): Promise<CartResponse> {
    const { data } = await http.put<{ success?: boolean; data?: CartResponse; error?: { message?: string } }>(
      `/api/v1/carts/${id}`,
      payload
    )
    return unwrapResponse<CartResponse>(data)
  },

  /**
   * 장바구니 삭제
   */
  async deleteCart(id: number): Promise<void> {
    await http.delete(`/api/v1/carts/${id}`)
  },

  /**
   * 비회원 장바구니 전체 삭제
   */
  async deleteGuestCarts(): Promise<void> {
    await http.delete('/api/v1/carts/guest')
  },
}
