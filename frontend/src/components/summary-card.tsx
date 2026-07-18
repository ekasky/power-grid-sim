import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link } from 'react-router-dom';

type SummaryCardProps = {
  label: string;
  value: string | null;
  description: string;
  to: string;
};

export const SummaryCard = ({
  label,
  value,
  description,
  to,
}: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardDescription>{label}</CardDescription>
        <CardTitle className='text-3xl' aria-live='polite'>
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent className='flex flex-1 flex-col justify-between gap-4'>
        <p className='text-sm text-muted-foreground'>{description}</p>

        <Button
          variant='outline'
          size='sm'
          className='w-full'
          render={<Link to={to} />}
        >
          View
        </Button>
      </CardContent>
    </Card>
  );
};
