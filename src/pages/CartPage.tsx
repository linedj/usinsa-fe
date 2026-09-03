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
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-graphite">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-signal">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black tracking-tightest">장바구니</h1>
        {carts.length > 0 && (
          <button onClick={handleDeleteAll} className="bg-transparent text-signal hover:opacity-70 text-sm font-medium">
            전체 삭제
          </button>
        )}
      </div>

      {carts.length === 0 ? (
        <div className="text-center py-24 border border-line">
          <p className="text-graphite text-sm mb-6">장바구니가 비어있습니다.</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-ink text-paper px-8 py-3 text-sm font-semibold hover:opacity-85 transition-opacity"
          >
            쇼핑 계속하기
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {carts.map((cart) => (
              <div key={cart.id} className="border border-line p-6">
                <div className="flex gap-6">
                  <div className="w-32 h-32 bg-mist flex items-center justify-center flex-shrink-0">
                    <span className="text-graphite text-xs">이미지</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-graphite mb-1">{cart.productInfo.brandName}</div>
                    <h3 className="font-semibold mb-2">{cart.productInfo.productName}</h3>
                    <div className="text-sm text-graphite mb-3">
                      <span>옵션: {cart.productInfo.optionName}</span>
                      {cart.productInfo.stock !== null && (
                        <span className="ml-4">재고: {cart.productInfo.stock}개</span>
                      )}
                    </div>
                    <div className="text-lg font-bold">
                      {cart.productInfo.price.toLocaleString()}원
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleDelete(cart.id)}
                      className="bg-transparent text-graphite hover:text-signal text-lg"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                    <div className="flex flex-col items-end gap-4">
                      <div className="flex items-center gap-2 border border-line">
                        <button
                          onClick={() => handleUpdateQuantity(cart.id, cart.count - 1)}
                          disabled={cart.count <= 1}
                          className="w-9 h-9 bg-paper hover:bg-mist disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="수량 감소"
                        >
                          −
                        </button>
                        <span className="w-12 text-center font-semibold text-sm">{cart.count}</span>
                        <button
                          onClick={() => handleUpdateQuantity(cart.id, cart.count + 1)}
                          className="w-9 h-9 bg-paper hover:bg-mist"
                          aria-label="수량 증가"
                        >
                          +
                        </button>
                      </div>
                      <div className="text-lg font-bold">{cart.totalPrice.toLocaleString()}원</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-line p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-6">주문 요약</h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-graphite">
                  <span>상품 수</span>
                  <span>{carts.length}개</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>총 수량</span>
                  <span>{totalCount}개</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>상품 금액</span>
                  <span>{totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between text-graphite">
                  <span>배송비</span>
                  <span>무료</span>
                </div>
              </div>
              <div className="border-t border-line pt-4 mb-6">
                <div className="flex justify-between items-center text-base font-bold">
                  <span>총 결제금액</span>
                  <span className="text-xl">{totalAmount.toLocaleString()}원</span>
                </div>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-ink text-paper py-4 text-base font-semibold hover:opacity-85 transition-opacity"
              >
                주문하기
              </button>
              <button
                onClick={() => navigate('/products')}
                className="w-full mt-3 bg-paper border border-line text-ink py-3 text-sm font-medium hover:border-ink transition-colors"
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
