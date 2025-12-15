import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export default function Navigation() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors">
            USINSA
          </Link>

          {/* 메뉴 */}
          <div className="flex items-center gap-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              상품
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              검색
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-blue-600 transition-colors font-medium relative">
              장바구니
            </Link>

            {user ? (
              <>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  주문내역
                </Link>
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                  내정보
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 font-medium">
                    {user.nickname || user.name || user.email}님
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  로그인
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  회원가입
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
