import './globals.css';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import CategoryNav from '@/components/CategoryNav';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: "Flipkart Clone - India's Best Online Shopping",
  description: "Online Shopping — Shop Online for Mobiles, Books, Watches, Shoes at Best Prices in India",
  icons: {
    icon: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/favicon-32557a.ico',
    shortcut: 'https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/favicon-32557a.ico',
  }
};

import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <WishlistProvider>
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
            </WishlistProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
