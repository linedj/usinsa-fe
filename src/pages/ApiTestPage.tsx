import { useState } from 'react'
import {
  productApi,
  orderApi,
  orderedProductApi,
  deliveryAddressApi,
  deliveryApi,
  categoryApi,
  cartApi,
  searchApi,
} from '@/api/testApi'
import type { components } from '#backend/apiV1/schema'

type ApiResponse<T = any> = {
  success: boolean
  status: number
  data?: T
  error?: { code?: string; message?: string }
}

const ApiTestSection = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #e0e0e0', borderRadius: '8px' }}>
    <h2 style={{ marginTop: 0, marginBottom: '1.5rem', color: '#333' }}>{title}</h2>
    {children}
  </div>
)

const ApiTestCard = ({
  title,
  method,
  endpoint,
  onTest,
  children,
}: {
  title: string
  method: string
  endpoint: string
  onTest: () => Promise<ApiResponse>
  children: React.ReactNode
}) => {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<ApiResponse | null>(null)

  const handleTest = async () => {
    setLoading(true)
    setResponse(null)
    try {
      const result = await onTest()
      setResponse(result)
    } catch (err: any) {
      setResponse({
        success: false,
        status: err.response?.status || 500,
        error: {
          code: err.response?.data?.error?.code,
          message: err.response?.data?.error?.message || err.message || '알 수 없는 오류',
        },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{title}</h3>
          <code style={{ fontSize: '0.9rem', color: '#666' }}>
            {method} {endpoint}
          </code>
        </div>
        <button
          onClick={handleTest}
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? '테스트 중...' : '테스트'}
        </button>
      </div>
      {children}
      {response && (
        <div
          style={{
            marginTop: '1rem',
            padding: '1rem',
            background: response.success ? '#d4edda' : '#f8d7da',
            borderRadius: '4px',
            border: `1px solid ${response.success ? '#c3e6cb' : '#f5c6cb'}`,
          }}
        >
          <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
            응답 (Status: {response.status})
          </div>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {JSON.stringify(response, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}

export const ApiTestPage = () => {
  // Products
  const [productId, setProductId] = useState('1')
  const [productCreate, setProductCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [productUpdate, setProductUpdate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [productOptionId, setProductOptionId] = useState('1')
  const [productOptionCreate, setProductOptionCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })

  // Orders
  const [orderId, setOrderId] = useState('1')
  const [orderCreate, setOrderCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [orderUpdate, setOrderUpdate] = useState({
    receiverAddress: '',
    receiverName: '',
    receiverPhone: '',
  })

  // Ordered Products
  const [orderedProductId, setOrderedProductId] = useState('1')
  const [orderedProductCreate, setOrderedProductCreate] = useState({
    orderId: '',
    productOptionId: '',
    quantity: '',
  })
  const [orderedProductQuantity, setOrderedProductQuantity] = useState('1')

  // Delivery Address
  const [deliveryAddressId, setDeliveryAddressId] = useState('1')
  const [deliveryAddressCreate, setDeliveryAddressCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [deliveryAddressUpdate, setDeliveryAddressUpdate] = useState({
    receiverAddress: '',
    receiverName: '',
    receiverPhone: '',
  })

  // Deliveries
  const [deliveryId, setDeliveryId] = useState('1')
  const [deliveryCreate, setDeliveryCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [deliveryUpdate, setDeliveryUpdate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })

  // Categories
  const [categoryId, setCategoryId] = useState('1')
  const [categoryCreate, setCategoryCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [categoryName, setCategoryName] = useState('')

  // Carts
  const [cartId, setCartId] = useState('1')
  const [cartCreate, setCartCreate] = useState({
    categoryId: '',
    name: '',
    brand: '',
    price: '',
  })
  const [cartUpdate, setCartUpdate] = useState({
    receiverAddress: '',
    receiverName: '',
    receiverPhone: '',
  })

  // Search
  const [searchKeyword, setSearchKeyword] = useState('')
  const [searchUserId, setSearchUserId] = useState('')
  const [searchHistoryUserId, setSearchHistoryUserId] = useState('1')

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>API 테스트 페이지</h1>

      {/* Products */}
      <ApiTestSection title="Products API">
        <ApiTestCard
          title="모든 상품 조회"
          method="GET"
          endpoint="/api/v1/products"
          onTest={async () => {
            return await productApi.getAllProducts()
          }}
        >
          <div>모든 상품 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="상품 조회"
          method="GET"
          endpoint="/api/v1/products/{id}"
          onTest={async () => {
            return await productApi.getProduct(Number(productId))
          }}
        >
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="상품 ID"
            style={{ padding: '0.5rem', width: '200px', marginRight: '1rem' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="상품 생성"
          method="POST"
          endpoint="/api/v1/products"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: productCreate.categoryId ? Number(productCreate.categoryId) : undefined,
              name: productCreate.name || undefined,
              brand: productCreate.brand || undefined,
              price: productCreate.price ? Number(productCreate.price) : undefined,
            }
            return await productApi.createProduct(payload)
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={productCreate.categoryId}
              onChange={(e) => setProductCreate({ ...productCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productCreate.name}
              onChange={(e) => setProductCreate({ ...productCreate, name: e.target.value })}
              placeholder="상품명"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productCreate.brand}
              onChange={(e) => setProductCreate({ ...productCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={productCreate.price}
              onChange={(e) => setProductCreate({ ...productCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="상품 수정"
          method="PUT"
          endpoint="/api/v1/products/{id}"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: productUpdate.categoryId ? Number(productUpdate.categoryId) : undefined,
              name: productUpdate.name || undefined,
              brand: productUpdate.brand || undefined,
              price: productUpdate.price ? Number(productUpdate.price) : undefined,
            }
            return await productApi.updateProduct(Number(productId), payload)
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              placeholder="상품 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={productUpdate.categoryId}
              onChange={(e) => setProductUpdate({ ...productUpdate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productUpdate.name}
              onChange={(e) => setProductUpdate({ ...productUpdate, name: e.target.value })}
              placeholder="상품명"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productUpdate.brand}
              onChange={(e) => setProductUpdate({ ...productUpdate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={productUpdate.price}
              onChange={(e) => setProductUpdate({ ...productUpdate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="상품 삭제"
          method="DELETE"
          endpoint="/api/v1/products/{id}"
          onTest={async () => {
            return await productApi.deleteProduct(Number(productId))
          }}
        >
          <input
            type="number"
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            placeholder="상품 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="상품 옵션 추가"
          method="POST"
          endpoint="/api/v1/products/{productId}/options"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: productOptionCreate.categoryId ? Number(productOptionCreate.categoryId) : undefined,
              name: productOptionCreate.name || undefined,
              brand: productOptionCreate.brand || undefined,
              price: productOptionCreate.price ? Number(productOptionCreate.price) : undefined,
            }
            return await productApi.addOption(Number(productOptionId), payload)
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={productOptionId}
              onChange={(e) => setProductOptionId(e.target.value)}
              placeholder="상품 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={productOptionCreate.categoryId}
              onChange={(e) => setProductOptionCreate({ ...productOptionCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productOptionCreate.name}
              onChange={(e) => setProductOptionCreate({ ...productOptionCreate, name: e.target.value })}
              placeholder="옵션명"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={productOptionCreate.brand}
              onChange={(e) => setProductOptionCreate({ ...productOptionCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={productOptionCreate.price}
              onChange={(e) => setProductOptionCreate({ ...productOptionCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="인덱스 재구성"
          method="POST"
          endpoint="/api/v1/products/reindex"
          onTest={async () => {
            return await productApi.rebuildIndex()
          }}
        >
          <div>상품 검색 인덱스를 재구성합니다.</div>
        </ApiTestCard>
      </ApiTestSection>

      {/* Orders */}
      <ApiTestSection title="Orders API">
        <ApiTestCard
          title="모든 주문 조회"
          method="GET"
          endpoint="/api/v1/orders"
          onTest={async () => {
            return await orderApi.getAllOrders()
          }}
        >
          <div>모든 주문 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 조회"
          method="GET"
          endpoint="/api/v1/orders/{id}"
          onTest={async () => {
            return await orderApi.getOrder(Number(orderId))
          }}
        >
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="주문 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="주문 생성"
          method="POST"
          endpoint="/api/v1/orders"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: orderCreate.categoryId ? Number(orderCreate.categoryId) : undefined,
              name: orderCreate.name || undefined,
              brand: orderCreate.brand || undefined,
              price: orderCreate.price ? Number(orderCreate.price) : undefined,
            }
            return await orderApi.createOrder(payload)
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={orderCreate.categoryId}
              onChange={(e) => setOrderCreate({ ...orderCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={orderCreate.name}
              onChange={(e) => setOrderCreate({ ...orderCreate, name: e.target.value })}
              placeholder="이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={orderCreate.brand}
              onChange={(e) => setOrderCreate({ ...orderCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={orderCreate.price}
              onChange={(e) => setOrderCreate({ ...orderCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 수정"
          method="PUT"
          endpoint="/api/v1/orders/{orderId}"
          onTest={async () => {
            const payload: components['schemas']['UpdateReq'] = {
              receiverAddress: orderUpdate.receiverAddress || undefined,
              receiverName: orderUpdate.receiverName || undefined,
              receiverPhone: orderUpdate.receiverPhone || undefined,
            }
            return await orderApi.updateOrder(Number(orderId), payload)
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              placeholder="주문 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              value={orderUpdate.receiverAddress}
              onChange={(e) => setOrderUpdate({ ...orderUpdate, receiverAddress: e.target.value })}
              placeholder="수령인 주소"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={orderUpdate.receiverName}
              onChange={(e) => setOrderUpdate({ ...orderUpdate, receiverName: e.target.value })}
              placeholder="수령인 이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={orderUpdate.receiverPhone}
              onChange={(e) => setOrderUpdate({ ...orderUpdate, receiverPhone: e.target.value })}
              placeholder="수령인 전화번호"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 취소"
          method="POST"
          endpoint="/api/v1/orders/{orderId}/cancel"
          onTest={async () => {
            return await orderApi.cancelOrder(Number(orderId))
          }}
        >
          <input
            type="number"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="주문 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Ordered Products */}
      <ApiTestSection title="Ordered Products API">
        <ApiTestCard
          title="모든 주문 상품 조회"
          method="GET"
          endpoint="/api/v1/ordered-products"
          onTest={async () => {
            const result = await orderedProductApi.getAllOrderedProducts()
            return result
          }}
        >
          <div>모든 주문 상품 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 상품 조회"
          method="GET"
          endpoint="/api/v1/ordered-products/{id}"
          onTest={async () => {
            const result = await orderedProductApi.getOrderedProduct(Number(orderedProductId))
            return result
          }}
        >
          <input
            type="number"
            value={orderedProductId}
            onChange={(e) => setOrderedProductId(e.target.value)}
            placeholder="주문 상품 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="주문 상품 생성"
          method="POST"
          endpoint="/api/v1/ordered-products"
          onTest={async () => {
            const payload: components['schemas']['Request'] = {
              orderId: orderedProductCreate.orderId ? Number(orderedProductCreate.orderId) : undefined,
              productOptionId: orderedProductCreate.productOptionId
                ? Number(orderedProductCreate.productOptionId)
                : undefined,
              quantity: orderedProductCreate.quantity ? Number(orderedProductCreate.quantity) : undefined,
            }
            const result = await orderedProductApi.createOrderedProduct(payload)
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={orderedProductCreate.orderId}
              onChange={(e) => setOrderedProductCreate({ ...orderedProductCreate, orderId: e.target.value })}
              placeholder="주문 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={orderedProductCreate.productOptionId}
              onChange={(e) =>
                setOrderedProductCreate({ ...orderedProductCreate, productOptionId: e.target.value })
              }
              placeholder="상품 옵션 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={orderedProductCreate.quantity}
              onChange={(e) => setOrderedProductCreate({ ...orderedProductCreate, quantity: e.target.value })}
              placeholder="수량"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 상품 수량 수정"
          method="PUT"
          endpoint="/api/v1/ordered-products/{id}/quantity"
          onTest={async () => {
            const result = await orderedProductApi.updateQuantity(
              Number(orderedProductId),
              Number(orderedProductQuantity),
            )
            return result
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              value={orderedProductId}
              onChange={(e) => setOrderedProductId(e.target.value)}
              placeholder="주문 상품 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
            <input
              type="number"
              value={orderedProductQuantity}
              onChange={(e) => setOrderedProductQuantity(e.target.value)}
              placeholder="수량"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="주문 상품 삭제"
          method="DELETE"
          endpoint="/api/v1/ordered-products/{id}"
          onTest={async () => {
            const result = await orderedProductApi.deleteOrderedProduct(Number(orderedProductId))
            return result
          }}
        >
          <input
            type="number"
            value={orderedProductId}
            onChange={(e) => setOrderedProductId(e.target.value)}
            placeholder="주문 상품 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Delivery Address */}
      <ApiTestSection title="Delivery Address API">
        <ApiTestCard
          title="모든 배송지 조회"
          method="GET"
          endpoint="/api/v1/delivery-address"
          onTest={async () => {
            const result = await deliveryAddressApi.getAllDeliveryAddresses()
            return result
          }}
        >
          <div>모든 배송지 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="배송지 조회"
          method="GET"
          endpoint="/api/v1/delivery-address/{id}"
          onTest={async () => {
            const result = await deliveryAddressApi.getDeliveryAddress(Number(deliveryAddressId))
            return result
          }}
        >
          <input
            type="number"
            value={deliveryAddressId}
            onChange={(e) => setDeliveryAddressId(e.target.value)}
            placeholder="배송지 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="배송지 생성"
          method="POST"
          endpoint="/api/v1/delivery-address"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: deliveryAddressCreate.categoryId ? Number(deliveryAddressCreate.categoryId) : undefined,
              name: deliveryAddressCreate.name || undefined,
              brand: deliveryAddressCreate.brand || undefined,
              price: deliveryAddressCreate.price ? Number(deliveryAddressCreate.price) : undefined,
            }
            const result = await deliveryAddressApi.createDeliveryAddress(payload)
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={deliveryAddressCreate.categoryId}
              onChange={(e) => setDeliveryAddressCreate({ ...deliveryAddressCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryAddressCreate.name}
              onChange={(e) => setDeliveryAddressCreate({ ...deliveryAddressCreate, name: e.target.value })}
              placeholder="이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryAddressCreate.brand}
              onChange={(e) => setDeliveryAddressCreate({ ...deliveryAddressCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={deliveryAddressCreate.price}
              onChange={(e) => setDeliveryAddressCreate({ ...deliveryAddressCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="배송지 수정"
          method="PUT"
          endpoint="/api/v1/delivery-address/{id}"
          onTest={async () => {
            const payload: components['schemas']['UpdateReq'] = {
              receiverAddress: deliveryAddressUpdate.receiverAddress || undefined,
              receiverName: deliveryAddressUpdate.receiverName || undefined,
              receiverPhone: deliveryAddressUpdate.receiverPhone || undefined,
            }
            const result = await deliveryAddressApi.updateDeliveryAddress(Number(deliveryAddressId), payload)
            return result
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={deliveryAddressId}
              onChange={(e) => setDeliveryAddressId(e.target.value)}
              placeholder="배송지 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              value={deliveryAddressUpdate.receiverAddress}
              onChange={(e) =>
                setDeliveryAddressUpdate({ ...deliveryAddressUpdate, receiverAddress: e.target.value })
              }
              placeholder="수령인 주소"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryAddressUpdate.receiverName}
              onChange={(e) =>
                setDeliveryAddressUpdate({ ...deliveryAddressUpdate, receiverName: e.target.value })
              }
              placeholder="수령인 이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryAddressUpdate.receiverPhone}
              onChange={(e) =>
                setDeliveryAddressUpdate({ ...deliveryAddressUpdate, receiverPhone: e.target.value })
              }
              placeholder="수령인 전화번호"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="배송지 삭제"
          method="DELETE"
          endpoint="/api/v1/delivery-address/{id}"
          onTest={async () => {
            const result = await deliveryAddressApi.deleteDeliveryAddress(Number(deliveryAddressId))
            return result
          }}
        >
          <input
            type="number"
            value={deliveryAddressId}
            onChange={(e) => setDeliveryAddressId(e.target.value)}
            placeholder="배송지 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Deliveries */}
      <ApiTestSection title="Deliveries API">
        <ApiTestCard
          title="모든 배송 조회"
          method="GET"
          endpoint="/api/v1/deliveries"
          onTest={async () => {
            const result = await deliveryApi.getAllDeliveries()
            return result
          }}
        >
          <div>모든 배송 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="배송 조회"
          method="GET"
          endpoint="/api/v1/deliveries/{id}"
          onTest={async () => {
            const result = await deliveryApi.getDelivery(Number(deliveryId))
            return result
          }}
        >
          <input
            type="number"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
            placeholder="배송 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="배송 생성"
          method="POST"
          endpoint="/api/v1/deliveries"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: deliveryCreate.categoryId ? Number(deliveryCreate.categoryId) : undefined,
              name: deliveryCreate.name || undefined,
              brand: deliveryCreate.brand || undefined,
              price: deliveryCreate.price ? Number(deliveryCreate.price) : undefined,
            }
            const result = await deliveryApi.createDelivery(payload)
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={deliveryCreate.categoryId}
              onChange={(e) => setDeliveryCreate({ ...deliveryCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryCreate.name}
              onChange={(e) => setDeliveryCreate({ ...deliveryCreate, name: e.target.value })}
              placeholder="이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryCreate.brand}
              onChange={(e) => setDeliveryCreate({ ...deliveryCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={deliveryCreate.price}
              onChange={(e) => setDeliveryCreate({ ...deliveryCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="배송 수정"
          method="PUT"
          endpoint="/api/v1/deliveries/{id}"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: deliveryUpdate.categoryId ? Number(deliveryUpdate.categoryId) : undefined,
              name: deliveryUpdate.name || undefined,
              brand: deliveryUpdate.brand || undefined,
              price: deliveryUpdate.price ? Number(deliveryUpdate.price) : undefined,
            }
            const result = await deliveryApi.updateDelivery(Number(deliveryId), payload)
            return result
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={deliveryId}
              onChange={(e) => setDeliveryId(e.target.value)}
              placeholder="배송 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={deliveryUpdate.categoryId}
              onChange={(e) => setDeliveryUpdate({ ...deliveryUpdate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryUpdate.name}
              onChange={(e) => setDeliveryUpdate({ ...deliveryUpdate, name: e.target.value })}
              placeholder="이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={deliveryUpdate.brand}
              onChange={(e) => setDeliveryUpdate({ ...deliveryUpdate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={deliveryUpdate.price}
              onChange={(e) => setDeliveryUpdate({ ...deliveryUpdate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="배송 삭제"
          method="DELETE"
          endpoint="/api/v1/deliveries/{id}"
          onTest={async () => {
            const result = await deliveryApi.deleteDelivery(Number(deliveryId))
            return result
          }}
        >
          <input
            type="number"
            value={deliveryId}
            onChange={(e) => setDeliveryId(e.target.value)}
            placeholder="배송 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Categories */}
      <ApiTestSection title="Categories API">
        <ApiTestCard
          title="모든 카테고리 조회"
          method="GET"
          endpoint="/api/v1/categories"
          onTest={async () => {
            const result = await categoryApi.getAllCategories()
            return result
          }}
        >
          <div>모든 카테고리 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="카테고리 조회"
          method="GET"
          endpoint="/api/v1/categories/{id}"
          onTest={async () => {
            const result = await categoryApi.getCategory(Number(categoryId))
            return result
          }}
        >
          <input
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="카테고리 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="카테고리 생성"
          method="POST"
          endpoint="/api/v1/categories"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: categoryCreate.categoryId ? Number(categoryCreate.categoryId) : undefined,
              name: categoryCreate.name || undefined,
              brand: categoryCreate.brand || undefined,
              price: categoryCreate.price ? Number(categoryCreate.price) : undefined,
            }
            const result = await categoryApi.createCategory(payload)
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={categoryCreate.categoryId}
              onChange={(e) => setCategoryCreate({ ...categoryCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={categoryCreate.name}
              onChange={(e) => setCategoryCreate({ ...categoryCreate, name: e.target.value })}
              placeholder="카테고리명"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={categoryCreate.brand}
              onChange={(e) => setCategoryCreate({ ...categoryCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={categoryCreate.price}
              onChange={(e) => setCategoryCreate({ ...categoryCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="카테고리 수정"
          method="PUT"
          endpoint="/api/v1/categories/{id}"
          onTest={async () => {
            const result = await categoryApi.updateCategory(Number(categoryId), categoryName)
            return result
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="number"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="카테고리명"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="카테고리 삭제"
          method="DELETE"
          endpoint="/api/v1/categories/{id}"
          onTest={async () => {
            const result = await categoryApi.deleteCategory(Number(categoryId))
            return result
          }}
        >
          <input
            type="number"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            placeholder="카테고리 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Carts */}
      <ApiTestSection title="Carts API">
        <ApiTestCard
          title="모든 장바구니 조회"
          method="GET"
          endpoint="/api/v1/carts"
          onTest={async () => {
            const result = await cartApi.getAllCarts()
            return result
          }}
        >
          <div>모든 장바구니 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="장바구니 조회"
          method="GET"
          endpoint="/api/v1/carts/{id}"
          onTest={async () => {
            const result = await cartApi.getCart(Number(cartId))
            return result
          }}
        >
          <input
            type="number"
            value={cartId}
            onChange={(e) => setCartId(e.target.value)}
            placeholder="장바구니 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>

        <ApiTestCard
          title="장바구니 생성"
          method="POST"
          endpoint="/api/v1/carts"
          onTest={async () => {
            const payload: components['schemas']['CreateReq'] = {
              categoryId: cartCreate.categoryId ? Number(cartCreate.categoryId) : undefined,
              name: cartCreate.name || undefined,
              brand: cartCreate.brand || undefined,
              price: cartCreate.price ? Number(cartCreate.price) : undefined,
            }
            const result = await cartApi.createCart(payload)
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="number"
              value={cartCreate.categoryId}
              onChange={(e) => setCartCreate({ ...cartCreate, categoryId: e.target.value })}
              placeholder="카테고리 ID"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={cartCreate.name}
              onChange={(e) => setCartCreate({ ...cartCreate, name: e.target.value })}
              placeholder="이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={cartCreate.brand}
              onChange={(e) => setCartCreate({ ...cartCreate, brand: e.target.value })}
              placeholder="브랜드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={cartCreate.price}
              onChange={(e) => setCartCreate({ ...cartCreate, price: e.target.value })}
              placeholder="가격"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="장바구니 수정"
          method="PUT"
          endpoint="/api/v1/carts/{id}"
          onTest={async () => {
            const payload: components['schemas']['UpdateReq'] = {
              receiverAddress: cartUpdate.receiverAddress || undefined,
              receiverName: cartUpdate.receiverName || undefined,
              receiverPhone: cartUpdate.receiverPhone || undefined,
            }
            const result = await cartApi.updateCart(Number(cartId), payload)
            return result
          }}
        >
          <div style={{ marginBottom: '0.5rem' }}>
            <input
              type="number"
              value={cartId}
              onChange={(e) => setCartId(e.target.value)}
              placeholder="장바구니 ID"
              style={{ padding: '0.5rem', width: '200px' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              value={cartUpdate.receiverAddress}
              onChange={(e) => setCartUpdate({ ...cartUpdate, receiverAddress: e.target.value })}
              placeholder="수령인 주소"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={cartUpdate.receiverName}
              onChange={(e) => setCartUpdate({ ...cartUpdate, receiverName: e.target.value })}
              placeholder="수령인 이름"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="text"
              value={cartUpdate.receiverPhone}
              onChange={(e) => setCartUpdate({ ...cartUpdate, receiverPhone: e.target.value })}
              placeholder="수령인 전화번호"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="장바구니 삭제"
          method="DELETE"
          endpoint="/api/v1/carts/{id}"
          onTest={async () => {
            const result = await cartApi.deleteCart(Number(cartId))
            return result
          }}
        >
          <input
            type="number"
            value={cartId}
            onChange={(e) => setCartId(e.target.value)}
            placeholder="장바구니 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>

      {/* Search */}
      <ApiTestSection title="Search API">
        <ApiTestCard
          title="상품 검색"
          method="GET"
          endpoint="/api/v1/search"
          onTest={async () => {
            const result = await searchApi.search(
              searchKeyword,
              searchUserId ? Number(searchUserId) : undefined,
            )
            return result
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="검색 키워드"
              style={{ padding: '0.5rem' }}
            />
            <input
              type="number"
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              placeholder="사용자 ID (선택사항)"
              style={{ padding: '0.5rem' }}
            />
          </div>
        </ApiTestCard>

        <ApiTestCard
          title="인기 검색어 조회"
          method="GET"
          endpoint="/api/v1/search/trend"
          onTest={async () => {
            const result = await searchApi.getTrendingKeywords()
            return result
          }}
        >
          <div>인기 검색어 목록을 조회합니다.</div>
        </ApiTestCard>

        <ApiTestCard
          title="사용자 검색 기록 조회"
          method="GET"
          endpoint="/api/v1/search/history/{userId}"
          onTest={async () => {
            const result = await searchApi.getUserSearchHistory(Number(searchHistoryUserId))
            return result
          }}
        >
          <input
            type="number"
            value={searchHistoryUserId}
            onChange={(e) => setSearchHistoryUserId(e.target.value)}
            placeholder="사용자 ID"
            style={{ padding: '0.5rem', width: '200px' }}
          />
        </ApiTestCard>
      </ApiTestSection>
    </div>
  )
}

