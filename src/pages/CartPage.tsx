import { useState, useEffect } from 'react'
import { cartApi } from '@/api/cartApi'
import type { CartItem } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function CartPage() {
  const [carts, setCarts] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadCarts()
  }, [user])

  const loadCarts = async () => {
    try {
      setLoading(true)
      const data = user?.memberId
        ? await cartApi.getMemberCarts(user.memberId)
        : await cartApi.getGuestCarts()
      setCarts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '장바구니를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (cartId: number, newCount: number) => {
    if (newCount < 1) return
    try {
      user
        ? await cartApi.updateCart(cartId, { count: newCount })
        : await cartApi.updateGuestCart(cartId, { count: newCount })
      await loadCarts()
    } catch (err) {
      alert(err instanceof Error ? err.message : '수량 변경에 실패했습니다.')
    }
  }

  const handleDelete = async (cartId: number) => {
    if (!confirm('장바구니에서 삭제하시겠습니까?')) return
    try {
      user
        ? await cartApi.deleteCart(cartId)
        : await cartApi.deleteGuestCartItem(cartId)
      await loadCarts()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  const handleDeleteAll = async () => {
    if (!confirm('장바구니를 전체 삭제하시겠습니까?')) return
    try {
      if (!user) {
        await cartApi.deleteGuestCarts()
      } else {
        await Promise.all(carts.map((cart) => cartApi.deleteCart(cart.id)))
      }
      await loadCarts()
    } catch (err) {
      alert(err instanceof Error ? err.message : '삭제에 실패했습니다.')
    }
  }

  const handleCheckout = () => {
    if (carts.length === 0) {
      alert('장바구니가 비어있습니다.')
      return
    }
    if (!user) {
      alert('주문하려면 로그인이 필요합니다.')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  const totalAmount = carts.reduce((sum, cart) => sum + cart.totalPrice, 0)
  const totalCount = carts.reduce((sum, cart) => sum + cart.count, 0)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">장바구니</h1>
        {carts.length > 0 && (
          <button onClick={handleDeleteAll} className="text-red-600 hover:text-red-700 text-sm">
            전체 삭제
          </button>
        )}
      </div>

      {carts.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-500 text-xl mb-6">장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {carts.map((cart) => (
              <div key={cart.id} className="border rounded-lg p-6 bg-white shadow-sm">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    <span className="text-gray-400 text-sm">이미지</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-sm text-gray-500 mb-1">{cart.productInfo.brandName}</div>
                    <h3 className="font-semibold text-lg mb-2">{cart.productInfo.productName}</h3>
                    <div className="text-sm text-gray-600 mb-3">
                      <span>옵션: {cart.productInfo.optionName}</span>
                      {cart.productInfo.stock !== null && (
                        <span className="ml-4 text-gray-500">재고: {cart.productInfo.stock}개</span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-blue-600">
                      {cart.productInfo.price.toLocaleString()}원
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleDelete(cart.id)}
                      className="text-gray-400 hover:text-red-600 text-xl"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2 border rounded">
                        <button
                          onClick={() => handleUpdateQuantity(cart.id, cart.count - 1)}
                          disabled={cart.count <= 1}
                          className="w-9 h-9 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="수량 감소"
                        >
                          -
                        </button>
                        <span className="w-12 text-center font-semibold">{cart.count}</span>
                        <button
                          onClick={() => handleUpdateQuantity(cart.id, cart.count + 1)}
                          className="w-9 h-9 hover:bg-gray-100"
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-xl font-bold">{cart.totalPrice.toLocaleString()}원</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 bg-white shadow-sm sticky top-4">
              <h2 className="text-xl font-bold mb-6">주문 요약</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>상품 수</span>
                  <span>{carts.length}개</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>총 수량</span>
                  <span>{totalCount}개</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>배송비</span>
                  <span className="text-green-600">무료</span>
                </div>
              </div>
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>총 결제금액</span>
                  <span className="text-blue-600 text-2xl">{totalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                주문하기
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                쇼핑 계속하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
