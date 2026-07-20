interface EmptyMessageProps {
  message: string;
}

export const EmptyMessage = ({ message }: EmptyMessageProps) => (
  <div className='flex min-h-48 items-center justify-center text-muted-foreground'>
    {message}
  </div>
);
