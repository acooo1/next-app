'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import axios from 'axios';

import { type BillboardColumn } from './columns';
import {
  CopyIcon,
  EditIcon,
  MoreHorizontalIcon,
  TrashIcon,
} from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';

type CellActionProps = {
  data: BillboardColumn;
};
export default function CellAction({ data }: CellActionProps) {
  const router = useRouter();
  const params = useParams();

  const [isLoading, setIsLoading] = React.useState(false);
  const [confirmDeletion, setConfirmDeletion] = React.useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText(data.id);
    toast({ title: 'Billboard Id copied to clipboard.' });
  };

  const onEdit = () => {
    router.push(`/${params.storeId}/billboards/${data.id}`);
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.refresh();
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
      setConfirmDeletion(false);
    }
  };

  return (
    <>
      <AlertDialog open={confirmDeletion}>
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
            <AlertDialogCancel
              disabled={isLoading}
              onClick={() => setConfirmDeletion(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction disabled={isLoading} onClick={onDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <MoreHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy}>
            <CopyIcon className='mr-2 h-4 w-4' />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <EditIcon className='mr-2 h-4 w-4' />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setConfirmDeletion(true)}>
            <TrashIcon className='mr-2 h-4 w-4' />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
