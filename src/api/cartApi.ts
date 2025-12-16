import { http } from './http'
import type { CartResponse, CartCreateRequest, CartGuestCreateRequest, CartUpdateRequest } from './types'

// 백엔드 Cart API는 RsData 래퍼 없이 직접 데이터를 반환합니다
export const cartApi = {
  /**
   * 회원 장바구니 생성
   */
  async createCart(payload: CartCreateRequest): Promise<CartResponse> {
    const { data } = await http.post<CartResponse>('/api/v1/carts', payload)
    return data
  },

  /**
   * 비회원 장바구니 생성
   */
  async createGuestCart(payload: CartGuestCreateRequest): Promise<CartResponse> {
    const { data } = await http.post<CartResponse>('/api/v1/carts/guest', payload)
    return data
  },

  /**
   * 장바구니 단건 조회
   */
  async getCart(id: number): Promise<CartResponse> {
    const { data } = await http.get<CartResponse>(`/api/v1/carts/${id}`)
    return data
  },

  /**
   * 모든 장바구니 조회 (관리자용)
   */
  async getAllCarts(): Promise<CartResponse[]> {
    const { data } = await http.get<CartResponse[]>('/api/v1/carts')
    return data
  },

  /**
   * 회원 장바구니 조회
   */
  async getMemberCarts(memberId: number): Promise<CartResponse[]> {
    const { data } = await http.get<CartResponse[]>(`/api/v1/carts/member/${memberId}`)
    return data
  },

  /**
   * 비회원 장바구니 조회
   */
  async getGuestCarts(): Promise<CartResponse[]> {
    const { data } = await http.get<CartResponse[]>('/api/v1/carts/guest')
    return data
  },

  /**
   * 비회원 장바구니를 회원 장바구니로 병합
   */
  async mergeGuestCart(memberId: number): Promise<CartResponse[]> {
    const { data } = await http.post<CartResponse[]>(`/api/v1/carts/merge/${memberId}`)
    return data
  },

  /**
   * 장바구니 수량 수정
   */
  async updateCart(id: number, payload: CartUpdateRequest): Promise<CartResponse> {
    const { data } = await http.put<CartResponse>(`/api/v1/carts/${id}`, payload)
    return data
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
