import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { categoryApi, getCategoryDisplayName } from '@/api/categoryApi'
import type { CategoryResponse } from '@/api/types'

export default function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [categoriesError, setCategoriesError] = useState(false)
  const [keyword, setKeyword] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    let cancelled = false
    categoryApi
      .getAllCategories()
      .then((data) => {
        if (!cancelled) setCategories(data)
      })
      .catch(() => {
        if (!cancelled) setCategoriesError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const activeCategoryId = new URLSearchParams(location.search).get('categoryId')
  const onProductList = location.pathname === '/products'

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = keyword.trim()
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search')
  }

  return (
    <header className="sticky top-0 z-50 bg-paper border-b border-line">
      {/* 메인 바 */}
      <div className="max-w-content mx-auto px-4 md:px-8">
        <div className="flex items-center gap-6 h-16">
          <Link
            to="/"
            className="text-2xl font-black tracking-tightest text-ink shrink-0"
          >
            USINSA
          </Link>

          {/* 검색 */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden sm:block">
            <div className="flex items-center border border-line focus-within:border-ink transition-colors">
              <input
                ref={searchInputRef}
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="상품, 브랜드 검색"
                className="w-full px-3 py-2 text-sm outline-none bg-transparent placeholder:text-graphite"
              />
              <button
                type="submit"
                aria-label="검색"
                className="bg-transparent px-3 py-2 text-graphite hover:text-ink transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="7" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </form>

          <nav className="flex items-center gap-5 ml-auto text-sm">
            <Link
              to="/search"
              className="text-ink hover:text-graphite transition-colors sm:hidden"
              aria-label="검색"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </Link>

            <Link to="/cart" className="text-ink hover:text-graphite transition-colors font-medium">
              장바구니
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="hidden md:inline text-ink hover:text-graphite transition-colors font-medium">
                  주문내역
                </Link>
                <Link to="/dashboard" className="hidden md:inline text-ink hover:text-graphite transition-colors font-medium">
                  {user.nickname || user.name || '내정보'}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-transparent text-graphite hover:text-ink transition-colors font-medium"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-ink hover:text-graphite transition-colors font-medium">
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="bg-ink text-paper px-3 py-1.5 hover:opacity-80 transition-opacity font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* 카테고리 바 - usinsa-be에서 가져온 실제 카테고리 목록 */}
      {!categoriesError && categories.length > 0 && (
        <div className="border-t border-line">
          <div className="max-w-content mx-auto px-4 md:px-8">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar h-11">
              <Link
                to="/products"
                className={`shrink-0 px-3 h-11 flex items-center text-sm font-medium border-b-2 transition-colors ${onProductList && !activeCategoryId
                  ? 'border-ink text-ink'
                  : 'border-transparent text-graphite hover:text-ink'
                  }`}
              >
                전체
              </Link>
              {categories.map((category) => {
                const isActive = onProductList && activeCategoryId === String(category.id)
                return (
                  <Link
                    key={category.id}
                    to={`/products?categoryId=${category.id}`}
                    className={`shrink-0 px-3 h-11 flex items-center text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${isActive
                      ? 'border-ink text-ink'
                      : 'border-transparent text-graphite hover:text-ink'
                      }`}
                  >
                    {getCategoryDisplayName(category)}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
