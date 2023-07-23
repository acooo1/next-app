import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import { StoreModalProvider } from '@/components/store/store-modal';
import { ThemeProvider } from '@/components/theme';
import { Toaster as NotificationsProvider } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Administration Dashboard for our SAAS Product',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={inter.className}>
          <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
            <NotificationsProvider />
            <StoreModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
