import { useState, useEffect } from 'react'
import { searchApi } from '@/api/searchApi'
import type { ProductSearchDto, RankedProductDto } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useNavigate } from 'react-router-dom'

// 키워드 검색(ProductSearchDto)과 RAG 검색(RankedProductDto) 결과를
// 화면에서는 같은 카드 형태로 보여주기 위한 공통 타입
type DisplayProduct = {
  id: number
  name: string
  brandName: string
  categoryName: string
  price: number
  likeCount?: number
  clickCount?: number
}

function fromProductSearchDto(p: ProductSearchDto): DisplayProduct {
  return { ...p }
}

function fromRankedProductDto(p: RankedProductDto): DisplayProduct {
  return {
    id: p.productId,
    name: p.name,
    brandName: p.brandName,
    categoryName: p.categoryName,
    price: p.price,
  }
}


export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<DisplayProduct[]>([])
  const [ragMessage, setRagMessage] = useState<string | null>(null)
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  // 키워드 검색이 0건이라 RAG로 자동 폴백 중인지 여부 (로딩 문구 구분용)
  const [isFallback, setIsFallback] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadTrendingKeywords()
    if (user?.memberId) {
      loadRecentSearches()
    }
  }, [user])

  const loadTrendingKeywords = async () => {
    try {
      const data = await searchApi.getTrendingKeywords()
      setTrendingKeywords(data)
    } catch (err) {
      console.error('인기 검색어 로딩 실패:', err)
    }
  }

  const loadRecentSearches = async () => {
    if (!user?.memberId) return
    try {
      const data = await searchApi.getUserSearchHistory(user.memberId)
      setRecentSearches(data)
    } catch (err) {
      console.error('최근 검색어 로딩 실패:', err)
    }
  }

  const handleSearch = async (searchKeyword?: string) => {
    const finalKeyword = searchKeyword || keyword
    if (!finalKeyword.trim()) {
      alert('검색어를 입력해주세요.')
      return
    }

    try {
      setLoading(true)
      setIsFallback(false)
      setError(null)
      setRagMessage(null)

      // 1) 키워드 검색을 먼저 시도한다 (빠르고, Gemini 비용도 안 든다)
      const keywordResults = await searchApi.searchProducts(finalKeyword, user?.memberId)

      if (keywordResults.length > 0) {
        setSearchResults(keywordResults.map(fromProductSearchDto))
      } else {
        // 2) 결과가 0건이면 붙여쓰기/오타/문장형 검색어일 수 있으니 RAG로 자동 폴백한다
        setIsFallback(true)
        const ragData = await searchApi.getRagRecommendation(finalKeyword)
        setRagMessage(ragData.message)
        setSearchResults(ragData.products.map(fromRankedProductDto))
      }

      setKeyword(finalKeyword)
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.')
    } finally {
      setLoading(false)
      setIsFallback(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleProductClick = (productId: number) => {
    navigate(`/products/${productId}`)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* 검색 입력 */}
        <div className="mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="상품명을 검색해보세요 (오타나 붙여쓰기도 괜찮아요)"
              className="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              검색
            </button>
          </div>
        </div>

        {/* 인기 검색어 */}
        {!loading && searchResults.length === 0 && (
          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-5">🔥 인기 검색어</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {trendingKeywords.map((kw, index) => {
                const isTop3 = index < 3

                return (
                  <button
                    key={index}
                    onClick={() => handleSearch(kw)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg border
                      transition-all duration-200
                      ${isTop3
                        ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                        : 'bg-white hover:bg-gray-50'}
                    `}
                  >
                    {/* 왼쪽: 순위 + 키워드 */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                          w-7 h-7 flex items-center justify-center rounded-full text-sm font-bold
                          ${isTop3
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700'}
                        `}
                      >
                        {index + 1}
                      </span>

                      <span className="font-medium text-gray-800">
                        {kw}
                      </span>
                    </div>

                    {/* 오른쪽: Top 뱃지 */}
                    {isTop3 && (
                      <span className="text-xs font-bold text-blue-600">
                        TOP
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
        {/* 최근 검색어 */}
        {!loading && searchResults.length === 0 && user && recentSearches.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">최근 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-4 py-2 border rounded-full hover:bg-gray-50 transition-colors"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-12">
            <div className="text-xl">
              {isFallback ? '다른 방식으로 다시 찾는 중...' : '검색 중...'}
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-12">
            <div className="text-xl text-red-600">{error}</div>
          </div>
        )}

        {/* RAG(AI) 추천 문구 */}
        {!loading && ragMessage && (
          <div className="mb-6 p-4 rounded-lg bg-indigo-50 border border-indigo-200">
            <div className="text-sm font-bold text-indigo-600 mb-1">✨ AI 추천</div>
            <p className="text-gray-800 whitespace-pre-line">{ragMessage}</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!loading && searchResults.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-4">
              검색 결과 ({searchResults.length}개)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">이미지 없음</span>
                  </div>

                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-1">{product.brandName}</div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
                    <div className="text-sm text-gray-600 mb-2">{product.categoryName}</div>
                    <div className="text-xl font-bold mb-2">{product.price?.toLocaleString()}원</div>

                    {/* RAG 결과는 좋아요/조회수 데이터가 없으므로 있을 때만 표시 */}
                    {(product.likeCount !== undefined || product.clickCount !== undefined) && (
                      <div className="flex gap-2 text-sm text-gray-600">
                        <span>좋아요 {product.likeCount ?? 0}</span>
                        <span>조회수 {product.clickCount ?? 0}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {!loading && keyword && searchResults.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-xl">'{keyword}'에 대한 검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
