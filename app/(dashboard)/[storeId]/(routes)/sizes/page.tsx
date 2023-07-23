import { format } from 'date-fns';

import { SizeColumn } from './components/columns';
import SizesClient from './components/sizes-client';

import { prisma } from '@/lib/db';

type SizesPageProps = {
  params: { storeId: string };
};

export default async function SizesPage({ params }: SizesPageProps) {
  const sizes = await prisma.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedSizes: SizeColumn[] = sizes.map(size => ({
    id: size.id,
    name: size.name,
    value: size.value,
    createdAt: format(size.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <SizesClient sizes={formattedSizes} />
      </div>
    </main>
  );
}
