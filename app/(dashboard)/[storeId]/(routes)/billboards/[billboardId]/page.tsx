import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import BillboardForm from './components/billboard-form';

import { prisma } from '@/lib/db';

type BillboardPageProps = {
  params: { billboardId: string };
};

export default async function BillboardPage({ params }: BillboardPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const billboard = await prisma.billboard.findUnique({
    where: {
      id: params.billboardId,
    },
  });

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardForm billboard={billboard} />
      </div>
    </main>
  );
}
