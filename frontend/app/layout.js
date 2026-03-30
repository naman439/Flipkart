'use client';
import { usePathname } from 'next/navigation';
import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CategoryNav from '@/components/CategoryNav';
import Footer from '@/components/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Determine Page Context
  const isProductPage = /^\/products\/[^/]+$/.test(pathname) && pathname !== '/products';
  const isCheckoutFlow = pathname === '/cart' || pathname === '/checkout' || pathname.startsWith('/order-success');
  const isMainPage = !isProductPage && !isCheckoutFlow;

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                {isMainPage && <CategoryNav />}
                <main style={{ minHeight: 'calc(100vh - 64px)' }}>
                  {children}
                </main>
                {isMainPage && <Footer />}
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
            </WishlistProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
