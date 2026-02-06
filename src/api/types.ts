import type { components } from '#backend/apiV1/schema'

export type LoginRequest = components['schemas']['LoginReq']
export type LoginEnvelope = components['schemas']['RsDataLoginRes']
export type LoginPayload = components['schemas']['LoginRes']

export type SignUpRequest = components['schemas']['SignupReq']
export type SignUpEnvelope = components['schemas']['RsDataVoid']

// OAuth types - 백엔드에서 아직 OpenAPI 스키마에 추가되지 않음
export type OAuthLoginRequest = {
  provider: string
  code: string
  redirectUri: string
}

export type OAuthLoginEnvelope = components['schemas']['RsDataLoginRes']

export type TokenPair = components['schemas']['TokenPair']
export type TokenPairEnvelope = components['schemas']['RsDataTokenPair']

export type RefreshRequest = components['schemas']['RefreshReq']
export type LogoutEnvelope = components['schemas']['RsDataVoid']
export type ErrorDetail = components['schemas']['ErrorDetail']

export type ApiSuccessResponse<T> = {
  success?: boolean
  status?: number
  error?: ErrorDetail
  data?: T
}

// Product Types
export type ProductCreateRequest = {
  categoryId: number
  name: string
  brand: string
  price: number
}

export type ProductResponse = {
  id: number
  categoryName: string
  name: string
  brandName: string
  price: number
  likeCount: number
  clickCount: number
  options?: ProductOptionResponse[]
}

export type ProductOptionCreateRequest = {
  optionName: string
  stock: number
}

export type ProductOptionResponse = {
  id: number
  optionName: string
  stock: number
  productId: number
}

// Product Like Types
export type ProductLikeResponse = {
  productId: number
  liked: boolean
  likeCount: number
}

export type ProductLikeStatusResponse = components['schemas']['StatusResponse']

// Cart Types
export type CartCreateRequest = {
  memberId: number
  productOptionId: number
  count: number
}

export type CartGuestCreateRequest = {
  productOptionId: number
  count: number
}

export type CartUpdateRequest = {
  count: number
}

export type ProductInfo = {
  productId: number
  productName: string
  brandName: string
  price: number
  optionName: string
  stock: number | null
}

export type CartResponse = {
  id: number
  memberId?: number | null
  sessionId?: string | null
  productOptionId: number
  count: number
  guest: boolean
  productInfo: ProductInfo
}

// Computed cart properties for UI
export type CartItem = CartResponse & {
  totalPrice: number
}

// ─── Order Types (백엔드 변경사항 반영) ───────────────────────

export type OrderCreateRequest = {
  memberId: number
  receiverName: string
  receiverPhone: string
  receiverAddress: string
}

export type OrderUpdateRequest = {
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
}

// 백엔드 OrderStatus enum과 일치
export type OrderStatus = 
  | 'CREATED'           // 주문 생성
  | 'PAYMENT_READY'     // 결제 준비 완료
  | 'PAYMENT_COMPLETED' // 결제 완료
  | 'CANCELLED'         // 취소됨

export type OrderResponse = {
  id: number
  memberId: number
  receiverAddress: string
  receiverName: string
  receiverPhone: string
  status: OrderStatus
}

// OrderedProduct Types
export type OrderedProductCreateRequest = {
  orderId: number
  productOptionId: number
  quantity: number
}

export type OrderedProductResponse = {
  id: number
  orderId: number
  productOptionId: number
  quantity: number
}

// Search Types
export type ProductSearchDto = {
  id: number
  name: string
  brandName: string
  categoryName: string
  price: number
  likeCount: number
  clickCount: number
}

// ─── Payment Types (백엔드 API 응답 구조와 일치) ────────────────

export type KakaoPayReadyResponse = {
  tid: string
  nextRedirectAppUrl?: string
  nextRedirectMobileUrl?: string
  nextRedirectPcUrl?: string
  androidAppScheme?: string
  iosAppScheme?: string
  createdAt?: string
}

export type KakaoPayAmount = {
  total: number
  taxFree: number
  vat: number
  point?: number
  discount?: number
  greenDeposit?: number
}

export type KakaoPayCardInfo = {
  purchaseCorp?: string
  purchaseCorpCode?: string
  issuerCorp?: string
  issuerCorpCode?: string
  kakaopayPurchaseCorp?: string
  kakaopayPurchaseCorpCode?: string
  kakaopayIssuerCorp?: string
  kakaopayIssuerCorpCode?: string
  bin?: string
  cardType?: string
  installMonth?: string
  approvedId?: string
  cardMid?: string
  interestFreeInstall?: string
  installmentType?: string
  cardItemCode?: string
}

export type KakaoPayApproveResponse = {
  aid: string
  tid: string
  cid: string
  sid?: string
  partnerOrderId: string
  partnerUserId: string
  paymentMethodType: string
  amount: KakaoPayAmount
  cardInfo?: KakaoPayCardInfo
  itemName: string
  itemCode?: string
  quantity: number
  createdAt?: string
  approvedAt?: string
  payload?: string
}

export type KakaoPayCancelResponse = {
  aid: string
  tid: string
  cid: string
  status: string
  partnerOrderId: string
  partnerUserId: string
  paymentMethodType: string
  amount: KakaoPayAmount
  approvedCancelAmount?: KakaoPayAmount
  canceledAmount?: KakaoPayAmount
  cancelAvailableAmount?: KakaoPayAmount
  itemName: string
  itemCode?: string
  quantity: number
  createdAt?: string
  approvedAt?: string
  canceledAt?: string
  payload?: string
}
