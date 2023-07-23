'use client';

import { useParams, useRouter } from 'next/navigation';

import { type CategoryColumn, categoryColumns } from './columns';
import { PlusIcon } from 'lucide-react';

import ApiList from '@/components/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type CategoriesClientProps = {
  categories: CategoryColumn[];
};

export default function CategoriesClient({
  categories,
}: CategoriesClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Categories (${categories.length})`}
          description='Manage categories for your store'
        />
        <Button
          type='button'
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={categoryColumns} data={categories} searchKey='name' />
      <Heading title='API' description='API calls for Categories' />
      <Separator />
      <ApiList entityName='categories' entityIdName='categoryId' />
    </>
  );
}
