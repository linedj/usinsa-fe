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
    <div className="max-w-content mx-auto px-4 md:px-8 py-10">
      <div className="max-w-4xl mx-auto">
        {/* 검색 입력 */}
        <div className="mb-10">
          <div className="flex border border-line focus-within:border-ink transition-colors">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="상품명을 검색해보세요 (오타나 붙여쓰기도 괜찮아요)"
              className="flex-1 px-4 py-3 text-sm outline-none bg-transparent"
            />
            <button
              onClick={() => handleSearch()}
              className="px-6 py-3 bg-ink text-paper text-sm font-semibold hover:opacity-85 transition-opacity"
            >
              검색
            </button>
          </div>
        </div>

        {/* 인기 검색어 */}
        {!loading && searchResults.length === 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-black tracking-tightest mb-5">인기 검색어</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {trendingKeywords.map((kw, index) => {
                const isTop3 = index < 3

                return (
                  <button
                    key={index}
                    onClick={() => handleSearch(kw)}
                    className={`
                      flex items-center justify-between px-4 py-3 bg-paper border transition-colors
                      ${isTop3
                        ? 'border-ink'
                        : 'border-line hover:border-ink'}
                    `}
                  >
                    {/* 왼쪽: 순위 + 키워드 */}
                    <div className="flex items-center gap-3">
                      <span
                        className={`
                          w-6 h-6 flex items-center justify-center text-xs font-bold shrink-0
                          ${isTop3
                            ? 'bg-ink text-paper'
                            : 'bg-mist text-graphite'}
                        `}
                      >
                        {index + 1}
                      </span>

                      <span className="font-medium text-sm text-ink">
                        {kw}
                      </span>
                    </div>

                    {/* 오른쪽: Top 뱃지 */}
                    {isTop3 && (
                      <span className="text-[10px] font-bold text-signal uppercase tracking-wide shrink-0">
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
          <div className="mb-10">
            <h2 className="text-lg font-bold mb-4">최근 검색어</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="px-4 py-2 bg-paper border border-line hover:border-ink transition-colors text-sm text-ink"
                >
                  {search}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 로딩 */}
        {loading && (
          <div className="text-center py-16">
            <div className="text-sm text-graphite">
              {isFallback ? '다른 방식으로 다시 찾는 중...' : '검색 중...'}
            </div>
          </div>
        )}

        {/* 에러 */}
        {error && (
          <div className="text-center py-16">
            <div className="text-sm text-signal">{error}</div>
          </div>
        )}

        {/* RAG(AI) 추천 문구 */}
        {!loading && ragMessage && (
          <div className="mb-6 p-4 border border-ink">
            <div className="text-xs font-bold uppercase tracking-widest mb-1">AI 추천</div>
            <p className="text-sm text-graphite whitespace-pre-line">{ragMessage}</p>
          </div>
        )}

        {/* 검색 결과 */}
        {!loading && searchResults.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">
              검색 결과 ({searchResults.length}개)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product.id)}
                  className="cursor-pointer group"
                >
                  <div className="aspect-square bg-mist flex items-center justify-center mb-3">
                    <span className="text-graphite text-xs">이미지 없음</span>
                  </div>

                  <div className="text-xs text-graphite mb-1">{product.brandName}</div>
                  <h3 className="text-sm font-medium mb-2 line-clamp-2">{product.name}</h3>
                  <div className="text-xs text-graphite mb-2">{product.categoryName}</div>
                  <div className="text-base font-bold mb-2">{product.price?.toLocaleString()}원</div>

                  {/* RAG 결과는 좋아요/조회수 데이터가 없으므로 있을 때만 표시 */}
                  {(product.likeCount !== undefined || product.clickCount !== undefined) && (
                    <div className="flex gap-3 text-xs text-graphite">
                      <span>좋아요 {product.likeCount ?? 0}</span>
                      <span>조회수 {product.clickCount ?? 0}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검색 결과 없음 */}
        {!loading && keyword && searchResults.length === 0 && !error && (
          <div className="text-center py-16">
            <p className="text-graphite text-sm">'{keyword}'에 대한 검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
