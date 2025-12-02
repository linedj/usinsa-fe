import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { useAuth } from '@/auth/useAuth'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const { signup, redirectToOauth, loading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLocalError(null)
    if (password !== confirmPassword) {
      setLocalError('비밀번호가 일치하지 않습니다.')
      return
    }
    try {
      await signup({ email, password, name, nickname })
      navigate('/login')
    } catch (err) {
      setLocalError(err instanceof Error ? err.message : '회원가입 실패')
    }
  }

  return (
    <div className="page-container">
      <div className="card">
        <h1>USINSA Admin Sign Up</h1>
        <p className="subtitle">계정을 생성하세요.</p>
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
          <label>
            비밀번호 확인
            <input
              type="password"
              value={confirmPassword}
              placeholder="••••••••"
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
          <label>
            이름
            <input
              type="text"
              value={name}
              placeholder="홍길동"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            닉네임
            <input
              type="text"
              value={nickname}
              placeholder="길동"
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </label>
          {(error || localError) && (
            <p className="error">{error ?? localError ?? '요청 중 문제가 발생했습니다.'}</p>
          )}
          <button type="submit" disabled={loading}>
            {loading ? '회원가입 중...' : '회원가입'}
          </button>
        </form>
        <div className="social-login">
          <button onClick={() => redirectToOauth('google')}>Sign up with Google</button>
          <button onClick={() => redirectToOauth('naver')}>Sign up with Naver</button>
          <button onClick={() => redirectToOauth('kakao')}>Sign up with Kakao</button>
        </div>
      </div>
    </div>
  )
}
