import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { cartApi } from '@/api/cartApi'
import { categoryApi, getCategoryDisplayName } from '@/api/categoryApi'
import type { ProductResponse, CategoryResponse } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function ProductListPage() {
  const [products, setProducts] = useState<ProductResponse[]>([])
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId')

  useEffect(() => {
    categoryApi.getAllCategories().then(setCategories).catch(() => setCategories([]))
  }, [])

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

  const activeCategoryName = categoryId
    ? categories.find((c) => String(c.id) === categoryId)
    : null

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-graphite">로딩 중...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-sm text-signal">{error}</div>
      </div>
    )
  }

  return (
    <div className="max-w-content mx-auto px-4 md:px-8 py-10">
      {/* 헤더 */}
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tightest mb-2">
          {activeCategoryName ? getCategoryDisplayName(activeCategoryName) : '전체 상품'}
        </h1>
        <p className="text-sm text-graphite">총 {products.length}개의 상품</p>
      </div>

      {/* 카테고리 필터 - usinsa-be 카테고리 목록을 칩 형태로 노출 */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-line">
          <Link
            to="/products"
            className={`px-4 py-2 text-sm font-medium border transition-colors ${
              !categoryId
                ? 'bg-ink text-paper border-ink'
                : 'border-line text-graphite hover:border-ink hover:text-ink'
            }`}
          >
            전체
          </Link>
          {categories.map((category) => {
            const isActive = categoryId === String(category.id)
            return (
              <Link
                key={category.id}
                to={`/products?categoryId=${category.id}`}
                className={`px-4 py-2 text-sm font-medium border transition-colors ${
                  isActive
                    ? 'bg-ink text-paper border-ink'
                    : 'border-line text-graphite hover:border-ink hover:text-ink'
                }`}
              >
                {getCategoryDisplayName(category)}
              </Link>
            )
          })}
        </div>
      )}

      {/* 상품 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10 md:gap-x-6">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => handleProductClick(product.id)}
            className="cursor-pointer group"
          >
            {/* 상품 이미지 */}
            <div className="relative aspect-square bg-mist overflow-hidden mb-3">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-graphite text-xs">이미지 없음</span>
              </div>

              {/* 호버 시 장바구니 버튼 */}
              <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                <button
                  onClick={(e) => handleAddToCart(e, product.id)}
                  className="w-full bg-ink text-paper py-2.5 text-xs font-semibold hover:opacity-85 transition-opacity"
                >
                  장바구니 담기
                </button>
              </div>
            </div>

            {/* 상품 정보 */}
            <div className="text-xs text-graphite mb-1 truncate">{product.brandName}</div>
            <h3 className="font-medium mb-2 line-clamp-2 text-sm min-h-[2.5rem]">
              {product.name}
            </h3>
            <div className="text-base font-bold mb-2">{product.price?.toLocaleString()}원</div>
            <div className="flex gap-3 text-xs text-graphite">
              <span>좋아요 {product.likeCount || 0}</span>
              <span>조회 {product.clickCount || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* 상품 없음 */}
      {products.length === 0 && (
        <div className="text-center py-24 border border-line">
          <p className="text-graphite text-sm">등록된 상품이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
