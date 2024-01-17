import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { ContextProvider } from '../contexts/UseContext';
import TanstackProvider from '@/providers/TanstackProvider';
import { Toaster } from "@/components/ui/toaster"

function App({ Component, pageProps }: AppProps) {
  return (
    <TanstackProvider>
      <ContextProvider>
        <Component {...pageProps} />
        <Toaster />
      </ContextProvider>
    </TanstackProvider>
  );
}
export default App;
