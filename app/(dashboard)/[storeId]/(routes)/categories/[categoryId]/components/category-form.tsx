'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Billboard, Category } from '@prisma/client';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(1, { message: 'Required' }),
  billboardId: z.string().min(1, { message: 'Required' }),
});

type CategoryFormValues = z.infer<typeof formSchema>;

type CategoryFormProps = {
  category: Category | null;
  billboards: Billboard[] | null;
};

export default function CategoryForm({
  category,
  billboards,
}: CategoryFormProps) {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const title = category ? 'Edit category' : 'Create category';
  const description = category ? 'Edit category' : 'Add a new category';
  const successMessage = category ? 'Category updated.' : 'Category created.';

  const errorMessage = category
    ? 'Could not update category.'
    : 'Could not create category.';

  const action = category ? 'Save changes' : 'Create';

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: category || {
      name: '',
      billboardId: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: CategoryFormValues) => {
    try {
      setIsLoading(true);

      if (category) {
        await axios.patch(
          `/api/${params.storeId}/categories/${params.categoryId}`,
          values,
        );
      } else {
        await axios.post(`/api/${params.storeId}/categories`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/categories`);
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
      await axios.delete(
        `/api/${params.storeId}/categories/${params.categoryId}`,
      );
      router.refresh();
      router.push(`/${params.storeId}/categories`);
      toast({ title: 'Category deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete category.',
        description:
          'Make sure you removed all products using this category first then try again. Otherwise, contact the administrator.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {category ? (
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
                  category.
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
                      placeholder='Category name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='billboardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select a billboard' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards?.map(billboard => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
