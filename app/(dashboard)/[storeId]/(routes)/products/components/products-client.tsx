'use client';

import { useParams, useRouter } from 'next/navigation';

import { type ProductColumn, productColumns } from './columns';
import { PlusIcon } from 'lucide-react';

import ApiList from '@/components/api-list';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';

type ProductsClientProps = {
  products: ProductColumn[];
};

export default function ProductsClient({ products }: ProductsClientProps) {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading
          title={`Products (${products.length})`}
          description='Manage products for your store'
        />
        <Button
          type='button'
          onClick={() => router.push(`/${params.storeId}/products/new`)}
        >
          <PlusIcon className='mr-2 h-4 w-4' />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={productColumns} data={products} searchKey='name' />
      <Heading title='API' description='API calls for Products' />
      <Separator />
      <ApiList entityName='products' entityIdName='productId' />
    </>
  );
}
