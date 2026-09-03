import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderId = searchParams.get('orderId')

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="max-w-md w-full mx-4 text-center">
        <h1 className="text-2xl font-black tracking-tightest text-signal mb-3">결제에 실패했습니다</h1>
        <p className="text-sm text-graphite mb-2">카카오페이 결제 처리 중 오류가 발생했습니다.</p>
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
            onClick={() => navigate('/orders')}
            className="w-full py-3 bg-paper border border-line text-ink font-semibold hover:border-ink transition-colors"
          >
            주문 내역 확인
          </button>
        </div>
      </div>
    </div>
  )
}
