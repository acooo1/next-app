import { format } from 'date-fns';

import ColorsClient from './components/colors-client';
import { ColorColumn } from './components/columns';

import { prisma } from '@/lib/db';

type SizesPageProps = {
  params: { storeId: string };
};

export default async function SizesPage({ params }: SizesPageProps) {
  const colors = await prisma.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedSizes: ColorColumn[] = colors.map(color => ({
    id: color.id,
    name: color.name,
    value: color.value,
    createdAt: format(color.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ColorsClient colors={formattedSizes} />
      </div>
    </main>
  );
}
