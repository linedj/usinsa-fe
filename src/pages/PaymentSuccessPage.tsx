import { useState, useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { paymentApi } from '@/api/paymentApi'
import type { KakaoPayApproveResponse } from '@/api/types'

export default function PaymentSuccessPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const [approveResult, setApproveResult] = useState<KakaoPayApproveResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // StrictMode 이중 실행 방지
  const hasCalled = useRef(false)

  useEffect(() => {
    if (hasCalled.current) return
    hasCalled.current = true

    const orderId = searchParams.get('orderId')
    const pgToken = searchParams.get('pg_token')

    if (!orderId || !pgToken) {
      setError('결제 정보가 올바르지 않습니다.')
      setLoading(false)
      return
    }

    const approve = async () => {
      try {
        console.log('결제 승인 요청:', { orderId, pgToken })
        
        // 백엔드 결제 승인 API 호출 (인증 필요)
        const result = await paymentApi.approvePayment(Number(orderId), pgToken)
        
        console.log('결제 승인 완료:', result)
        setApproveResult(result)
      } catch (err) {
        console.error('결제 승인 실패:', err)
        setError(err instanceof Error ? err.message : '결제 승인에 실패했습니다.')
      } finally {
        setLoading(false)
      }
    }

    approve()
  }, [searchParams])

  // ─── Loading ──────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen gap-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-lg text-gray-600">결제 승인 처리 중...</p>
        <p className="text-sm text-gray-400">잠시만 기다려주세요</p>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────
  if (error || !approveResult) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="max-w-md w-full mx-4 text-center">
          <div className="text-7xl mb-6">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-3">결제 승인 실패</h1>
          <p className="text-gray-600 mb-8">{error ?? '알 수 없는 오류가 발생했습니다.'}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              장바구니로 이동
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

  // ─── Success ──────────────────────────────────────────────
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="max-w-md w-full mx-4">
        {/* 성공 아이콘 */}
        <div className="text-center mb-8">
          <div className="inline-flex w-24 h-24 rounded-full bg-green-100 items-center justify-center mb-4">
            <svg className="w-14 h-14 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">결제가 완료되었습니다!</h1>
          <p className="text-gray-500 mt-1">주문이 정상 처리되었습니다.</p>
        </div>

        {/* 결제 상세 정보 */}
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm mb-6">
          <div className="bg-gray-50 px-5 py-3 border-b">
            <span className="text-sm font-semibold text-gray-600">결제 상세 정보</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-semibold">{approveResult.partnerOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">상품명</span>
              <span className="font-semibold text-right max-w-[200px] truncate">
                {approveResult.itemName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">수량</span>
              <span className="font-semibold">{approveResult.quantity}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">결제 수단</span>
              <span className="font-semibold">
                {approveResult.paymentMethodType === 'MONEY' ? '카카오머니' : approveResult.paymentMethodType}
              </span>
            </div>
            {approveResult.cardInfo && (
              <div className="flex justify-between">
                <span className="text-gray-500">카드사</span>
                <span className="font-semibold">{approveResult.cardInfo.issuerCorp ?? '-'}</span>
              </div>
            )}
            <div className="border-t pt-3 flex justify-between items-center">
              <span className="text-gray-900 font-semibold">총 결제금액</span>
              <span className="text-xl font-bold text-blue-600">
                {approveResult.amount.total.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 금액 상세 */}
        <div className="border rounded-lg bg-white overflow-hidden shadow-sm mb-6">
          <div className="p-5 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>상품 금액</span>
              <span>{approveResult.amount.total.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>부가세</span>
              <span>{approveResult.amount.vat.toLocaleString()}원</span>
            </div>
            {(approveResult.amount.discount ?? 0) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>할인</span>
                <span>-{approveResult.amount.discount?.toLocaleString()}원</span>
              </div>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            주문 내역 확인
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}
