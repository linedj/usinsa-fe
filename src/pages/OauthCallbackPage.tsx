import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

/**
 * OAuth 콜백 페이지
 *
 * Spring Security SuccessHandler가 JWT를 HttpOnly 쿠키에 담아
 * /oauth/callback/:provider 로 리다이렉트한다.
 *
 * 여기서 me() 조회 + 비회원 장바구니 병합을 처리한 뒤 홈으로 이동한다.
 */
export const OauthCallbackPage = () => {
  const { provider: _provider } = useParams<{ provider: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { afterOAuthLogin } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const errorParam = params.get('error')

    sessionStorage.removeItem('oauth_provider')

    if (errorParam) {
      setError(params.get('error_description') || 'OAuth 인증에 실패했습니다.')
      setTimeout(() => navigate('/login'), 3000)
      return
    }

    // 쿠키 세팅 완료 → me() 조회 + 비회원 장바구니 병합 후 홈으로 이동
    afterOAuthLogin().then(() => navigate('/', { replace: true }))
  }, [])

  if (error) {
    return (
      <div className="page-container">
        <div className="card">
          <h1>로그인 실패</h1>
          <p style={{ marginTop: '1rem', color: '#c00' }}>{error}</p>
          <p>잠시 후 로그인 페이지로 이동합니다...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>로그인 중...</h1>
        <p style={{ marginTop: '1rem' }}>잠시만 기다려주세요.</p>
      </div>
    </div>
  )
}
