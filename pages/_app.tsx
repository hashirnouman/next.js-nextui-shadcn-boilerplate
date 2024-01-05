import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { appWithI18Next } from 'ni18n'
import { ni18nConfig } from '../ni18n.config'
import { SessionProvider } from 'next-auth/react';
import { Provider } from 'react-redux';
import store from '../store';
function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
    <SessionProvider session={pageProps.session}>
  <Component {...pageProps} />
  </SessionProvider>
  </Provider>
  );
}
export default appWithI18Next(App, ni18nConfig)