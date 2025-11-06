import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import ThemeProvider from '@/components/ThemeProvider';
import { AuthProvider } from '@/contexts/AuthContext';
import HeaderWrapper from '@/components/HeaderWrapper';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          <HeaderWrapper />
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="flex-grow"
          >
            <Component {...pageProps} />
          </motion.main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

