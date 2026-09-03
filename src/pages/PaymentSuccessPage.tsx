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
      <div className="flex flex-col justify-center items-center min-h-[70vh] gap-4">
        <div className="w-10 h-10 border-2 border-ink border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">결제 승인 처리 중...</p>
        <p className="text-xs text-graphite">잠시만 기다려주세요</p>
      </div>
    )
  }

  // ─── Error ────────────────────────────────────────────────
  if (error || !approveResult) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="max-w-md w-full mx-4 text-center">
          <h1 className="text-2xl font-black tracking-tightest text-signal mb-3">결제 승인 실패</h1>
          <p className="text-sm text-graphite mb-8">{error ?? '알 수 없는 오류가 발생했습니다.'}</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/cart')}
              className="w-full py-3 bg-ink text-paper font-semibold hover:opacity-85 transition-opacity"
            >
              장바구니로 이동
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

  // ─── Success ──────────────────────────────────────────────
  return (
    <div className="flex justify-center items-center min-h-[70vh] bg-paper py-12">
      <div className="max-w-md w-full mx-4">
        {/* 성공 아이콘 */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 border border-ink items-center justify-center mb-4">
            <svg className="w-8 h-8 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tightest">결제가 완료되었습니다</h1>
          <p className="text-sm text-graphite mt-1">주문이 정상 처리되었습니다.</p>
        </div>

        {/* 결제 상세 정보 */}
        <div className="border border-line mb-6">
          <div className="bg-mist px-5 py-3 border-b border-line">
            <span className="text-xs font-bold uppercase tracking-wide text-graphite">결제 상세 정보</span>
          </div>
          <div className="p-5 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-graphite">주문번호</span>
              <span className="font-semibold">{approveResult.partnerOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">상품명</span>
              <span className="font-semibold text-right max-w-[200px] truncate">
                {approveResult.itemName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">수량</span>
              <span className="font-semibold">{approveResult.quantity}개</span>
            </div>
            <div className="flex justify-between">
              <span className="text-graphite">결제 수단</span>
              <span className="font-semibold">
                {approveResult.paymentMethodType === 'MONEY' ? '카카오머니' : approveResult.paymentMethodType}
              </span>
            </div>
            {approveResult.cardInfo && (
              <div className="flex justify-between">
                <span className="text-graphite">카드사</span>
                <span className="font-semibold">{approveResult.cardInfo.issuerCorp ?? '-'}</span>
              </div>
            )}
            <div className="border-t border-line pt-3 flex justify-between items-center">
              <span className="font-semibold">총 결제금액</span>
              <span className="text-xl font-black">
                {approveResult.amount.total.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

        {/* 금액 상세 */}
        <div className="border border-line mb-6">
          <div className="p-5 space-y-2 text-sm">
            <div className="flex justify-between text-graphite">
              <span>상품 금액</span>
              <span>{approveResult.amount.total.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-graphite">
              <span>부가세</span>
              <span>{approveResult.amount.vat.toLocaleString()}원</span>
            </div>
            {(approveResult.amount.discount ?? 0) > 0 && (
              <div className="flex justify-between text-signal">
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
            className="w-full py-3 bg-ink text-paper font-semibold hover:opacity-85 transition-opacity"
          >
            주문 내역 확인
          </button>
          <button
            onClick={() => navigate('/products')}
            className="w-full py-3 border border-line text-ink font-semibold hover:border-ink transition-colors"
          >
            쇼핑 계속하기
          </button>
        </div>
      </div>
    </div>
  )
}
