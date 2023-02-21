import React, { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

// 認証状態に応じて描画とリダイレクトを切り替える
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()
  // cookieからsession情報 statusを取得
  // {}でオブジェクトkeyがstatusの値を展開して取得
  const { status } = useSession()

  // routerでページの情報を取得
  // ページ遷移毎に実行される
  useEffect(() => {
    // statusの変更毎に実行される
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [router, status])

  if (status === 'unauthenticated') return null

  // 引数のchildren:ReactNodeをリターン
  return <>{children}</>
}

export default ProtectedRoute
