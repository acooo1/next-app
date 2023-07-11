'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { create } from 'zustand';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Modal from '@/components/ui/modal';

const formSchema = z.object({
  name: z.string().min(1, { message: 'required' }),
});

function StoreModal() {
  const isOpen = useStoreModalIsOpen();
  const { close } = useStoreModalActions();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = () => {
    // TODO
  };

  return (
    <Modal
      title='Create a store'
      description='Add a new store to manage products and categories'
      isOpen={isOpen}
      onClose={close}
    >
      <div className='space-y-4 py-2 pb-4'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='E-commerce' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <footer className='flex items-center justify-end space-x-2 pt-6'>
              <Button variant='outline' onClick={close}>
                Cancel
              </Button>
              <Button type='submit'>Continue</Button>
            </footer>
          </form>
        </Form>
      </div>
    </Modal>
  );
}

/**
 * This "provider" will be instanciated at the root page; allowing to display the <StoreModal />
 * component from every part of the application.
 */
function StoreModalProvider() {
  // Useful to prevent hydration issues between server and client components.
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <StoreModal />;
}

type UseStoreModalStore = {
  isOpen: boolean;
  actions: {
    open: () => void;
    close: () => void;
  };
};

const useStoreModal = create<UseStoreModalStore>(set => ({
  isOpen: false,
  actions: {
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  },
}));

const useStoreModalIsOpen = () => useStoreModal(state => state.isOpen);
const useStoreModalActions = () => useStoreModal(state => state.actions);

export { StoreModalProvider, useStoreModalIsOpen, useStoreModalActions };
