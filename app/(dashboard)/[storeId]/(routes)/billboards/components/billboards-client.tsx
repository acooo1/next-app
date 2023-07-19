'use client';

import { useParams, useRouter } from 'next/navigation';

import { PlusIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';

export default function BillboardsClient() {
  const params = useParams();
  const router = useRouter();
  return (
    <div className='flex items-center justify-between'>
      <Heading
        title='Billboards (0)'
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
  );
}
