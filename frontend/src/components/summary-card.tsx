import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

type SummaryCardProps = {
  label: string;
  value: string | null;
  description: string;
};

export const SummaryCard = ({
  label,
  value,
  description,
}: SummaryCardProps) => {
  return (
    <Card>
      <CardHeader className='pb-2'>
        <CardDescription>{label}</CardDescription>
        <CardTitle className='text-3xl' aria-live='polite'>
          {value}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className='text-sm text-muted-foreground'>{description}</p>
      </CardContent>
    </Card>
  );
};
