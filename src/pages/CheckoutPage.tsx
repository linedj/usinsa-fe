import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { cartApi } from '@/api/cartApi'
import { orderApi } from '@/api/orderApi'
import type { CartResponse } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function CheckoutPage() {
  const [carts, setCarts] = useState<CartResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    recipientName: '',
    recipientPhone: '',
    shippingAddress: '',
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
      setCarts(data)

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.memberId) {
      alert('로그인이 필요합니다.')
      return
    }

    if (!formData.recipientName || !formData.recipientPhone || !formData.shippingAddress) {
      alert('모든 배송 정보를 입력해주세요.')
      return
    }

    try {
      setSubmitting(true)

      const orderItems = carts.map((cart) => ({
        productOptionId: cart.productOptionId,
        quantity: cart.quantity,
        price: cart.price,
      }))

      await orderApi.createOrder({
        memberId: user.memberId,
        orderItems,
        recipientName: formData.recipientName,
        recipientPhone: formData.recipientPhone,
        shippingAddress: formData.shippingAddress,
      })

      // 주문 완료 후 장바구니 비우기
      await Promise.all(carts.map((cart) => cartApi.deleteCart(cart.id)))

      alert('주문이 완료되었습니다.')
      navigate('/orders')
    } catch (err) {
      alert(err instanceof Error ? err.message : '주문에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalAmount = carts.reduce((sum, cart) => sum + (cart.totalPrice || 0), 0)

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
                    <div className="font-semibold mb-1">{cart.productName}</div>
                    <div className="text-sm text-gray-600">
                      옵션: {cart.optionSize} / {cart.optionColor}
                    </div>
                    <div className="text-sm text-gray-600">수량: {cart.quantity}개</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{cart.totalPrice?.toLocaleString()}원</div>
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
                  name="recipientName"
                  value={formData.recipientName}
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
                  name="recipientPhone"
                  value={formData.recipientPhone}
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
                  name="shippingAddress"
                  value={formData.shippingAddress}
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
                <span className="text-2xl font-bold text-blue-600">{totalAmount.toLocaleString()}원</span>
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

          {/* 주문 버튼 */}
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
              className="flex-1 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              disabled={submitting}
            >
              {submitting ? '주문 처리 중...' : `${totalAmount.toLocaleString()}원 결제하기`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
