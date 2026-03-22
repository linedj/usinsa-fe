const COOKIE_NAME = 'guestId'
const MAX_AGE_DAYS = 7
const IS_PROD = window.location.hostname.includes('usinsa.store')

function setCookie(value: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  const base = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}`
  // 운영: 크로스 서브도메인 전송을 위해 SameSite=None;Secure + domain 설정
  // 로컬: SameSite=Lax (HTTPS 불필요)
  document.cookie = IS_PROD
    ? `${base}; domain=usinsa.store; SameSite=None; Secure`
    : `${base}; SameSite=Lax`
}

function getCookie(): string | null {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  return match ? match.split('=')[1] : null
}

function deleteCookie() {
  const base = `${COOKIE_NAME}=; path=/; max-age=0`
  document.cookie = IS_PROD
    ? `${base}; domain=usinsa.store; SameSite=None; Secure`
    : `${base}; SameSite=Lax`
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
