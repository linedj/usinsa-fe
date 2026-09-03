import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'
import { productApi } from '@/api/productApi'
import type { ProductResponse } from '@/api/types'

export default function HomePage() {
  const { user } = useAuth()
  const [picks, setPicks] = useState<ProductResponse[]>([])

  useEffect(() => {
    productApi
      .getAllProducts()
      .then((data) => setPicks(data.slice(0, 5)))
      .catch(() => setPicks([]))
  }, [])

  return (
    <div>
      {/* 히어로 - 큰 여백과 절제된 타이포로 무신사st 미니멀 톤 */}
      <section className="border-b border-line">
        <div className="max-w-content mx-auto px-4 md:px-8 py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-widest text-graphite mb-5">
            2026 Fall / Winter
          </p>
          <h1 className="text-5xl md:text-7xl font-black tracking-tightest leading-[0.95] mb-8 max-w-3xl">
            스타일은 취향이고,
            <br />
            쇼핑은 USINSA다.
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="bg-ink text-paper px-7 py-3.5 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              전체 상품 보기
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="border border-ink px-7 py-3.5 text-sm font-semibold hover:bg-ink hover:text-paper transition-colors"
              >
                회원가입
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 추천 상품 - 카테고리 선택은 상단 네비게이션 바에서 처리하므로
          메인 화면은 실제 상품 위주로 구성한다 */}
      {picks.length > 0 && (
        <section className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-20">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-black tracking-tightest">지금 인기있는 상품</h2>
            <Link to="/products" className="text-sm font-medium text-graphite hover:text-ink transition-colors">
              전체 보기 →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {picks.map((product) => (
              <Link key={product.id} to={`/products/${product.id}`} className="group">
                <div className="aspect-square bg-mist mb-3 flex items-center justify-center overflow-hidden">
                  <span className="text-graphite text-xs">이미지 없음</span>
                </div>
                <div className="text-xs text-graphite mb-1 truncate">{product.brandName}</div>
                <div className="text-sm font-medium mb-1 line-clamp-2 group-hover:text-graphite transition-colors">
                  {product.name}
                </div>
                <div className="text-sm font-bold">{product.price?.toLocaleString()}원</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 왜 USINSA인가 */}
      <section className="bg-mist border-t border-line">
        <div className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-black tracking-tightest mb-12">왜 USINSA인가요</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <div className="text-xs font-mono text-graphite mb-3">01</div>
              <h3 className="text-lg font-bold mb-2">빠른 배송</h3>
              <p className="text-sm text-graphite leading-relaxed">주문 후 1-2일 이내 배송으로 빠르게 받아보세요.</p>
            </div>
            <div>
              <div className="text-xs font-mono text-graphite mb-3">02</div>
              <h3 className="text-lg font-bold mb-2">품질 보증</h3>
              <p className="text-sm text-graphite leading-relaxed">엄선된 브랜드의 정품만을 취급합니다.</p>
            </div>
            <div>
              <div className="text-xs font-mono text-graphite mb-3">03</div>
              <h3 className="text-lg font-bold mb-2">간편한 반품</h3>
              <p className="text-sm text-graphite leading-relaxed">30일 이내 무료 반품 및 교환 서비스.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-line">
        <div className="max-w-content mx-auto px-4 md:px-8 py-16 md:py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-black tracking-tightest mb-5">지금 시작하세요</h2>
          <p className="text-graphite mb-8">회원가입하고 다양한 혜택을 받아보세요.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/products"
              className="bg-ink text-paper px-7 py-3.5 text-sm font-semibold hover:opacity-80 transition-opacity"
            >
              상품 둘러보기
            </Link>
            {!user && (
              <Link
                to="/signup"
                className="border border-ink px-7 py-3.5 text-sm font-semibold hover:bg-ink hover:text-paper transition-colors"
              >
                회원가입하기
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
