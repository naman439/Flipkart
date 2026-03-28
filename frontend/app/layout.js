import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CategoryNav from '@/components/CategoryNav';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Flipkart Clone - India\'s Best Online Shopping',
  description: 'Shop online at Flipkart Clone for electronics, mobiles, fashion, home appliances and more. Best deals with fast delivery.',
  keywords: 'online shopping, electronics, mobiles, fashion, flipkart',
};

import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              <CategoryNav />
              <main style={{ minHeight: 'calc(100vh - 64px)' }}>
                {children}
              </main>
              <Footer />
              <Toaster
                position="bottom-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#212121',
                    color: '#fff',
                    fontSize: '14px',
                    borderRadius: '4px',
                  },
                  success: { iconTheme: { primary: '#388e3c', secondary: '#fff' } },
                  error: { iconTheme: { primary: '#d32f2f', secondary: '#fff' } },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
