/**
 * 비회원 장바구니 식별자 관리 (쿠키 기반)
 *
 * - 쿠키로 저장하면 axios withCredentials: true 설정으로 모든 요청에 자동 포함
 * - 별도 헤더 주입 없이 BE가 Cookie: guestId=... 로 식별
 * - SameSite=Lax로 CSRF 방지, HttpOnly 미적용 (FE에서 존재 여부 확인 필요)
 */
const COOKIE_NAME = 'guestId'
const MAX_AGE_DAYS = 7

function setCookie(value: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function getCookie(): string | null {
  const match = document.cookie.split('; ').find((row) => row.startsWith(`${COOKIE_NAME}=`))
  return match ? match.split('=')[1] : null
}

function deleteCookie() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`
}

export const guestId = {
  /** 기존 쿠키 반환 또는 새로 생성하여 쿠키에 저장 */
  get(): string {
    let id = getCookie()
    if (!id) {
      id = crypto.randomUUID()
      setCookie(id)
    }
    return id
  },

  /** guestId 쿠키가 존재하는지 (비회원 장바구니가 있을 수 있는지) */
  exists(): boolean {
    return getCookie() !== null
  },

  /** 병합 완료 시 쿠키 삭제 */
  clear() {
    deleteCookie()
  },
}
