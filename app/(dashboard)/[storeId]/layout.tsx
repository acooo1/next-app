import { redirect } from 'next/navigation';

import { UserButton, auth } from '@clerk/nextjs';

import Navbar from '@/components/navbar';
import StoreSelector from '@/components/store/store-selector';
import { ThemeSelector } from '@/components/theme';

import { prisma } from '@/lib/db';

type DashboardLayoutProps = {
  children: React.ReactNode;
  params: { storeId: string };
};

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const stores = await prisma.store.findMany({ where: { userId } });

  if (!stores) {
    redirect('/');
  }

  return (
    <>
      <header className='flex h-16 items-center border-b p-4'>
        <StoreSelector stores={stores} />
        <Navbar className='mx-6' />
        <div className='ml-auto flex h-16 items-center space-x-4'>
          <ThemeSelector />
          <UserButton />
        </div>
      </header>

      {children}
    </>
  );
}
