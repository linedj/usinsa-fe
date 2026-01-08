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
}

export type ProductOptionCreateRequest = {
  size: string
  color: string
  stock: number
}

export type ProductOptionResponse = {
  id: number
  productId: number
  size: string
  color: string
  stock: number
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

// Order Types
export type OrderCreateRequest = {
  memberId: number
  orderItems: OrderItemRequest[]
  recipientName: string
  recipientPhone: string
  shippingAddress: string
}

export type OrderItemRequest = {
  productOptionId: number
  quantity: number
  price: number
}

export type OrderUpdateRequest = {
  status: string
  recipientName?: string
  recipientPhone?: string
  shippingAddress?: string
}

export type OrderResponse = {
  id: number
  memberId: number
  orderNumber: string
  status: string
  totalAmount: number
  recipientName: string
  recipientPhone: string
  shippingAddress: string
  orderDate: string
  orderItems: OrderItemResponse[]
}

export type OrderItemResponse = {
  id: number
  productOptionId: number
  productName: string
  quantity: number
  price: number
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
