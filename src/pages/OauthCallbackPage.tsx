import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export const OauthCallbackPage = () => {
  const { provider } = useParams<{ provider: 'google' | 'kakao' | 'naver' }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { oauthLogin, error } = useAuth()
  const [localError, setLocalError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const code = searchParams.get('code')
    const errorParam = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    // OAuth 에러 처리
    if (errorParam) {
      setLocalError(errorDescription || errorParam || 'OAuth 인증에 실패했습니다.')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    // 코드가 없는 경우
    if (!code) {
      setLocalError('인증 코드를 받지 못했습니다. 다시 시도해주세요.')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    // Provider가 없는 경우
    if (!provider) {
      setLocalError('OAuth 제공자를 확인할 수 없습니다.')
      setLoading(false)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
      return
    }

    // OAuth 로그인 시도
    oauthLogin({ provider, code })
      .then(() => {
        // 성공 시 저장된 콜백 정보 제거
        sessionStorage.removeItem('oauth_provider')
        sessionStorage.removeItem('oauth_callback_url')
        navigate('/')
      })
      .catch((err) => {
        setLocalError(err instanceof Error ? err.message : 'OAuth 로그인에 실패했습니다.')
        setLoading(false)
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      })
  }, [location, navigate, oauthLogin, provider])

  return (
    <div className="page-container">
      <div className="card">
        <h1>{loading ? '로그인 중...' : '로그인 실패'}</h1>
        {(error || localError) && (
          <div className="error" style={{ marginTop: '1rem', padding: '1rem', background: '#fee', borderRadius: '4px' }}>
            {error || localError}
          </div>
        )}
        {loading && <p style={{ marginTop: '1rem' }}>잠시만 기다려주세요...</p>}
        {!loading && <p style={{ marginTop: '1rem' }}>잠시 후 로그인 페이지로 이동합니다...</p>}
      </div>
    </div>
  )
}
