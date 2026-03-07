import { http } from './http'
import { guestId } from '@/utils/guestId'
import type { CartResponse, CartItem, CartCreateRequest, CartGuestCreateRequest, CartUpdateRequest } from './types'

const toCartItem = (cart: CartResponse): CartItem => ({
  ...cart,
  totalPrice: cart.productInfo.price * cart.count,
})

export const cartApi = {
  // ── 회원 장바구니 ────────────────────────────────────────────────

  async createCart(payload: CartCreateRequest): Promise<CartItem> {
    const { data } = await http.post<CartResponse>('/api/v1/carts', payload)
    return toCartItem(data)
  },

  async getCart(id: number): Promise<CartItem> {
    const { data } = await http.get<CartResponse>(`/api/v1/carts/${id}`)
    return toCartItem(data)
  },

  async getAllCarts(): Promise<CartItem[]> {
    const { data } = await http.get<CartResponse[]>('/api/v1/carts')
    return data.map(toCartItem)
  },

  async getMemberCarts(memberId: number): Promise<CartItem[]> {
    const { data } = await http.get<CartResponse[]>(`/api/v1/carts/member/${memberId}`)
    return data.map(toCartItem)
  },

  async updateCart(id: number, payload: CartUpdateRequest): Promise<CartItem> {
    const { data } = await http.put<CartResponse>(`/api/v1/carts/${id}`, payload)
    return toCartItem(data)
  },

  async deleteCart(id: number): Promise<void> {
    await http.delete(`/api/v1/carts/${id}`)
  },

  // ── 비회원 장바구니 (guestId 쿠키 자동 전송) ─────────────────────
  // guestId.get()으로 쿠키를 미리 생성해두면 BE가 Cookie: guestId=... 로 읽음
  // 별도 헤더 주입 불필요 (withCredentials: true 로 자동 포함)

  async createGuestCart(payload: CartGuestCreateRequest): Promise<CartItem> {
    guestId.get() // 쿠키 없으면 생성
    const { data } = await http.post<CartResponse>('/api/v1/carts/guest', payload)
    return toCartItem(data)
  },

  async getGuestCarts(): Promise<CartItem[]> {
    guestId.get() // 쿠키 없으면 생성
    const { data } = await http.get<CartResponse[]>('/api/v1/carts/guest')
    return data.map(toCartItem)
  },

  /**
   * 비회원 장바구니 → 회원 장바구니 병합
   * guestId.clear()는 AuthProvider에서 성공 확인 후 처리
   */
  async mergeGuestCart(memberId: number): Promise<CartItem[]> {
    const { data } = await http.post<CartResponse[]>(`/api/v1/carts/merge/${memberId}`)
    return data.map(toCartItem)
  },

  async deleteGuestCarts(): Promise<void> {
    await http.delete('/api/v1/carts/guest')
    guestId.clear()
  },
}
