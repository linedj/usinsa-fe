import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { productApi } from '@/api/productApi'
import { cartApi } from '@/api/cartApi'
import type { ProductResponse, ProductOptionResponse } from '@/api/types'
import { useAuth } from '@/auth/useAuth'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedOption, setSelectedOption] = useState<ProductOptionResponse | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [likePending, setLikePending] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (id) {
      loadProduct(Number(id))
    }
  }, [id])

  useEffect(() => {
    if (id && user?.memberId) {
      loadLikeStatus(Number(id), user.memberId)
    }
  }, [id, user?.memberId])

  const loadProduct = async (productId: number) => {
    try {
      setLoading(true)
      const data = await productApi.getProduct(productId)
      setProduct(data)
      setLikeCount(data.likeCount || 0)
    } catch (err) {
      setError(err instanceof Error ? err.message : '상품 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const loadLikeStatus = async (productId: number, memberId: number) => {
    try {
      const status = await productApi.getLikeStatus(productId, memberId)
      setIsLiked(status.liked || false)
    } catch (err) {
      console.error('좋아요 상태 조회 실패:', err)
    }
  }

  const handleToggleLike = async () => {
    if (!user?.memberId) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    if (!product) return

    try {
      setLikePending(true)
      
      if (isLiked) {
        const response = await productApi.removeLike(product.id, user.memberId)
        setIsLiked(false)
        setLikeCount(response.likeCount)
      } else {
        const response = await productApi.addLike(product.id, user.memberId)
        setIsLiked(true)
        setLikeCount(response.likeCount)
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '좋아요 처리에 실패했습니다.')
    } finally {
      setLikePending(false)
    }
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!selectedOption) {
      alert('옵션을 선택해주세요.')
      return
    }

    if (selectedOption.stock < quantity) {
      alert('재고가 부족합니다.')
      return
    }

    try {
      setAddingToCart(true)
      
      if (user?.memberId) {
        await cartApi.createCart({
          memberId: user.memberId,
          productOptionId: selectedOption.id,
          count: quantity,
        })
      } else {
        await cartApi.createGuestCart({
          productOptionId: selectedOption.id,
          count: quantity,
        })
      }
      
      if (confirm('장바구니에 추가되었습니다.\n장바구니로 이동하시겠습니까?')) {
        navigate('/cart')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : '장바구니 추가에 실패했습니다.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product) return

    if (!user) {
      alert('로그인이 필요합니다.')
      navigate('/login')
      return
    }

    if (!selectedOption) {
      alert('옵션을 선택해주세요.')
      return
    }

    if (selectedOption.stock < quantity) {
      alert('재고가 부족합니다.')
      return
    }

    try {
      setAddingToCart(true)
      
      await cartApi.createCart({
        memberId: user.memberId!,
        productOptionId: selectedOption.id,
        count: quantity,
      })
      
      navigate('/checkout')
    } catch (err) {
      alert(err instanceof Error ? err.message : '구매 진행에 실패했습니다.')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (!selectedOption) return
    const maxQuantity = selectedOption.stock
    setQuantity(Math.max(1, Math.min(newQuantity, maxQuantity)))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="text-6xl mb-4">😞</div>
        <div className="text-xl text-red-600 mb-4">{error || '상품을 찾을 수 없습니다.'}</div>
        <button
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          상품 목록으로 돌아가기
        </button>
      </div>
    )
  }

  const hasOptions = product.options && product.options.length > 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* 상품 이미지 */}
          <div className="sticky top-4">
            <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 text-xl">이미지 없음</span>
            </div>
            
            {/* 썸네일 이미지 */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg"></div>
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="flex flex-col">
            <div className="text-sm text-blue-600 font-semibold mb-2">{product.brandName}</div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-3">{product.name}</h1>
            <div className="text-sm text-gray-600 mb-6">{product.categoryName}</div>
            
            <div className="text-4xl font-bold text-blue-600 mb-6">
              {product.price?.toLocaleString()}원
            </div>
            
            <div className="flex gap-6 mb-8 pb-8 border-b">
              <div className="flex items-center gap-2">
                <span className="text-red-500">❤️</span>
                <span className="text-sm text-gray-600">좋아요 {likeCount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👁️</span>
                <span className="text-sm text-gray-600">조회수 {product.clickCount || 0}</span>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              {/* 옵션 선택 - 드롭다운 */}
              {hasOptions && (
                <div>
                  <label className="block font-semibold mb-3 text-lg">옵션 선택</label>
                  <select
                    value={selectedOption?.id || ''}
                    onChange={(e) => {
                      const option = product.options!.find(opt => opt.id === Number(e.target.value))
                      setSelectedOption(option || null)
                      setQuantity(1) // 옵션 변경 시 수량 초기화
                    }}
                    className="w-full h-14 px-4 border-2 border-gray-300 rounded-lg text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem'
                    }}
                  >
                    <option value="">옵션을 선택해주세요</option>
                    {product.options!.map((option) => (
                      <option 
                        key={option.id} 
                        value={option.id}
                        disabled={option.stock === 0}
                      >
                        {option.optionName} {option.stock === 0 ? '(품절)' : `(재고 ${option.stock}개)`}
                      </option>
                    ))}
                  </select>
                  {selectedOption && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{selectedOption.optionName}</div>
                          <div className="text-sm text-gray-600 mt-1">재고 {selectedOption.stock}개</div>
                        </div>
                        <button
                          onClick={() => setSelectedOption(null)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                          title="선택 취소"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 수량 선택 */}
              <div>
                <label className="block font-semibold mb-3 text-lg">수량</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1 || !selectedOption}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xl"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(Number(e.target.value))}
                    disabled={!selectedOption}
                    className="w-20 h-12 text-center border-2 border-gray-300 rounded-lg text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    min="1"
                    max={selectedOption?.stock || 1}
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={!selectedOption || quantity >= (selectedOption?.stock || 0)}
                    className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-xl"
                  >
                    +
                  </button>
                </div>
                {selectedOption && (
                  <div className="text-sm text-gray-600 mt-2">
                    최대 {selectedOption.stock}개까지 구매 가능합니다.
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송비</span>
                    <span className="font-semibold text-green-600">무료배송</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">배송 예정</span>
                    <span className="font-semibold">평균 1-2일 소요</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">총 상품금액</span>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      {product.price?.toLocaleString()}원 x {quantity}개
                    </div>
                    <div className="text-3xl font-bold text-blue-600">
                      {((product.price || 0) * quantity).toLocaleString()}원
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {addingToCart ? '처리 중...' : '바로 구매'}
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="py-4 border-2 border-blue-600 text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  장바구니
                </button>
                <button
                  onClick={handleToggleLike}
                  disabled={likePending}
                  className={`py-4 border-2 rounded-lg text-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isLiked
                      ? 'border-red-500 text-red-500 bg-red-50 hover:bg-red-100'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {isLiked ? '❤️ 찜했음' : '🤍 찜하기'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">상품 상세 정보</h2>
            
            <div className="bg-gray-50 rounded-lg p-8 mb-8">
              <h3 className="text-xl font-bold mb-4">상품 설명</h3>
              <div className="prose max-w-none text-gray-700 leading-relaxed">
                <p className="mb-4">
                  이 상품은 {product.brandName}의 {product.name}입니다.
                </p>
                <p className="mb-4">
                  고품질의 소재와 세련된 디자인으로 제작되었으며, 
                  일상적인 착용부터 특별한 날까지 다양한 상황에서 활용할 수 있습니다.
                </p>
                <p>
                  {product.categoryName} 카테고리에 속하는 이 제품은 
                  뛰어난 품질과 합리적인 가격으로 많은 고객님들의 사랑을 받고 있습니다.
                </p>
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">상품 정보</h3>
              <div className="space-y-2 text-sm">
                <div className="flex border-b pb-2">
                  <span className="w-32 text-gray-600">브랜드</span>
                  <span className="flex-1 font-medium">{product.brandName}</span>
                </div>
                <div className="flex border-b pb-2">
                  <span className="w-32 text-gray-600">카테고리</span>
                  <span className="flex-1 font-medium">{product.categoryName}</span>
                </div>
                {hasOptions && (
                  <div className="flex border-b pb-2">
                    <span className="w-32 text-gray-600">옵션</span>
                    <span className="flex-1 font-medium">
                      {product.options!.map(opt => opt.optionName).join(', ')}
                    </span>
                  </div>
                )}
                <div className="flex border-b pb-2">
                  <span className="w-32 text-gray-600">원산지</span>
                  <span className="flex-1 font-medium">상품 상세 참조</span>
                </div>
                <div className="flex border-b pb-2">
                  <span className="w-32 text-gray-600">제조사</span>
                  <span className="flex-1 font-medium">{product.brandName}</span>
                </div>
                <div className="flex">
                  <span className="w-32 text-gray-600">품질보증</span>
                  <span className="flex-1 font-medium">구매일로부터 1년</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
