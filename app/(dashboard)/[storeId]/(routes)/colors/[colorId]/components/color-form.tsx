'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { Color } from '@prisma/client';
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
  value: z
    .string()
    .min(4)
    .regex(/^#/, { message: 'String must be a valid hex code' }),
});

type ColorFormValues = z.infer<typeof formSchema>;

type ColorFormProps = {
  color: Color | null;
};

export default function ColorForm({ color }: ColorFormProps) {
  const params = useParams();
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);

  const title = color ? 'Edit color' : 'Create color';
  const description = color ? 'Edit color' : 'Add a new color';
  const successMessage = color ? 'Color updated.' : 'Color created.';

  const errorMessage = color
    ? 'Could not update color.'
    : 'Could not create color.';

  const action = color ? 'Save changes' : 'Create';

  const form = useForm<ColorFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: color || {
      name: '',
      value: '',
    },
  });

  const { toast } = useToast();

  const onSubmit = async (values: ColorFormValues) => {
    try {
      setIsLoading(true);

      if (color) {
        await axios.patch(
          `/api/${params.storeId}/colors/${params.colorId}`,
          values,
        );
      } else {
        await axios.post(`/api/${params.storeId}/colors`, values);
      }

      router.refresh();
      router.push(`/${params.storeId}/colors`);
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
      await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
      router.refresh();
      router.push(`/${params.storeId}/colors`);
      toast({ title: 'Color deleted.' });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete color.',
        description:
          'Make sure you removed all products using this color first then try again. Otherwise, contact the administrator.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='flex items-center justify-between'>
        <Heading title={title} description={description} />
        {color ? (
          <AlertDialog>
            <AlertDialogTrigger>
              <Button
                disabled={isLoading}
                type='button'
                variant='destructive'
                color='icon'
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
                  color.
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
                      placeholder='Color name'
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
                    <div className='flex items-center gap-x-4'>
                      <Input
                        disabled={isLoading}
                        placeholder='Color value'
                        {...field}
                      />
                      <div
                        className='rounded-full border p-4'
                        style={{ backgroundColor: field.value }}
                      />
                    </div>
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
