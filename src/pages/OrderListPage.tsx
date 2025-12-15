import { useState, useEffect } from 'react'
import { orderApi } from '@/api/orderApi'
import type { OrderResponse } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function OrderListPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      setLoading(true)
      const data = await orderApi.getAllOrders()
      // 현재 사용자의 주문만 필터링 (실제로는 백엔드에서 필터링되어야 함)
      const userOrders = user?.memberId ? data.filter((order) => order.memberId === user.memberId) : []
      setOrders(userOrders)
    } catch (err) {
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

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      PENDING: '결제 대기',
      PAID: '결제 완료',
      PREPARING: '배송 준비중',
      SHIPPED: '배송중',
      DELIVERED: '배송 완료',
      CANCELLED: '주문 취소',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      SHIPPED: 'bg-indigo-100 text-indigo-800',
      DELIVERED: 'bg-green-100 text-green-800',
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
        <div className="text-xl text-red-600">{error}</div>
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
            <a
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              상품 둘러보기
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                {/* 주문 헤더 */}
                <div className="bg-gray-50 px-6 py-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-lg">주문번호: {order.orderNumber}</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        주문일시: {new Date(order.orderDate).toLocaleString('ko-KR')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="p-6">
                  <h3 className="font-semibold mb-4">주문 상품</h3>
                  <div className="space-y-4 mb-6">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">이미지</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold mb-1">{item.productName}</div>
                          <div className="text-sm text-gray-600">
                            수량: {item.quantity}개
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{item.price?.toLocaleString()}원</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 배송 정보 */}
                  <div className="border-t pt-4 mb-4">
                    <h3 className="font-semibold mb-3">배송 정보</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex">
                          <span className="text-gray-600 w-24">받는 사람</span>
                          <span className="text-gray-900 font-medium">{order.recipientName}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">연락처</span>
                          <span className="text-gray-900">{order.recipientPhone}</span>
                        </div>
                        <div className="flex">
                          <span className="text-gray-600 w-24">주소</span>
                          <span className="text-gray-900">{order.shippingAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 결제 금액 */}
                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="font-semibold text-lg">총 결제금액</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {order.totalAmount?.toLocaleString()}원
                    </span>
                  </div>

                  {/* 액션 버튼 */}
                  <div className="mt-4 flex justify-end gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="px-6 py-2 border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                      >
                        주문 취소
                      </button>
                    )}
                    {order.status === 'DELIVERED' && (
                      <button
                        className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                      >
                        교환/반품 신청
                      </button>
                    )}
                    <button
                      className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                      주문 상세
                    </button>
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
