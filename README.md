# USINSA - 온라인 쇼핑몰 프로젝트

USINSA는 현대적인 웹 쇼핑몰 플랫폼입니다. React, TypeScript, Vite를 기반으로 구축되었습니다.

## 🚀 주요 기능

### 사용자 기능
- 🔐 회원가입 / 로그인 (일반, OAuth - Google, Kakao, Naver)
- 🛍️ 상품 목록 및 상세 조회
- 🔍 상품 검색 (키워드, 인기 검색어, 최근 검색어)
- 🛒 장바구니 관리 (회원/비회원)
- 📦 주문 및 주문 내역 조회
- 👤 마이페이지 (회원 정보, 토큰 관리)

### 기술 스택
- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 3
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios
- **State Management**: React Context API

## 📋 사전 요구사항

- Node.js 18.x 이상
- npm 또는 yarn
- 백엔드 API 서버

## 🛠️ 설치 및 실행

### 1. 의존성 설치

\`\`\`bash
npm install
\`\`\`

### 2. 환경 변수 설정

프로젝트 루트에 \`.env\` 파일을 생성하고 다음 내용을 추가하세요:

\`\`\`env
# 백엔드 API 서버 주소
VITE_API_PROXY=http://localhost:8080

# OAuth 설정 (선택사항)
# VITE_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
# VITE_OAUTH_KAKAO_CLIENT_ID=your_kakao_client_id
# VITE_OAUTH_NAVER_CLIENT_ID=your_naver_client_id
\`\`\`

### 3. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

서버가 실행되면 브라우저에서 \`http://localhost:5173\`으로 접속할 수 있습니다.

### 4. 프로덕션 빌드

\`\`\`bash
npm run build
\`\`\`

빌드된 파일은 \`dist\` 디렉토리에 생성됩니다.

### 5. 프로덕션 미리보기

\`\`\`bash
npm run preview
\`\`\`

## 📁 프로젝트 구조

\`\`\`
src/
├── api/              # API 호출 함수들
│   ├── authApi.ts
│   ├── cartApi.ts
│   ├── http.ts      # Axios 인스턴스
│   ├── orderApi.ts
│   ├── productApi.ts
│   ├── searchApi.ts
│   └── types.ts     # API 타입 정의
├── auth/             # 인증 관련
│   ├── AuthProvider.tsx
│   ├── tokenStorage.ts
│   └── useAuth.ts
├── components/       # 공통 컴포넌트
│   ├── Layout.tsx
│   ├── Navigation.tsx
│   └── ProtectedRoute.tsx
├── pages/            # 페이지 컴포넌트
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── SignUpPage.tsx
│   ├── ProductListPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── SearchPage.tsx
│   ├── CartPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderListPage.tsx
│   └── DashboardPage.tsx
├── App.tsx           # 앱 라우팅
└── main.tsx          # 앱 진입점
\`\`\`

## 🔑 주요 API 엔드포인트

### 인증
- \`POST /api/v1/auth/login\` - 로그인
- \`POST /api/v1/auth/logout\` - 로그아웃
- \`POST /api/v1/auth/refresh\` - 토큰 갱신

### 상품
- \`GET /api/v1/products\` - 상품 목록
- \`GET /api/v1/products/:id\` - 상품 상세

### 검색
- \`GET /api/v1/search?keyword={keyword}\` - 상품 검색
- \`GET /api/v1/search/trend\` - 인기 검색어
- \`GET /api/v1/search/history/:userId\` - 사용자 검색 기록

### 장바구니
- \`GET /api/v1/carts/member/:memberId\` - 회원 장바구니 조회
- \`GET /api/v1/carts/guest\` - 비회원 장바구니 조회
- \`POST /api/v1/carts\` - 장바구니 추가
- \`PUT /api/v1/carts/:id\` - 장바구니 수량 변경
- \`DELETE /api/v1/carts/:id\` - 장바구니 삭제

### 주문
- \`GET /api/v1/orders\` - 주문 목록
- \`POST /api/v1/orders\` - 주문 생성

## 🎨 UI/UX 특징

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모두 지원
- **직관적인 네비게이션**: 상단 고정 네비게이션 바
- **부드러운 트랜지션**: 모든 인터랙션에 자연스러운 애니메이션
- **사용자 친화적**: 명확한 피드백과 에러 메시지

## 🔒 보안

- JWT 기반 인증
- 토큰 자동 갱신
- Protected Routes (인증 필요 페이지 보호)
- 로컬 스토리지를 통한 토큰 관리

## 🐛 문제 해결

### 백엔드 연결 실패
\`.env\` 파일에서 \`VITE_API_PROXY\` 설정을 확인하세요.

### Tailwind CSS가 적용되지 않음
\`npm install\` 실행 후 개발 서버를 재시작하세요.

### 로그인 후 리다이렉트 문제
브라우저 콘솔에서 에러 메시지를 확인하고, 백엔드 API 응답을 체크하세요.

## 📝 라이센스

이 프로젝트는 교육 목적으로 제작되었습니다.

## 👥 기여

버그 리포트나 기능 제안은 이슈를 통해 제출해주세요.
