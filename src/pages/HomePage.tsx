import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">USINSA</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">당신의 스타일을 완성하는 쇼핑몰</p>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              쇼핑하기
            </Link>
            {!user && (
              <Link to="/signup" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                회원가입
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">인기 카테고리</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: '상의', emoji: '👕', color: 'bg-red-100', categoryId: 1 },
              { name: '하의', emoji: '👖', color: 'bg-blue-100', categoryId: 2 },
              { name: '아우터', emoji: '🧥', color: 'bg-green-100', categoryId: 3 },
              { name: '신발', emoji: '👟', color: 'bg-yellow-100', categoryId: 4 },
            ].map((category) => (
              <Link
                key={category.name}
                to={`/products?categoryId=${category.categoryId}`}
                className={`${category.color} rounded-lg p-8 text-center hover:shadow-lg transition-all`}
              >
                <div className="text-5xl mb-3">{category.emoji}</div>
                <div className="font-semibold text-lg">{category.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">왜 USINSA인가요?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">🚚</div>
              <h3 className="text-xl font-bold mb-3">빠른 배송</h3>
              <p className="text-gray-600">주문 후 1-2일 이내 배송으로 빠르게 받아보세요</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">💯</div>
              <h3 className="text-xl font-bold mb-3">품질 보증</h3>
              <p className="text-gray-600">엄선된 브랜드의 정품만을 취급합니다</p>
            </div>
            <div className="bg-white rounded-lg p-8 text-center shadow-sm">
              <div className="text-5xl mb-4">🔄</div>
              <h3 className="text-xl font-bold mb-3">간편한 반품</h3>
              <p className="text-gray-600">30일 이내 무료 반품 및 교환 서비스</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">지금 시작하세요</h2>
          <p className="text-xl mb-8 text-blue-100">회원가입하고 다양한 혜택을 받아보세요</p>
          <div className="flex gap-4 justify-center">
            <Link to="/products" className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors">
              상품 둘러보기
            </Link>
            {!user && (
              <Link to="/signup" className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                회원가입하기
              </Link>
            )}
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold text-white mb-4">USINSA</div>
              <p className="text-sm">당신의 스타일을 완성하는 쇼핑몰</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">쇼핑</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/products" className="hover:text-white">전체 상품</Link></li>
                <li><Link to="/search" className="hover:text-white">검색</Link></li>
                <li><Link to="/cart" className="hover:text-white">장바구니</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">고객지원</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">배송 정보</a></li>
                <li><a href="#" className="hover:text-white">반품/교환</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">회사 정보</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">회사 소개</a></li>
                <li><a href="#" className="hover:text-white">이용약관</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2026 USINSA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
