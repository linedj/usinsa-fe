import { http } from './http'
import type { components } from '#backend/apiV1/schema'

type ApiResponse<T> = {
  success: boolean
  status: number
  data?: T
  error?: { code?: string; message?: string }
}

// Helper to unwrap API responses
const unwrapResponse = <T>(response: any): ApiResponse<T> => {
  // axios response structure: { data, status, ... }
  const responseData = response.data
  return {
    success: responseData?.success ?? (response.status >= 200 && response.status < 300),
    status: response.status,
    data: responseData?.data ?? (responseData?.success !== false ? responseData : undefined),
    error: responseData?.error,
  }
}

// Products API
export const productApi = {
  async getAllProducts(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/products')
    return unwrapResponse(response)
  },
  async getProduct(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/products/${id}`)
    return unwrapResponse(response)
  },
  async createProduct(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/products', payload)
    return unwrapResponse(response)
  },
  async updateProduct(
    id: number,
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/products/${id}`, payload)
    return unwrapResponse(response)
  },
  async deleteProduct(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/products/${id}`)
    return unwrapResponse(response)
  },
  async addOption(
    productId: number,
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>(
      `/api/v1/products/${productId}/options`,
      payload,
    )
    return unwrapResponse(response)
  },
  async rebuildIndex(): Promise<ApiResponse<string>> {
    const response = await http.post<string>('/api/v1/products/reindex')
    return unwrapResponse(response)
  },
}

// Orders API
export const orderApi = {
  async getAllOrders(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/orders')
    return unwrapResponse(response)
  },
  async getOrder(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/orders/${id}`)
    return unwrapResponse(response)
  },
  async createOrder(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/orders', payload)
    return unwrapResponse(response)
  },
  async updateOrder(
    orderId: number,
    payload: components['schemas']['UpdateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/orders/${orderId}`, payload)
    return unwrapResponse(response)
  },
  async cancelOrder(orderId: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>(`/api/v1/orders/${orderId}/cancel`)
    return unwrapResponse(response)
  },
}

// Ordered Products API
export const orderedProductApi = {
  async getAllOrderedProducts(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/ordered-products')
    return unwrapResponse(response)
  },
  async getOrderedProduct(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/ordered-products/${id}`)
    return unwrapResponse(response)
  },
  async createOrderedProduct(
    payload: components['schemas']['Request'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/ordered-products', payload)
    return unwrapResponse(response)
  },
  async updateQuantity(id: number, quantity: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(
      `/api/v1/ordered-products/${id}/quantity?quantity=${quantity}`,
    )
    return unwrapResponse(response)
  },
  async deleteOrderedProduct(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/ordered-products/${id}`)
    return unwrapResponse(response)
  },
}

// Delivery Address API
export const deliveryAddressApi = {
  async getAllDeliveryAddresses(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/delivery-address')
    return unwrapResponse(response)
  },
  async getDeliveryAddress(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/delivery-address/${id}`)
    return unwrapResponse(response)
  },
  async createDeliveryAddress(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/delivery-address', payload)
    return unwrapResponse(response)
  },
  async updateDeliveryAddress(
    id: number,
    payload: components['schemas']['UpdateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/delivery-address/${id}`, payload)
    return unwrapResponse(response)
  },
  async deleteDeliveryAddress(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/delivery-address/${id}`)
    return unwrapResponse(response)
  },
}

// Deliveries API
export const deliveryApi = {
  async getAllDeliveries(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/deliveries')
    return unwrapResponse(response)
  },
  async getDelivery(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/deliveries/${id}`)
    return unwrapResponse(response)
  },
  async createDelivery(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/deliveries', payload)
    return unwrapResponse(response)
  },
  async updateDelivery(
    id: number,
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/deliveries/${id}`, payload)
    return unwrapResponse(response)
  },
  async deleteDelivery(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/deliveries/${id}`)
    return unwrapResponse(response)
  },
}

// Categories API
export const categoryApi = {
  async getAllCategories(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/categories')
    return unwrapResponse(response)
  },
  async getCategory(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/categories/${id}`)
    return unwrapResponse(response)
  },
  async createCategory(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/categories', payload)
    return unwrapResponse(response)
  },
  async updateCategory(id: number, name: string): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/categories/${id}?name=${encodeURIComponent(name)}`)
    return unwrapResponse(response)
  },
  async deleteCategory(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/categories/${id}`)
    return unwrapResponse(response)
  },
}

// Carts API
export const cartApi = {
  async getAllCarts(): Promise<ApiResponse<components['schemas']['Response'][]>> {
    const response = await http.get<components['schemas']['Response'][]>('/api/v1/carts')
    return unwrapResponse(response)
  },
  async getCart(id: number): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.get<components['schemas']['Response']>(`/api/v1/carts/${id}`)
    return unwrapResponse(response)
  },
  async createCart(
    payload: components['schemas']['CreateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.post<components['schemas']['Response']>('/api/v1/carts', payload)
    return unwrapResponse(response)
  },
  async updateCart(
    id: number,
    payload: components['schemas']['UpdateReq'],
  ): Promise<ApiResponse<components['schemas']['Response']>> {
    const response = await http.put<components['schemas']['Response']>(`/api/v1/carts/${id}`, payload)
    return unwrapResponse(response)
  },
  async deleteCart(id: number): Promise<ApiResponse<void>> {
    const response = await http.delete(`/api/v1/carts/${id}`)
    return unwrapResponse(response)
  },
}

// Search API
export const searchApi = {
  async search(keyword: string, userId?: number): Promise<ApiResponse<components['schemas']['ProductSearchDto'][]>> {
    const params = new URLSearchParams({ keyword })
    if (userId) params.append('userId', userId.toString())
    const response = await http.get<components['schemas']['ProductSearchDto'][]>(`/api/v1/search?${params}`)
    return unwrapResponse(response)
  },
  async getTrendingKeywords(): Promise<ApiResponse<string[]>> {
    const response = await http.get<string[]>('/api/v1/search/trend')
    return unwrapResponse(response)
  },
  async getUserSearchHistory(userId: number): Promise<ApiResponse<string[]>> {
    const response = await http.get<string[]>(`/api/v1/search/history/${userId}`)
    return unwrapResponse(response)
  },
}

