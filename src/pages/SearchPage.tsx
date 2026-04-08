import { useState, useEffect } from 'react'
import { searchApi } from '@/api/searchApi'
import type { ProductSearchDto } from '@/api/types'
import { useAuth } from '@/auth/useAuth'
import { useNavigate } from 'react-router-dom'

export default function SearchPage() {
  const [keyword, setKeyword] = useState('')
  const [searchResults, setSearchResults] = useState<ProductSearchDto[]>([])
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
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
      setError(null)
      const data = await searchApi.searchProducts(finalKeyword, user?.memberId)
      setSearchResults(data)
      setKeyword(finalKeyword)
    } catch (err) {
      setError(err instanceof Error ? err.message : '검색에 실패했습니다.')
    } finally {
      setLoading(false)
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
              placeholder="상품을 검색해보세요"
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
            <div className="text-xl">검색 중...</div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-12">
            <div className="text-xl text-red-600">{error}</div>
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
                  onClick={() => handleProductClick(product.id!)}
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

                    <div className="flex gap-2 text-sm text-gray-600">
                      <span>좋아요 {product.likeCount}</span>
                      <span>조회수 {product.clickCount}</span>
                    </div>
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
