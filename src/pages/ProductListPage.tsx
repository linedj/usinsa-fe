import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { cartApi } from '@/api/cartApi'
import type { ProductResponse } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
    loadProducts()
  }, [categoryId])

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = categoryId
        ? await productApi.getProductsByCategory(Number(categoryId))
        : await productApi.getAllProducts()
      setProducts(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : '상품 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  const handleAddToCart = async (e: React.MouseEvent, productId: number) => {
    e.stopPropagation()

    try {
      // 실제로는 상품 옵션을 선택해야 하지만 여기서는 간단하게 처리
      if (user?.memberId) {
        await cartApi.createCart({
          memberId: user.memberId,
          productOptionId: productId,
          count: 1,
        })
      } else {
        await cartApi.createGuestCart({
          productOptionId: productId,
          count: 1,
        })
      }

      if (confirm('장바구니에 추가되었습니다. 장바구니로 이동하시겠습니까?')) {
        navigate('/cart')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '장바구니 추가에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">전체 상품</h1>
        <p className="text-gray-600">총 {products.length}개의 상품</p>
      </div>

      {/* 필터 및 정렬 (향후 추가 가능) */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-2">
          {/* 카테고리 필터 버튼들 추가 가능 */}
        </div>
        <div>
          {/* 정렬 옵션 추가 가능 */}
        </div>
      </div>

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="border rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
          >
            {/* 상품 이미지 */}
            <div className="relative aspect-square bg-gray-200 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-400">이미지 없음</span>
              </div>

              {/* 호버 시 장바구니 버튼 */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="w-full bg-white text-gray-800 py-2 rounded text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  🛒 담기
                </button>
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="p-4">
              <div className="text-xs text-gray-500 mb-1 truncate">{product.brandName}</div>
              <h3 className="font-semibold mb-2 line-clamp-2 text-sm md:text-base min-h-[2.5rem]">
                {product.name}
              </h3>

              {/* 가격 */}
              <div className="mb-3">
                <div className="text-lg md:text-xl font-bold">{product.price?.toLocaleString()}원</div>
              </div>

              {/* 통계 정보 */}
              <div className="flex gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  ❤️ {product.likeCount || 0}
                </span>
                <span className="flex items-center gap-1">
                  👁️ {product.clickCount || 0}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 상품 없음 */}
      {products.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-500 text-xl">등록된 상품이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
