import type { components } from '#backend/apiV1/schema'

export type LoginRequest = components['schemas']['LoginReq']
export type LoginEnvelope = components['schemas']['RsDataLoginRes']
export type LoginPayload = components['schemas']['LoginRes']

export type SignUpRequest = components['schemas']['SignUpReq']
export type SignUpEnvelope = components['schemas']['RsDataVoid']

export type OAuthLoginRequest = components['schemas']['OAuthLoginReq']
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

// Cart Types
export type CartCreateRequest = {
  memberId: number
  productOptionId: number
  quantity: number
}

export type CartGuestCreateRequest = {
  productOptionId: number
  quantity: number
}

export type CartUpdateRequest = {
  quantity: number
}

export type CartResponse = {
  id: number
  memberId?: number
  sessionId?: string
  productOptionId: number
  productName: string
  optionSize: string
  optionColor: string
  quantity: number
  price: number
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
