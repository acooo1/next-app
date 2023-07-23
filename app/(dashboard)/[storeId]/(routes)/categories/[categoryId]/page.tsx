import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import CategoryForm from './components/category-form';

import { prisma } from '@/lib/db';

type CategoryPageProps = {
  params: { storeId: string; categoryId: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { userId } = auth();

  if (!userId) {
    redirect('/sign-in');
  }

  const category = await prisma.category.findUnique({
    where: {
      id: params.categoryId,
    },
  });

  const billboards = await prisma.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm category={category} billboards={billboards} />
      </div>
    </main>
  );
}
