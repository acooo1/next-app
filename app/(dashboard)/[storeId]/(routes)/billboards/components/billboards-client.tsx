'use client';

import { useParams, useRouter } from 'next/navigation';

import { type BillboardColumn, billboardColumns } from './columns';
import { PlusIcon } from 'lucide-react';

import ApiList from '@/components/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type BillboardsClientProps = {
  billboards: BillboardColumn[];
};

export default function BillboardsClient({
  billboards,
}: BillboardsClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Billboards (${billboards.length})`}
          description='Manage billboards for your store'
        />
        <Button
          type='button'
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable
        columns={billboardColumns}
        data={billboards}
        searchKey='label'
      />
      <Heading title='API' description='API calls for Billboards' />
      <Separator />
      <ApiList entityName='billboards' entityIdName='billboardId' />
    </>
  );
}
