import { useMemo } from 'react'
import { useAuth } from '@/auth/useAuth'

const formatEpoch = (epoch?: number) => {
  if (!epoch) {
    return '-'
  }
  const date = new Date(epoch * 1000)
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
}

export const DashboardPage = () => {
  const { user, tokens, logout, refreshTokens, loading } = useAuth()

  const userRows = useMemo(
    () => [
      { label: 'ID', value: user?.memberId ?? '-' },
      { label: '이메일', value: user?.email ?? '-' },
      { label: '이름', value: user?.name ?? '-' },
      { label: '닉네임', value: user?.nickname ?? '-' },
    ],
    [user],
  )

  const tokenRows = useMemo(
    () => [
      { label: 'Access Token', value: tokens?.accessToken ?? '-' },
      { label: 'Access Exp.', value: formatEpoch(tokens?.accessTokenExp) },
      { label: 'Refresh Token', value: tokens?.refreshToken ?? '-' },
      { label: 'Refresh Exp.', value: formatEpoch(tokens?.refreshTokenExp) },
    ],
    [tokens],
  )

  return (
    <div className="page-container">
      <div className="card">
        <header className="card-header">
          <div>
            <p className="subtitle">어드민 계정</p>
            <h1>{user?.name ?? '알 수 없음'}</h1>
          </div>
          <div className="actions">
            <button type="button" onClick={refreshTokens} disabled={loading}>
              {loading ? '갱신 중...' : '토큰 갱신'}
            </button>
            <button type="button" className="secondary" onClick={logout} disabled={loading}>
              로그아웃
            </button>
          </div>
        </header>

        <section>
          <h2>회원 정보</h2>
          <dl>
            {userRows.map((row) => (
              <div key={row.label} className="row">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2>토큰 정보</h2>
          <dl>
            {tokenRows.map((row) => (
              <div key={row.label} className="row mono">
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </div>
  )
}

