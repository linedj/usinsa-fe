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
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="max-w-md w-full mx-4 text-center">
        <h1 className="text-2xl font-black tracking-tightest mb-3">결제가 취소되었습니다</h1>
        <p className="text-sm text-graphite mb-2">카카오페이 결제 페이지에서 취소하셨습니다.</p>
        {orderId && (
          <p className="text-xs text-graphite mb-8">주문번호: {orderId}</p>
        )}

        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3 bg-ink text-paper font-semibold hover:opacity-85 transition-opacity"
          >
            다시 결제하기
          </button>
          <button
            onClick={handleCancel}
            disabled={retrying}
            className="w-full py-3 bg-paper border border-signal text-signal font-semibold hover:bg-signal/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {retrying ? '취소 처리 중...' : '주문 취소 및 주문 내역 확인'}
          </button>
        </div>
      </div>
    </div>
  )
}
