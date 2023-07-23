import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import SizeForm from './components/size-form';

import { prisma } from '@/lib/db';

type SizePageProps = {
  params: { sizeId: string };
};

export default async function SizePage({ params }: SizePageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const size = await prisma.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizeForm size={size} />
      </div>
    </main>
  );
}
