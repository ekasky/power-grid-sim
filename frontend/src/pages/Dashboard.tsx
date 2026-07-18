import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const summaryCards = [
  {
    label: 'Power Companies',
    value: '--',
    description: 'Companies in the simulation',
  },
  {
    label: 'Power Plants',
    value: '--',
    description: 'Power generation facilities',
  },
  {
    label: 'Substations',
    value: '--',
    description: 'Connected distribution substations',
  },
  {
    label: 'Transformers',
    value: '--',
    description: 'Customer transformers',
  },
];

const Dashboard = () => {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
        <p className='text-muted-foreground'>
          View the current state of the power grid simulator.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {summaryCards.map((card) => (
          <Card key={card.label}>
            <CardHeader className='pb-2'>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className='text-3xl'>{card.value}</CardTitle>
            </CardHeader>

            <CardContent>
              <p className='text-sm text-muted-foreground'>
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div className='space-y-1'>
            <CardTitle>Simulation Status</CardTitle>

            <CardDescription>
              Current billing-cycle totals and simulation state.
            </CardDescription>
          </div>

          <Button type='button'>Run Billing Cycle</Button>
        </CardHeader>

        <Separator />

        <CardContent className='pt-6'>
          <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Status</p>
              <Badge variant='secondary'>Not started</Badge>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>
                Current billing cycle
              </p>
              <p className='text-lg font-semibold'>--</p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Power produced</p>
              <p className='text-lg font-semibold'>-- kWh</p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Power consumed</p>
              <p className='text-lg font-semibold'>-- kWh</p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Total revenue</p>
              <p className='text-lg font-semibold'>$--</p>
            </div>

            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>Total costs</p>
              <p className='text-lg font-semibold'>$--</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
