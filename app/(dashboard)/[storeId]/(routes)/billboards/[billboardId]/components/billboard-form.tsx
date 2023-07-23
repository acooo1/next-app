'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Billboard } from '@prisma/client';
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
  label: z.string().min(1, { message: 'Required' }),
  imageUrl: z.string().min(1, { message: 'Required' }),
});

type BillboardFormValues = z.infer<typeof formSchema>;

type BillboardFormProps = {
  billboard: Billboard | null;
};

export default function BillboardForm({ billboard }: BillboardFormProps) {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const title = billboard ? 'Edit billboard' : 'Create billboard';
  const description = billboard ? 'Edit billboard' : 'Add a new billboard';
  const successMessage = billboard
    ? 'Billboard updated.'
    : 'Billboard created.';

  const errorMessage = billboard
    ? 'Could not update billboard.'
    : 'Could not create billboard.';

  const action = billboard ? 'Save changes' : 'Create';

  const form = useForm<BillboardFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: billboard || {
      label: '',
      imageUrl: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: BillboardFormValues) => {
    try {
      setIsLoading(true);

      if (billboard) {
        await axios.patch(
          `/api/${params.storeId}/billboards/${params.billboardId}`,
          values,
        );
      } else {
        await axios.post(`/api/${params.storeId}/billboards`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/billboards`);
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
      await axios.delete(`/api/${params.storeId}/${params.billboardId}`);
      router.refresh();
      router.push(`/${params.storeId}/billboards`);
      toast({ title: 'Billboard deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete billboard.',
        description:
          'Make sure you removed all categories using this billboard first then try again. Otherwise, contact the administrator.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {billboard ? (
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
                  billboard.
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
          <FormField
            control={form.control}
            name='imageUrl'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background image</FormLabel>
                <FormControl>
                  <ImageUploader
                    urls={field.value ? [field.value] : []}
                    disabled={isLoading}
                    onChange={url => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='grid grid-cols-3 gap-8'>
            <FormField
              control={form.control}
              name='label'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      placeholder='Billboard label'
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
