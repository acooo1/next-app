import BillboardsClient from './components/billboards-client';

export default function BillboardsPage() {
  return (
    <main className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <BillboardsClient />
      </div>
    </main>
  );
}
