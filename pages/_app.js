import { SessionProvider } from "next-auth/react"
import '../styles/globals.css'

function DaysieApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}

export default DaysieApp
