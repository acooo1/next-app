import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import ColorForm from './components/color-form';

import { prisma } from '@/lib/db';

type ColorPageProps = {
  params: { colorId: string };
};

export default async function ColorPage({ params }: ColorPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const color = await prisma.color.findUnique({
    where: {
      id: params.colorId,
    },
  });

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorForm color={color} />
      </div>
    </main>
  );
}
