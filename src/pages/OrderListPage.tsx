import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { orderApi } from '@/api/orderApi'
import type { OrderResponse, OrderStatus } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }
    loadOrders()
  }, [user, navigate])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await orderApi.getAllOrders()
      // 최신순 정렬
      const sortedOrders = data.sort((a, b) => b.id - a.id)
      setOrders(sortedOrders)
    } catch (err) {
      console.error('주문 목록 조회 실패:', err)
      setError(err instanceof Error ? err.message : '주문 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm('주문을 취소하시겠습니까?')) return

    try {
      await orderApi.cancelOrder(orderId)
      await loadOrders()
      alert('주문이 취소되었습니다.')
    } catch (err) {
      alert(err instanceof Error ? err.message : '주문 취소에 실패했습니다.')
    }
  }

  // 백엔드 OrderStatus에 맞춘 라벨
  const getStatusLabel = (status: OrderStatus): string => {
    const statusMap: Record<OrderStatus, string> = {
      CREATED: '주문 생성',
      PAYMENT_READY: '결제 준비',
      PAYMENT_COMPLETED: '결제 완료',
      CANCELLED: '주문 취소',
    }
    return statusMap[status] || status
  }

  // 백엔드 OrderStatus에 맞춘 스타일 - 흑백 톤에서는 테두리 색상으로만 구분
  const getStatusStyle = (status: OrderStatus): string => {
    const styleMap: Record<OrderStatus, string> = {
      CREATED: 'border-line text-graphite',
      PAYMENT_READY: 'border-ink text-ink',
      PAYMENT_COMPLETED: 'border-ink bg-ink text-paper',
      CANCELLED: 'border-signal text-signal',
    }
    return styleMap[status] || 'border-line text-graphite'
  }

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
        <div className="text-center">
          <div className="text-sm text-signal mb-4">{error}</div>
          <button
            onClick={() => loadOrders()}
            className="px-6 py-2 bg-ink text-paper text-sm font-semibold hover:opacity-85 transition-opacity"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black tracking-tightest mb-8">주문 내역</h1>

        {orders.length === 0 ? (
          <div className="text-center py-24 border border-line">
            <p className="text-graphite text-sm mb-2">주문 내역이 없습니다.</p>
            <p className="text-graphite text-sm mb-6">첫 주문을 시작해보세요.</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-ink text-paper px-6 py-3 text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              상품 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border border-line"
              >
                {/* 주문 헤더 */}
                <div className="bg-mist px-6 py-4 border-b border-line">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">주문번호: {order.id}</span>
                    <span
                      className={`px-3 py-1 border text-xs font-semibold ${getStatusStyle(order.status)}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                </div>

                {/* 주문 정보 */}
                <div className="p-6">
                  {/* 배송 정보 */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-3 text-sm">배송 정보</h3>
                    <div className="bg-mist p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-graphite w-24">받는 사람</span>
                          <span className="font-medium">{order.receiverName}</span>
                        </div>
                        <div className="flex">
                          <span className="text-graphite w-24">연락처</span>
                          <span>{order.receiverPhone}</span>
                        </div>
                        <div className="flex">
                          <span className="text-graphite w-24">주소</span>
                          <span>{order.receiverAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="mt-4 flex justify-end gap-2">
                    {(order.status === 'CREATED' || order.status === 'PAYMENT_READY') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-6 py-2 bg-paper border border-signal text-signal hover:bg-signal/5 transition-colors font-medium text-sm"
                      >
                        주문 취소
                      </button>
                    )}
                    {order.status === 'PAYMENT_READY' && (
                      <button
                        onClick={() => navigate(`/checkout?orderId=${order.id}`)}
                        className="px-6 py-2 bg-ink text-paper hover:opacity-85 transition-opacity font-medium text-sm"
                      >
                        결제하기
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
