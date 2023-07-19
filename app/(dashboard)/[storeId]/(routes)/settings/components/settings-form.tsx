'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client';
import axios from 'axios';
import { TrashIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import ApiAlert from '@/components/api-alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

import useOrigin from '@/hooks/use-origin';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
});

type SettingsFormValues = z.infer<typeof formSchema>;

export default function SettingsForm({ store }: { store: Store }) {
  const params = useParams();
  const router = useRouter();

  const origin = useOrigin();

  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: store.name,
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: SettingsFormValues) => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`, values);
      router.refresh();
      toast({ title: 'Store updated.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not update store.',
        description: 'Try again or contact the administrator',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push('/');
      toast({ title: 'Store deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete store.',
        description:
          'Make sure you removed all products and categories first then try again. Otherwise, contact the administrator.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title='Settings' description='Manage store preferences' />
        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              disabled={isLoading}
              type='button'
              variant='destructive'
              size='icon'
            >
              <TrashIcon className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you really sure to continue ?
              </AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                store.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Separator />
      <Form {...form}>
        <form className='space-y-8' onSubmit={form.handleSubmit(onSubmit)}>
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Store name'
                      {...field}
                    ></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type='submit'>
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      {/* //!FIXME: generate hydration errors on refresh (see 'useOrigin()')*/}
      <ApiAlert
        variant='public'
        title='NEXT_PUBLIC_API_URL'
        description={`${origin}/api/${params.storeId}`}
      />
    </>
  );
}
