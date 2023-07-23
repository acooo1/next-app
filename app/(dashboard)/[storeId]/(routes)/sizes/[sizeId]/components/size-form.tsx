'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Size } from '@prisma/client';
import axios from 'axios';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { TrashIcon } from 'lucide-react';

import ImageUploader from '@/components/image-uploader';
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

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  value: z.string().min(1, { message: 'Required' }),
});

type SizeFormValues = z.infer<typeof formSchema>;

type SizeFormProps = {
  size: Size | null;
};

export default function SizeForm({ size }: SizeFormProps) {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const title = size ? 'Edit size' : 'Create size';
  const description = size ? 'Edit size' : 'Add a new size';
  const successMessage = size ? 'Size updated.' : 'Size created.';

  const errorMessage = size
    ? 'Could not update size.'
    : 'Could not create size.';

  const action = size ? 'Save changes' : 'Create';

  const form = useForm<SizeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: size || {
      name: '',
      value: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: SizeFormValues) => {
    try {
      setIsLoading(true);

      if (size) {
        await axios.patch(
          `/api/${params.storeId}/sizes/${params.sizeId}`,
          values,
        );
      } else {
        await axios.post(`/api/${params.storeId}/sizes`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({ title: successMessage });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: errorMessage,
        description: 'Try again or contact the administrator',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
      router.refresh();
      router.push(`/${params.storeId}/sizes`);
      toast({ title: 'Size deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete size.',
        description:
          'Make sure you removed all products using this size first then try again. Otherwise, contact the administrator.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {size ? (
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
                  size.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : null}
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
                      placeholder='Size name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='value'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Size value'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isLoading} type='submit'>
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
}
