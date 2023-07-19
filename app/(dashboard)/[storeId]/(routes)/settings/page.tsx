import { redirect } from 'next/navigation';

import SettingsForm from './components/settings-form';
import { auth } from '@clerk/nextjs';

import { prisma } from '@/lib/db';

type SettingsPageProps = {
  params: {
    storeId: string;
  };
};

export default async function SettingsPage({ params }: SettingsPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const store = await prisma.store.findFirst({
    where: { id: params.storeId, userId },
  });

  if (!store) {
    redirect('/');
  }

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SettingsForm store={store} />
      </div>
    </main>
  );
}
