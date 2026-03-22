const COOKIE_NAME = 'guestId'
const MAX_AGE_DAYS = 7

// 운영: 서브도메인 간 공유를 위해 domain=usinsa.store 설정
// 로컬: domain 미설정 (localhost는 domain 속성 무시)
const DOMAIN = window.location.hostname.includes('usinsa.store')
  ? 'domain=usinsa.store;'
  : ''

function setCookie(value: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; ${DOMAIN} SameSite=Lax`
}

function getCookie(): string | null {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  return match ? match.split('=')[1] : null
}

function deleteCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; ${DOMAIN} SameSite=Lax`
}

export const guestId = {
  get(): string {
    let id = getCookie()
    if (!id) {
      id = crypto.randomUUID()
      setCookie(id)
    }
    return id
  },
  exists(): boolean {
    return getCookie() !== null
  },
  clear() {
    deleteCookie()
  },
}
