import React from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import ProtectedRoute from './ProtectedRoute'

const authRoutes = ['/mypage', '/articles/[id]', '/post']

// 指定されたルートのページを認証保護のための<Protected>コンポーネントに入れる
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  // cookieからsessionを取得 statusとsessionのオブジェクト
  const session = useSession()
  const router = useRouter()

  // loading中は表示しない
  if (session.status === 'loading') return null

  // 指定したrouterに対応するchildをルート保護対象にする
  return (
    <>
      {authRoutes.includes(router.pathname) ? (
        <ProtectedRoute>{children}</ProtectedRoute>
      ) : (
        children
      )}
    </>
  )
}

export default AuthWrapper
