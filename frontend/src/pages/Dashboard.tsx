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
import { useEffect, useState } from 'react';

interface CountResponse {
  count: number;
}

const Dashboard = () => {
  const [powerCompanyCount, setPowerCompanyCount] = useState<number | null>(
    null,
  );
  const [powerCompanyError, setPowerCompanyError] = useState<boolean>(false);

  const [powerPlantCount, setPowerPlantCount] = useState<number | null>(null);
  const [powerPlantError, setPowerPlantError] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const getPowerCompanyCount = async () => {
      try {
        setPowerCompanyError(false);

        const response = await fetch('/api/companies/count', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrieve power company count: ${response.status}`,
          );
        }

        const data: CountResponse = await response.json();

        setPowerCompanyCount(data.count);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);
        setPowerCompanyError(true);
      }
    };

    const getPowerPlantCount = async () => {
      try {
        setPowerPlantError(false);

        const response = await fetch('/api/plants/count', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrive power plant count: ${response.status}`,
          );
        }

        const data: CountResponse = await response.json();
        setPowerPlantCount(data.count);
      } catch (error: unknown) {
        console.error(error);
        setPowerPlantError(true);
      }
    };

    getPowerCompanyCount();
    getPowerPlantCount();

    return () => {
      controller.abort();
    };
  }, []);

  const summaryCards = [
    {
      label: 'Power Companies',
      value: powerCompanyError
        ? 'Error'
        : powerCompanyCount === null
          ? '--'
          : powerCompanyCount.toString(),
      description: 'Companies in the simulation',
    },
    {
      label: 'Power Plants',
      value: powerPlantError
        ? 'Error'
        : powerPlantCount === null
          ? '--'
          : powerPlantCount.toString(),
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
