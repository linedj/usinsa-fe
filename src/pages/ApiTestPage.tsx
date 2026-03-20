import { useState } from 'react'
import { productApi } from '@/api/productApi'
import { cartApi } from '@/api/cartApi'
import { orderApi } from '@/api/orderApi'
import { searchApi } from '@/api/searchApi'

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const runTest = async (testFn: () => Promise<void>) => {
    try {
      setLoading(true)
      setResult('테스트 실행 중...')
      await testFn()
      setResult('테스트 성공!')
    } catch (error) {
      setResult(`테스트 실패: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API 테스트</h1>

        <div className="space-y-6">
          {/* Product API Tests */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Product API</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  runTest(async () => {
                    const products = await productApi.getAllProducts()
                    setResult(`상품 ${products.length}개 조회 성공`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                전체 상품 조회
              </button>

              <button
                onClick={() =>
                  runTest(async () => {
                    const product = await productApi.createProduct({
                      categoryId: 1,
                      name: '테스트 상품',
                      brand: '테스트 브랜드',
                      price: 10000,
                    })
                    setResult(`상품 생성 성공: ID ${product.id}`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                상품 생성
              </button>
            </div>
          </div>

          {/* Cart API Tests */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Cart API</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  runTest(async () => {
                    const carts = await cartApi.getGuestCarts()
                    setResult(`비회원 장바구니 ${carts.length}개 조회 성공`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                비회원 장바구니 조회
              </button>

              <button
                onClick={() =>
                  runTest(async () => {
                    const cart = await cartApi.createGuestCart({
                      productOptionId: 1,
                      count: 1,
                    })
                    setResult(`비회원 장바구니 추가 성공: ID ${cart.id}`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                비회원 장바구니 추가
              </button>
            </div>
          </div>

          {/* Order API Tests */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Order API</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  runTest(async () => {
                    const orders = await orderApi.getAllOrders()
                    setResult(`주문 ${orders.length}개 조회 성공`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                전체 주문 조회
              </button>

              <button
                onClick={() =>
                  runTest(async () => {
                    const order = await orderApi.createOrder({
                      memberId: 1,
                      receiverName: '테스트',
                      receiverPhone: '010-1234-5678',
                      receiverAddress: '테스트 주소',
                    })
                    setResult(`주문 생성 성공: ID ${order.id}`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
              >
                주문 생성
              </button>
            </div>
          </div>

          {/* Search API Tests */}
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Search API</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() =>
                  runTest(async () => {
                    const results = await searchApi.searchProducts('테스트')
                    setResult(`검색 결과 ${results.length}개 조회 성공`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                상품 검색
              </button>

              <button
                onClick={() =>
                  runTest(async () => {
                    const keywords = await searchApi.getTrendingKeywords()
                    setResult(`인기 검색어 ${keywords.length}개 조회 성공`)
                  })
                }
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
              >
                인기 검색어 조회
              </button>
            </div>
          </div>

          {/* Result Display */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-xl font-bold mb-4">테스트 결과</h2>
            <pre className="whitespace-pre-wrap font-mono text-sm">{result || '테스트를 실행하세요'}</pre>
          </div>
        </div>
      </div>
    </div>
  )
}
