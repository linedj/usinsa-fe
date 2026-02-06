import { http } from './http'
import type {
  KakaoPayReadyResponse,
  KakaoPayApproveResponse,
  KakaoPayCancelResponse,
} from './types'

export const paymentApi = {
  /**
   * 카카오페이 결제 준비
   */
  async readyPayment(orderId: number): Promise<KakaoPayReadyResponse> {
    const { data } = await http.post<KakaoPayReadyResponse>(
      `/api/v1/payments/kakao-pay/${orderId}/ready`,
    )
    return data
  },

  /**
   * 카카오페이 결제 승인
   */
  async approvePayment(orderId: number, pgToken: string): Promise<KakaoPayApproveResponse> {
    const { data } = await http.post<KakaoPayApproveResponse>(
      `/api/v1/payments/kakao-pay/${orderId}/approve`,
      null,
      { params: { pgToken } },
    )
    return data
  },

  /**
   * 카카오페이 결제 취소
   */
  async cancelPayment(orderId: number): Promise<KakaoPayCancelResponse> {
    const { data } = await http.post<KakaoPayCancelResponse>(
      `/api/v1/payments/kakao-pay/${orderId}/cancel`,
    )
    return data
  },
}
