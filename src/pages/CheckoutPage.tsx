import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi } from '@/api/cartApi'
import { orderApi, orderedProductApi } from '@/api/orderApi'
import { paymentApi } from '@/api/paymentApi'
import type { CartItem } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function CheckoutPage() {
  const [carts, setCarts] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    receiverName: '',
    receiverPhone: '',
    receiverAddress: '',
  })

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    loadCarts()
  }, [user, navigate])

  const loadCarts = async () => {
    if (!user?.memberId) return

    try {
      setLoading(true)
      const data = await cartApi.getMemberCarts(user.memberId)
      
      // totalPrice 계산
      const cartsWithTotal = data.map(cart => ({
        ...cart,
        totalPrice: cart.productInfo.price * cart.count
      }))
      
      setCarts(cartsWithTotal)

      if (data.length === 0) {
        alert('장바구니가 비어있습니다.')
        navigate('/cart')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '장바구니를 불러오는데 실패했습니다.')
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  /**
   * 주문 생성 → 주문 상품 등록 → 카카오페이 결제 준비 → 리다이렉트
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.memberId) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!formData.receiverName || !formData.receiverPhone || !formData.receiverAddress) {
      alert('모든 배송 정보를 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)

      // 1단계: 주문 생성 (배송 정보만)
      console.log('=== 1단계: 주문 생성 ===')
      const order = await orderApi.createOrder({
        memberId: user.memberId,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
      })
      console.log('주문 생성 완료:', order)

      // 2단계: 주문 상품 등록 (장바구니 상품들)
      console.log('=== 2단계: 주문 상품 등록 ===')
      await Promise.all(
        carts.map((cart) =>
          orderedProductApi.createOrderedProduct({
            orderId: order.id,
            productOptionId: cart.productOptionId,
            quantity: cart.count,
          })
        )
      )
      console.log('주문 상품 등록 완료')

      // 3단계: 카카오페이 결제 준비
      console.log('=== 3단계: 카카오페이 결제 준비 ===')
      console.log('결제 준비 요청 orderId:', order.id)
      
      const readyResult = await paymentApi.readyPayment(order.id)

      console.log('✅ 결제 준비 API 응답:')
      console.log('전체 응답:', readyResult)
      
      // 백엔드에서 snake_case로 반환될 수 있으므로 두 가지 모두 체크
      const response: any = readyResult
      
      console.log('응답 필드 확인:')
      console.log('- nextRedirectPcUrl (camelCase):', readyResult.nextRedirectPcUrl)
      console.log('- next_redirect_pc_url (snake_case):', response.next_redirect_pc_url)
      console.log('- nextRedirectMobileUrl:', readyResult.nextRedirectMobileUrl)
      console.log('- next_redirect_mobile_url:', response.next_redirect_mobile_url)

      // 4단계: 장바구니 비우기
      console.log('=== 4단계: 장바구니 비우기 ===')
      await Promise.all(carts.map((cart) => cartApi.deleteCart(cart.id)))
      console.log('장바구니 비우기 완료')

      // 5단계: 카카오페이 결제 페이지로 리다이렉트
      console.log('=== 5단계: 리다이렉트 URL 확인 ===')
      
      // snake_case와 camelCase 모두 지원
      const redirectUrl =
        readyResult.nextRedirectPcUrl ?? 
        response.next_redirect_pc_url ??
        readyResult.nextRedirectMobileUrl ?? 
        response.next_redirect_mobile_url ??
        readyResult.nextRedirectAppUrl ?? 
        response.next_redirect_app_url ??
        ''
      
      console.log('최종 리다이렉트 URL:', redirectUrl)
      
      if (!redirectUrl) {
        console.error('❌ 결제 페이지 URL을 찾을 수 없습니다!')
        console.error('응답 객체 전체:', JSON.stringify(readyResult, null, 2))
        throw new Error('결제 페이지 URL을 받지 못했습니다. 브라우저 콘솔을 확인해주세요.')
      }

      console.log('✅ 카카오페이 결제 페이지로 이동:', redirectUrl)
      window.location.href = redirectUrl
      
    } catch (err) {
      console.error('❌ 결제 준비 실패:')
      console.error('에러 객체:', err)
      
      if (err instanceof Error) {
        console.error('에러 메시지:', err.message)
        console.error('에러 스택:', err.stack)
      }
      
      // Axios 에러인 경우
      if ((err as any).response) {
        console.error('서버 응답 상태:', (err as any).response.status)
        console.error('서버 응답 데이터:', (err as any).response.data)
      }
      
      alert(err instanceof Error ? err.message : '결제 준비에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalAmount = carts.reduce((sum, cart) => sum + cart.totalPrice, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">주문하기</h1>

        <form onSubmit={handleSubmit}>
          {/* 주문 상품 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">주문 상품</h2>
            <div className="border rounded-lg p-4 space-y-4 bg-white">
              {carts.map((cart) => (
                <div key={cart.id} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
                  <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-xs">이미지</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{cart.productInfo.productName}</div>
                    <div className="text-sm text-gray-600">
                      {cart.productInfo.brandName}
                    </div>
                    <div className="text-sm text-gray-600">
                      옵션: {cart.productInfo.optionName}
                    </div>
                    <div className="text-sm text-gray-600">수량: {cart.count}개</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">
                      {cart.totalPrice.toLocaleString()}원
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 배송 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">배송 정보</h2>
            <div className="border rounded-lg p-6 space-y-4 bg-white">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  받는 사람 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="receiverName"
                  value={formData.receiverName}
                  onChange={handleInputChange}
                  placeholder="이름을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="receiverPhone"
                  value={formData.receiverPhone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  배송 주소 <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="receiverAddress"
                  value={formData.receiverAddress}
                  onChange={handleInputChange}
                  placeholder="상세 주소를 입력하세요"
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* 결제 정보 */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">결제 정보</h2>
            <div className="border rounded-lg p-6 bg-white">
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>상품 금액</span>
                  <span className="font-semibold">{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>배송비</span>
                  <span className="font-semibold text-green-600">무료</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>할인</span>
                  <span className="font-semibold">0원</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between items-center">
                <span className="text-xl font-bold">총 결제금액</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalAmount.toLocaleString()}원
                </span>
              </div>
            </div>
          </div>

          {/* 약관 동의 */}
          <div className="mb-8">
            <div className="border rounded-lg p-4 bg-gray-50">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="mt-1" />
                <span className="text-sm text-gray-700">
                  주문 내용을 확인하였으며, 구매 조건 및 개인정보 수집·이용 및 제공에 동의합니다. (필수)
                </span>
              </label>
            </div>
          </div>

          {/* 결제 버튼 */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="flex-1 py-4 border-2 border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              disabled={submitting}
            >
              장바구니로 돌아가기
            </button>
            <button
              type="submit"
              className="flex-1 py-4 bg-yellow-400 text-gray-900 rounded-lg font-bold text-lg hover:bg-yellow-500 disabled:bg-gray-400 disabled:text-white disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="w-5 h-5 border-2 border-gray-700 border-t-transparent rounded-full animate-spin" />
                  처리 중...
                </>
              ) : (
                <>💛 카카오페이로 {totalAmount.toLocaleString()}원 결제</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
