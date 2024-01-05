import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithI18Next } from 'ni18n'
import { ni18nConfig } from '../ni18n.config'
import { SessionProvider } from 'next-auth/react';
function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
  <Component {...pageProps} />
  </SessionProvider>
  );
}
export default appWithI18Next(App, ni18nConfig)