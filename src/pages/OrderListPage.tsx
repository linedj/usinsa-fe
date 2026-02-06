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

  // 백엔드 OrderStatus에 맞춘 색상
  const getStatusColor = (status: OrderStatus): string => {
    const colorMap: Record<OrderStatus, string> = {
      CREATED: 'bg-gray-100 text-gray-800',
      PAYMENT_READY: 'bg-yellow-100 text-yellow-800',
      PAYMENT_COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

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
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button
            onClick={() => loadOrders()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">주문 내역</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-xl mb-2">주문 내역이 없습니다.</p>
            <p className="text-gray-400 mb-6">첫 주문을 시작해보세요!</p>
            <button
              onClick={() => navigate('/products')}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              상품 둘러보기
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* 주문 헤더 */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-lg">주문번호: {order.id}</span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 주문 정보 */}
                <div className="p-6">
                  {/* 배송 정보 */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-3">배송 정보</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-600 w-24">받는 사람</span>
                          <span className="text-gray-900 font-medium">{order.receiverName}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">연락처</span>
                          <span className="text-gray-900">{order.receiverPhone}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">주소</span>
                          <span className="text-gray-900">{order.receiverAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="mt-4 flex justify-end gap-2">
                    {(order.status === 'CREATED' || order.status === 'PAYMENT_READY') && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        주문 취소
                      </button>
                    )}
                    {order.status === 'PAYMENT_READY' && (
                      <button
                        onClick={() => navigate(`/checkout?orderId=${order.id}`)}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
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
