import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ContextProvider } from '../contexts/UseContext';

function App({ Component, pageProps }: AppProps) {
  return (
    <ContextProvider>
      <Component {...pageProps} />
    </ContextProvider>
  );
}
export default App;
