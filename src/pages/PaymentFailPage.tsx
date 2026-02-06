import { useNavigate, useSearchParams } from 'react-router-dom'

export default function PaymentFailPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const orderId = searchParams.get('orderId')

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="text-7xl mb-6">❌</div>
        <h1 className="text-2xl font-bold text-red-600 mb-3">결제에 실패했습니다.</h1>
        <p className="text-gray-500 mb-2">카카오페이 결제 처리 중 오류가 발생했습니다.</p>
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
            onClick={() => navigate('/orders')}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            주문 내역 확인
          </button>
        </div>
      </div>
    </div>
  )
}
