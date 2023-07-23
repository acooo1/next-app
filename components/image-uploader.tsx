import { CldUploadWidget as CloudUpload } from 'next-cloudinary';
import Image from 'next/image';

import { ImagePlusIcon, TrashIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import useIsMounted from '@/hooks/use-is-mounted';

type ImageUploaderProps = {
  disabled?: boolean;
  onChange: (url: string) => void;
  onRemove: (url: string) => void;
  urls: string[];
};

export default function ImageUploader({
  disabled,
  onChange,
  onRemove,
  urls,
}: ImageUploaderProps) {
  const isMounted = useIsMounted();

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div>
      <div className='mb-4 flex items-center gap-4'>
        {urls.map((url, i) => (
          <div
            key={url}
            className='relative h-[200px] w-[200px] overflow-hidden rounded-md'
          >
            <Button
              className='absolute right-2 top-2 z-10'
              type='button'
              size='icon'
              variant='destructive'
              onClick={() => onRemove(url)}
            >
              <TrashIcon className='h-4 w-4' />
              <span className='sr-only'>Delete image</span>
            </Button>
            <Image
              className='rounded-md object-cover'
              src={url}
              alt={`Image ${i}`}
              fill
              placeholder='empty'
            />
          </div>
        ))}
      </div>
      <CloudUpload onUpload={onUpload} uploadPreset='iypbpqro'>
        {({ open }) => {
          const onClick = () => {
            open();
          };
          return (
            <Button
              type='button'
              variant='secondary'
              disabled={disabled}
              onClick={onClick}
            >
              <ImagePlusIcon className='mr-2 h-4 w-4' />
              Upload an image
            </Button>
          );
        }}
      </CloudUpload>
    </div>
  );
}
