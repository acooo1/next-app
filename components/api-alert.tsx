'use client';

import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Badge, BadgeProps } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { useToast } from '@components/ui/use-toast';
import { CopyIcon, ServerIcon } from 'lucide-react';

type ApiAlertProps = {
  title: string;
  description: string;
  variant: 'public' | 'admin';
};

const textMap: Record<ApiAlertProps['variant'], string> = {
  public: 'Public',
  admin: 'Admin',
};

const variantMap: Record<ApiAlertProps['variant'], BadgeProps['variant']> = {
  public: 'secondary',
  admin: 'destructive',
};

export default function ApiAlert({
  title,
  description,
  variant,
}: ApiAlertProps) {
  const { toast } = useToast();

  const onCopy = () => {
    navigator.clipboard.writeText(description);
    toast({ title: 'API route copied to clipboard.' });
  };
  return (
    <Alert>
      <ServerIcon className='h-4 w-4' />
      <AlertTitle className='flex items-center gap-x-2'>
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className='mt-4 flex items-center justify-between'>
        <code className='rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold'>
          {description}
        </code>
        <Button type='button' size='icon' variant='outline'>
          <CopyIcon className='h-4 w-4' onClick={onCopy} />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
