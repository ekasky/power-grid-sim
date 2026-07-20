import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface FormErrorProps {
  title: string;
  error: string | null;
}

export const FormError = ({ title, error }: FormErrorProps) => {
  return (
    <Alert variant='destructive'>
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};
