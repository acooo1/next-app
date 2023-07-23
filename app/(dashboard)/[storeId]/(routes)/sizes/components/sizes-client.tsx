'use client';

import { useParams, useRouter } from 'next/navigation';

import { type SizeColumn, sizesColumns } from './columns';
import { PlusIcon } from 'lucide-react';

import ApiList from '@/components/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type SizesClientProps = {
  sizes: SizeColumn[];
};

export default function SizesClient({ sizes }: SizesClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Sizes (${sizes.length})`}
          description='Manage sizes for your store'
        />
        <Button
          type='button'
          onClick={() => router.push(`/${params.storeId}/sizes/new`)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={sizesColumns} data={sizes} searchKey='name' />
      <Heading title='API' description='API calls for Sizes' />
      <Separator />
      <ApiList entityName='sizes' entityIdName='sizeId' />
    </>
  );
}
