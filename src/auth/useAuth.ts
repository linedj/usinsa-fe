import { useContext } from 'react'
import { AuthContext } from './AuthProvider'

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('AuthContext가 초기화되지 않았습니다.')
  }
  return context
}

