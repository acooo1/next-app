'use client';

import * as React from 'react';

import { useToast } from '../ui/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
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

import useIsMounted from '@/hooks/use-is-mounted';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
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

  const [isLoading, setIsLoading] = React.useState(false);

  const { toast } = useToast();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/stores', values);
      // Due to error when using 'redirect()' from 'next' sometimes.
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast({
        title: 'Could not create store.',
        description: 'Try again or contact the administrator.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = () => {
    form.reset();
    close();
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
                    <Input
                      disabled={isLoading}
                      placeholder='E-commerce'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <footer className='flex items-center justify-end space-x-2 pt-6'>
              <Button
                type='button'
                disabled={isLoading}
                variant='outline'
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button disabled={isLoading} type='submit'>
                Continue
              </Button>
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
  const isMounted = useIsMounted();

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
