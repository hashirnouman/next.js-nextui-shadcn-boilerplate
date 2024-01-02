import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithI18Next } from 'ni18n'
import { ni18nConfig } from '../ni18n.config'
function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default appWithI18Next(App, ni18nConfig)