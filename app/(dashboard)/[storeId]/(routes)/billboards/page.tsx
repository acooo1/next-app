import { format } from 'date-fns';

import BillboardsClient from './components/billboards-client';
import { BillboardColumn } from './components/columns';

import { prisma } from '@/lib/db';

type BillboardsPageProps = {
  params: { storeId: string };
};

export default async function BillboardsPage({ params }: BillboardsPageProps) {
  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map(billboard => ({
    id: billboard.id,
    label: billboard.label,
    createdAt: format(billboard.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient billboards={formattedBillboards} />
      </div>
    </main>
  );
}
