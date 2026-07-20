import { Loader2 } from 'lucide-react';

interface LoadingMessageProps {
  message: string;
}

export const LoadingMessage = ({ message }: LoadingMessageProps) => (
  <div className='flex min-h-48 items-center justify-center gap-2 text-muted-foreground'>
    <Loader2 className='size-5 animate-spin' />
    {message}
  </div>
);
