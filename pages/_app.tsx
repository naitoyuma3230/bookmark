import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { Header } from '../components/Header'
import AuthWrapper from '../components/AuthWrapper'

// Reactではコンポーネントでラップした中身の要素が、childというpropsで取得される
// この場合AuthWrapperはHeader,Componentを子要素として受け取り、認証に関する処理を実行している
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <AuthWrapper>
        <Header />
        <Component {...pageProps} />
      </AuthWrapper>
    </SessionProvider>
  )
}

export default MyApp
