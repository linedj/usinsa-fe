import { useState } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import type { FormEvent } from 'react'
import type { Location } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, redirectToOauth, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)

    if (!email || !password) {
      setLocalError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    try {
      await login({ email, password })
      const redirect = (location.state as { from?: Location })?.from?.pathname ?? '/'
      navigate(redirect, { replace: true })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '로그인에 실패했습니다.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="text-4xl font-bold text-blue-600">
            USINSA
          </Link>
          <p className="mt-2 text-gray-600">로그인하여 쇼핑을 시작하세요</p>
        </div>

        {/* 로그인 폼 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* 에러 메시지 */}
            {(error || localError) && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error || localError}
              </div>
            )}

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">또는</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <button
                type="button"
                onClick={() => redirectToOauth('google')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="font-medium">Google로 계속하기</span>
              </button>

              <button
                type="button"
                onClick={() => redirectToOauth('kakao')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#FEE500] rounded-lg hover:bg-[#FDD835] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl">💬</span>
                <span className="font-medium">카카오로 계속하기</span>
              </button>

              <button
                type="button"
                onClick={() => redirectToOauth('naver')}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#03C75A] text-white rounded-lg hover:bg-[#02B350] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="text-xl font-bold">N</span>
                <span className="font-medium">네이버로 계속하기(테스트 계정)</span>
              </button>
            </div>
          </div>

          {/* 회원가입 링크 */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              계정이 없으신가요?{' '}
              <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
                회원가입
              </Link>
            </p>
          </div>
        </div>

        {/* 추가 링크 */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <Link to="/" className="hover:text-gray-700">홈으로 돌아가기</Link>
        </div>
      </div>
    </div>
  )
}
