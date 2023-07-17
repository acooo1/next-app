'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { type Store } from '@prisma/client';
import {
  CheckIcon,
  ChevronsUpDownIcon,
  PlusCircleIcon,
  StoreIcon,
} from 'lucide-react';

import { useStoreModalActions } from '@/components/store/store-modal';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { cn } from '@/lib/utils';

type StoreOption = {
  label: string;
  value: string;
};

type StoreSelectorProps = {
  stores: Store[];
};

export default function StoreSelector({ stores }: StoreSelectorProps) {
  const { open: openModal } = useStoreModalActions();

  const params = useParams();
  const router = useRouter();

  const [isOpen, setIsOpen] = React.useState(false);

  const storeOptions: StoreOption[] = stores.map(store => ({
    label: store.name,
    value: store.id,
  }));

  const currentStore = storeOptions.find(
    store => store.value === params.storeId,
  );

  const onStoreSelect = (value: string) => {
    setIsOpen(false);
    router.push(`/${value}`);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          type='button'
          variant='outline'
          role='combobox'
          aria-expanded={isOpen}
          className='w-[200px] justify-between'
        >
          <StoreIcon className='mr-2 h-4 w-4' />
          {currentStore?.value
            ? storeOptions.find(store => store.value === currentStore?.value)
                ?.label
            : 'Select store...'}
          <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command>
          <CommandList>
            <CommandInput placeholder='Search store...' />
            <CommandEmpty>No store found.</CommandEmpty>
            <CommandGroup heading='Stores'>
              {storeOptions.map(store => (
                <CommandItem
                  key={store.value}
                  onSelect={() => onStoreSelect(store.value)}
                >
                  <CheckIcon
                    className={cn(
                      'mr-2 h-4 w-4',
                      store.value === currentStore?.value
                        ? 'opacity-100'
                        : 'opacity-0',
                    )}
                  />
                  {store.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
          <CommandSeparator />
          <CommandList>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setIsOpen(false);
                  openModal();
                }}
              >
                <PlusCircleIcon className='mr-2 h-4 w-4' />
                Create store
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
