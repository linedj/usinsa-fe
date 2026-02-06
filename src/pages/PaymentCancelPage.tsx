import { useNavigate, useSearchParams } from 'react-router-dom'
import { paymentApi } from '@/api/paymentApi'
import { useState } from 'react'

export default function PaymentCancelPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [retrying, setRetrying] = useState(false)

  const orderId = searchParams.get('orderId')

  // 카카오페이 취소 후 백엔드 취소 API 호출
  const handleCancel = async () => {
    if (!orderId) return
    setRetrying(true)
    try {
      await paymentApi.cancelPayment(Number(orderId))
      alert('결제가 취소되었습니다.')
    } catch (err) {
      // 백엔드 취소 실패 시에도 주문 목록으로 이동
      console.error('백엔드 결제 취소 실패:', err)
    } finally {
      setRetrying(false)
      navigate('/orders')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="text-7xl mb-6">🔙</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-3">결제가 취소되었습니다.</h1>
        <p className="text-gray-500 mb-2">카카오페이 결제 페이지에서 취소하셨습니다.</p>
        {orderId && (
          <p className="text-sm text-gray-400 mb-8">주문번호: {orderId}</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            다시 결제하기
          </button>
          <button
            onClick={handleCancel}
            disabled={retrying}
            className="w-full py-3 border border-red-500 text-red-600 rounded-lg font-semibold hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {retrying ? '취소 처리 중...' : '주문 취소 및 주문 내역 확인'}
          </button>
        </div>
      </div>
    </div>
  )
}
