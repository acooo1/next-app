import useIsMounted from '@/hooks/use-is-mounted';

export default function useOrigin() {
  const isMounted = useIsMounted();

  const origin =
    typeof window !== 'undefined' && window.location.origin
      ? window.location.origin
      : '';

  if (!isMounted) {
    return '';
  }

  return origin;
}
