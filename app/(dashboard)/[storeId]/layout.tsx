import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

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

  // We should not allow creating duplicates stores.
  const store = await prisma.store.findUnique({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <>
      <nav>This will be a navbar</nav>
      {children}
    </>
  );
}
