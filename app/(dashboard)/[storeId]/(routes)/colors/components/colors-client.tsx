'use client';

import { useParams, useRouter } from 'next/navigation';

import { type ColorColumn, colorsColumns } from './columns';
import { PlusIcon } from 'lucide-react';

import ApiList from '@/components/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type ColorsClientProps = {
  colors: ColorColumn[];
};

export default function ColorsClient({ colors }: ColorsClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Colors (${colors.length})`}
          description='Manage colors for your store'
        />
        <Button
          type='button'
          onClick={() => router.push(`/${params.storeId}/colors/new`)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={colorsColumns} data={colors} searchKey='name' />
      <Heading title='API' description='API calls for Colors' />
      <Separator />
      <ApiList entityName='colors' entityIdName='colorId' />
    </>
  );
}
