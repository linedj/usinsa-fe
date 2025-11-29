import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import type { Location } from 'react-router-dom'
import { useAuth } from '@/auth/useAuth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)
    try {
      await login({ email, password })
      const redirect = (location.state as { from?: Location })?.from?.pathname ?? '/'
      navigate(redirect, { replace: true })
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '로그인 실패')
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>USINSA Admin Sign In</h1>
        <p className="subtitle">발급된 계정으로 로그인하세요.</p>
        <form className="form" onSubmit={handleSubmit}>
          <label>
            이메일
            <input
              type="email"
              value={email}
              placeholder="admin@example.com"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            비밀번호
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {(error || localError) && (
            <p className="error">{error ?? localError ?? '요청 중 문제가 발생했습니다.'}</p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>
      </div>
    </div>
  )
}

