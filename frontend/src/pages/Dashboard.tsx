import { SummaryCard } from '@/components/summary-card';
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
import { RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CountResponse {
  count: number;
}

const Dashboard = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [powerCompanyCount, setPowerCompanyCount] = useState<number | null>(
    null,
  );
  const [powerCompanyError, setPowerCompanyError] = useState<boolean>(false);

  const [powerPlantCount, setPowerPlantCount] = useState<number | null>(null);
  const [powerPlantError, setPowerPlantError] = useState<boolean>(false);

  const [powerSubstationCount, setPowerSubstationCount] = useState<
    number | null
  >(null);
  const [powerSubstationError, setPowerSubstationError] =
    useState<boolean>(false);

  const [transformerCount, setTransformerCount] = useState<number | null>(null);
  const [transformerError, setTransformerError] = useState<boolean>(false);

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

    const getPowerSubstationCount = async () => {
      try {
        setPowerSubstationError(false);

        const response = await fetch('/api/substations/count', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrive power substation count: ${response.status}`,
          );
        }

        const data: CountResponse = await response.json();
        setPowerSubstationCount(data.count);
      } catch (error: unknown) {
        console.error(error);
        setPowerSubstationError(true);
      }
    };

    const getTransformerCount = async () => {
      try {
        setTransformerError(false);

        const response = await fetch('/api/transformers/count', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrive transformer count: ${response.status}`,
          );
        }

        const data: CountResponse = await response.json();
        setTransformerCount(data.count);
      } catch (error: unknown) {
        console.error(error);
        setTransformerError(true);
      }
    };

    const loadSummaryCounts = async () => {
      setIsRefreshing(true);

      await Promise.all([
        getPowerCompanyCount(),
        getPowerPlantCount(),
        getPowerSubstationCount(),
        getTransformerCount(),
      ]);

      if (!controller.signal.aborted) {
        setIsRefreshing(false);
      }
    };

    loadSummaryCounts();

    return () => {
      controller.abort();
    };
  }, [refreshKey]);

  const summaryCards = [
    {
      label: 'Power Companies',
      value: powerCompanyError
        ? 'Error'
        : powerCompanyCount === null
          ? '--'
          : powerCompanyCount.toString(),
      description: 'Companies in the simulation',
      to: '/power-companies',
    },
    {
      label: 'Power Plants',
      value: powerPlantError
        ? 'Error'
        : powerPlantCount === null
          ? '--'
          : powerPlantCount.toString(),
      description: 'Power generation facilities',
      to: '/power-plants',
    },
    {
      label: 'Substations',
      value: powerSubstationError
        ? 'Error'
        : powerSubstationCount === null
          ? '--'
          : powerSubstationCount.toString(),
      description: 'Connected distribution substations',
      to: '/substations',
    },
    {
      label: 'Transformers',
      value: transformerError
        ? 'Error'
        : transformerCount === null
          ? '--'
          : transformerCount.toString(),
      description: 'Customer transformers',
      to: '/transformers',
    },
  ];

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>

          <p className='text-muted-foreground'>
            View the current state of the power grid simulator.
          </p>
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={() => setRefreshKey((current) => current + 1)}
          disabled={isRefreshing}
        >
          <RefreshCw
            className={`size-4 ${isRefreshing ? 'animate-spin' : ''}`}
          />

          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {summaryCards.map((card) => (
          <SummaryCard
            label={card.label}
            value={card.value}
            description={card.description}
            to={card.to}
          />
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
