import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-ink text-mist mt-24">
      <div className="max-w-content mx-auto px-4 md:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="text-xl font-black tracking-tightest text-paper mb-3">USINSA</div>
            <p className="text-sm text-graphite">당신의 스타일을 완성하는 쇼핑몰</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-paper mb-4 uppercase tracking-widest">쇼핑</h4>
            <ul className="space-y-2 text-sm text-graphite">
              <li><Link to="/products" className="hover:text-paper transition-colors">전체 상품</Link></li>
              <li><Link to="/search" className="hover:text-paper transition-colors">검색</Link></li>
              <li><Link to="/cart" className="hover:text-paper transition-colors">장바구니</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-paper mb-4 uppercase tracking-widest">고객지원</h4>
            <ul className="space-y-2 text-sm text-graphite">
              <li><a href="#" className="hover:text-paper transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-paper transition-colors">배송 정보</a></li>
              <li><a href="#" className="hover:text-paper transition-colors">반품/교환</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-paper mb-4 uppercase tracking-widest">회사 정보</h4>
            <ul className="space-y-2 text-sm text-graphite">
              <li><a href="#" className="hover:text-paper transition-colors">회사 소개</a></li>
              <li><a href="#" className="hover:text-paper transition-colors">이용약관</a></li>
              <li><a href="#" className="hover:text-paper transition-colors">개인정보처리방침</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-graphite/30 mt-12 pt-8 text-center text-xs text-graphite">
          <p>&copy; 2026 USINSA. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
