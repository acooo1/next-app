import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import './globals.css';
import { ClerkProvider } from '@clerk/nextjs';

import { StoreModalProvider } from '@/components/store/store-modal';
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
          <NotificationsProvider />
          <StoreModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
