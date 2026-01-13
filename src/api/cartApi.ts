import { http } from './http'
import type { CartResponse, CartItem, CartCreateRequest, CartGuestCreateRequest, CartUpdateRequest } from './types'

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

// Cart Helper: 백엔드 응답을 UI용 CartItem으로 변환
const toCartItem = (cart: CartResponse): CartItem => ({
  ...cart,
  totalPrice: cart.productInfo.price * cart.count,
})

export const cartApi = {
  /**
   * 회원 장바구니 생성
   */
  async createCart(payload: CartCreateRequest): Promise<CartItem> {
    const { data } = await http.post<RsDataWrapper<CartResponse>>('/api/v1/carts', payload)
    return toCartItem(unwrapData(data))
  },

  /**
   * 비회원 장바구니 생성
   */
  async createGuestCart(payload: CartGuestCreateRequest): Promise<CartItem> {
    const { data } = await http.post<RsDataWrapper<CartResponse>>('/api/v1/carts/guest', payload)
    return toCartItem(unwrapData(data))
  },

  /**
   * 장바구니 단건 조회
   */
  async getCart(id: number): Promise<CartItem> {
    const { data } = await http.get<RsDataWrapper<CartResponse>>(`/api/v1/carts/${id}`)
    return toCartItem(unwrapData(data))
  },

  /**
   * 모든 장바구니 조회 (관리자용)
   */
  async getAllCarts(): Promise<CartItem[]> {
    const { data } = await http.get<RsDataWrapper<CartResponse[]>>('/api/v1/carts')
    return unwrapData(data).map(toCartItem)
  },

  /**
   * 회원 장바구니 조회
   */
  async getMemberCarts(memberId: number): Promise<CartItem[]> {
    const { data } = await http.get<RsDataWrapper<CartResponse[]>>(`/api/v1/carts/member/${memberId}`)
    return unwrapData(data).map(toCartItem)
  },

  /**
   * 비회원 장바구니 조회
   */
  async getGuestCarts(): Promise<CartItem[]> {
    const { data } = await http.get<RsDataWrapper<CartResponse[]>>('/api/v1/carts/guest')
    return unwrapData(data).map(toCartItem)
  },

  /**
   * 비회원 장바구니를 회원 장바구니로 병합
   */
  async mergeGuestCart(memberId: number): Promise<CartItem[]> {
    const { data } = await http.post<RsDataWrapper<CartResponse[]>>(`/api/v1/carts/merge/${memberId}`)
    return unwrapData(data).map(toCartItem)
  },

  /**
   * 장바구니 수량 수정
   */
  async updateCart(id: number, payload: CartUpdateRequest): Promise<CartItem> {
    const { data } = await http.put<RsDataWrapper<CartResponse>>(`/api/v1/carts/${id}`, payload)
    return toCartItem(unwrapData(data))
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
