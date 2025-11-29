import type { LoginPayload, TokenPair } from '@/api/types'

const STORAGE_KEY = 'usinsa-auth'

export type AuthTokens = {
  accessToken: string
  refreshToken: string
  accessTokenExp?: number
  refreshTokenExp?: number
}

export type StoredAuth = {
  tokens: AuthTokens | null
  user: LoginPayload | null
}

const defaultValue: StoredAuth = {
  tokens: null,
  user: null,
}

const readStorage = (): StoredAuth => {
  if (typeof window === 'undefined') {
    return structuredClone(defaultValue)
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return structuredClone(defaultValue)
    }
    return JSON.parse(raw)
  } catch {
    return structuredClone(defaultValue)
  }
}

let cache: StoredAuth = readStorage()

const persist = () => {
  if (typeof window === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache))
  } catch {
    // ignore storage errors
  }
}

type TokenSource =
  | TokenPair
  | (Partial<
      Pick<LoginPayload, 'accessToken' | 'refreshToken' | 'accessTokenExp' | 'refreshTokenExp'>
    > & { accessToken?: string; refreshToken?: string })
  | null
  | undefined

const normalizeTokens = (input?: TokenSource): AuthTokens | null => {
  if (!input?.accessToken || !input.refreshToken) {
    return null
  }
  const accessExp =
    'accessTokenExp' in input
      ? input.accessTokenExp
      : 'accessExpEpochSec' in input
        ? input.accessExpEpochSec
        : undefined
  const refreshExp =
    'refreshTokenExp' in input
      ? input.refreshTokenExp
      : 'refreshExpEpochSec' in input
        ? input.refreshExpEpochSec
        : undefined
  return {
    accessToken: input.accessToken,
    refreshToken: input.refreshToken,
    accessTokenExp: accessExp ?? undefined,
    refreshTokenExp: refreshExp ?? undefined,
  }
}

export const tokenStorage = {
  getSnapshot(): StoredAuth {
    return structuredClone(cache)
  },
  getTokens(): AuthTokens | null {
    return cache.tokens
  },
  setTokens(tokens?: TokenPair | null) {
    cache = {
      ...cache,
      tokens: normalizeTokens(tokens),
    }
    persist()
  },
  setAuth(user?: LoginPayload | null) {
    cache = {
      ...cache,
      user: user ?? null,
      tokens: normalizeTokens(user ?? undefined) ?? cache.tokens,
    }
    persist()
  },
  hydrate(user: LoginPayload | null, tokens: TokenPair | null) {
    cache = {
      user,
      tokens: normalizeTokens(tokens),
    }
    persist()
  },
  clear() {
    cache = structuredClone(defaultValue)
    persist()
  },
}

