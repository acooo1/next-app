import { format } from 'date-fns';

import CategoriesClient from './components/categories-client';
import { type CategoryColumn } from './components/columns';

import { prisma } from '@/lib/db';

type CategoriesPageProps = {
  params: { storeId: string };
};

export default async function CategoriesPage({ params }: CategoriesPageProps) {
  const categories = await prisma.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCategories: CategoryColumn[] = categories.map(category => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    createdAt: format(category.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoriesClient categories={formattedCategories} />
      </div>
    </main>
  );
}
