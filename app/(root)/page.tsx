'use client';

import * as React from 'react';

import {
  useStoreModalActions,
  useStoreModalIsOpen,
} from '@/components/store/store-modal';

// import { Button } from '@/components/ui/button';

export default function SetupPage() {
  const isOpen = useStoreModalIsOpen();
  const { open } = useStoreModalActions();

  // TODO: should be temporary to persist modal state for dev purposes.
  React.useEffect(() => {
    if (!isOpen) {
      open();
    }
  }, [isOpen, open]);

  // TODO: remove all of this
  // const { open: openStoreModal } = useStoreModalActions();

  return (
    <section className='p-5'>
      {/* <Button onClick={openStoreModal}>Toggle modal</Button> */}
    </section>
  );
}
