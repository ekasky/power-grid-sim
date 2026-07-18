import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Loader2 } from 'lucide-react';
import { z } from 'zod';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createPowerSubstationSchema = z.object({
  companyId: z.string().min(1, 'Power company is required'),

  powerPlantId: z.string().min(1, 'Power plant is required'),

  substationId: z
    .string()
    .trim()
    .min(1, 'Substation ID is required')
    .max(50, 'Substation ID cannot exceed 50 characters'),

  initialInstallationCost: z
    .number()
    .min(0, 'Initial installation cost cannot be negative'),

  recurringMaintenanceCost: z
    .number()
    .min(0, 'Recurring maintenance cost cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type CreatePowerSubstationForm = z.infer<typeof createPowerSubstationSchema>;

interface PowerCompany {
  id: string;
  longName: string;
  shortName: string;
}

interface PowerPlant {
  id: string;
  plantId: string;
}

interface CreatePowerSubstationRequest {
  substationId: string;
  initialInstallationCost: number;
  recurringMaintenanceCost: number;
  location: {
    x: number;
    y: number;
  };
}

interface ApiErrorResponse {
  message?: string;
  details?: string;
}

const CreatePowerSubstation = () => {
  const navigate = useNavigate();

  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);

  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(false);

  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [plantsError, setPlantsError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreatePowerSubstationForm>({
    resolver: zodResolver(createPowerSubstationSchema),
    defaultValues: {
      companyId: '',
      powerPlantId: '',
      substationId: '',
      initialInstallationCost: 0,
      recurringMaintenanceCost: 0,
      x: 0,
      y: 0,
    },
  });

  const selectedCompanyId = useWatch({
    control,
    name: 'companyId',
  });

  useEffect(() => {
    const controller = new AbortController();

    const getPowerCompanies = async () => {
      try {
        setCompaniesLoading(true);
        setCompaniesError(null);

        const response = await fetch('/api/companies', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrieve power companies: ${response.status}`,
          );
        }

        const data: PowerCompany[] = await response.json();
        setPowerCompanies(data);
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        setCompaniesError(
          error instanceof Error
            ? error.message
            : 'Unable to load power companies',
        );
      } finally {
        if (!controller.signal.aborted) {
          setCompaniesLoading(false);
        }
      }
    };

    void getPowerCompanies();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) {
      return;
    }

    const controller = new AbortController();

    const getPowerPlants = async () => {
      try {
        const response = await fetch(
          `/api/companies/${selectedCompanyId}/plants`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to retrieve power plants: ${response.status}`,
          );
        }

        const data: PowerPlant[] = await response.json();

        if (!controller.signal.aborted) {
          setPowerPlants(data);
        }
      } catch (error: unknown) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        console.error(error);

        setPlantsError(
          error instanceof Error
            ? error.message
            : 'Unable to load power plants',
        );
      } finally {
        if (!controller.signal.aborted) {
          setPlantsLoading(false);
        }
      }
    };

    void getPowerPlants();

    return () => {
      controller.abort();
    };
  }, [selectedCompanyId]);

  const companyOptions = powerCompanies.map((company) => ({
    value: company.id,
    label: company.longName,
  }));

  const plantOptions = powerPlants.map((plant) => ({
    value: plant.id,
    label: plant.plantId,
  }));

  const onSubmit = async (values: CreatePowerSubstationForm) => {
    setFormError(null);

    const request: CreatePowerSubstationRequest = {
      substationId: values.substationId,
      initialInstallationCost: values.initialInstallationCost,
      recurringMaintenanceCost: values.recurringMaintenanceCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const response = await fetch(
        `/api/plants/${values.powerPlantId}/substations`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(request),
        },
      );

      if (!response.ok) {
        const errorBody = (await response
          .json()
          .catch(() => null)) as ApiErrorResponse | null;

        throw new Error(
          errorBody?.message ??
            errorBody?.details ??
            `Failed to create power substation: ${response.status}`,
        );
      }

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      setFormError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  };

  return (
    <div className='mx-auto w-full max-w-2xl py-4'>
      <div className='mb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create Power Substation
        </h1>

        <p className='mt-2 text-muted-foreground'>
          Add a new substation to an existing power plant.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className='px-8 pb-6 pt-8'>
            <CardTitle>Substation Information</CardTitle>

            <CardDescription>
              Select the owning company and power plant, then enter the
              substation details.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-7 px-8 pb-8'>
            {formError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertTitle>Unable to create substation</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {companiesError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertTitle>Unable to load companies</AlertTitle>
                <AlertDescription>{companiesError}</AlertDescription>
              </Alert>
            )}

            {plantsError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertTitle>Unable to load power plants</AlertTitle>
                <AlertDescription>{plantsError}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-3'>
              <Label htmlFor='companyId'>Power company</Label>

              <Controller
                name='companyId'
                control={control}
                render={({ field }) => (
                  <Select
                    items={companyOptions}
                    value={field.value}
                    onValueChange={(companyId) => {
                      field.onChange(companyId);

                      setValue('powerPlantId', '');
                      setPowerPlants([]);
                      setPlantsError(null);
                      setPlantsLoading(true);
                    }}
                    disabled={
                      companiesLoading ||
                      Boolean(companiesError) ||
                      powerCompanies.length === 0
                    }
                  >
                    <SelectTrigger
                      id='companyId'
                      className='h-11 w-full'
                      aria-invalid={Boolean(errors.companyId)}
                    >
                      <SelectValue
                        placeholder={
                          companiesLoading
                            ? 'Loading power companies...'
                            : powerCompanies.length === 0
                              ? 'No power companies available'
                              : 'Select a power company'
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {powerCompanies.map((company) => (
                        <SelectItem key={company.id} value={company.id}>
                          {company.longName} ({company.shortName})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.companyId && (
                <p className='text-sm text-destructive'>
                  {errors.companyId.message}
                </p>
              )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='powerPlantId'>Power plant</Label>

              <Controller
                name='powerPlantId'
                control={control}
                render={({ field }) => (
                  <Select
                    items={plantOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !selectedCompanyId ||
                      plantsLoading ||
                      Boolean(plantsError) ||
                      powerPlants.length === 0
                    }
                  >
                    <SelectTrigger
                      id='powerPlantId'
                      className='h-11 w-full'
                      aria-invalid={Boolean(errors.powerPlantId)}
                    >
                      <SelectValue
                        placeholder={
                          !selectedCompanyId
                            ? 'Select a power company first'
                            : plantsLoading
                              ? 'Loading power plants...'
                              : powerPlants.length === 0
                                ? 'No power plants available'
                                : 'Select a power plant'
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {powerPlants.map((plant) => (
                        <SelectItem key={plant.id} value={plant.id}>
                          {plant.plantId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.powerPlantId && (
                <p className='text-sm text-destructive'>
                  {errors.powerPlantId.message}
                </p>
              )}

              {selectedCompanyId &&
                !plantsLoading &&
                !plantsError &&
                powerPlants.length === 0 && (
                  <p className='text-sm text-muted-foreground'>
                    The selected company does not have any power plants.
                  </p>
                )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='substationId'>Substation ID</Label>

              <Input
                id='substationId'
                className='h-11'
                placeholder='SUBSTATION-001'
                aria-invalid={Boolean(errors.substationId)}
                {...register('substationId')}
              />

              {errors.substationId && (
                <p className='text-sm text-destructive'>
                  {errors.substationId.message}
                </p>
              )}
            </div>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-3'>
                <Label htmlFor='initialBuildCost'>Initial build cost</Label>

                <div className='relative'>
                  <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    $
                  </span>

                  <Input
                    id='initialBuildCost'
                    type='number'
                    min='0'
                    step='0.01'
                    className='h-11 pl-8'
                    aria-invalid={Boolean(errors.initialInstallationCost)}
                    {...register('initialInstallationCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {errors.initialInstallationCost && (
                  <p className='text-sm text-destructive'>
                    {errors.initialInstallationCost.message}
                  </p>
                )}
              </div>

              <div className='space-y-3'>
                <Label htmlFor='maintenanceCost'>Maintenance cost</Label>

                <div className='relative'>
                  <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    $
                  </span>

                  <Input
                    id='maintenanceCost'
                    type='number'
                    min='0'
                    step='0.01'
                    className='h-11 pl-8'
                    aria-invalid={Boolean(errors.recurringMaintenanceCost)}
                    {...register('recurringMaintenanceCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {errors.recurringMaintenanceCost && (
                  <p className='text-sm text-destructive'>
                    {errors.recurringMaintenanceCost.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <Label>Location</Label>

                <p className='text-sm text-muted-foreground'>
                  Position of the substation on the simulation grid.
                </p>
              </div>

              <div className='grid gap-6 sm:grid-cols-2'>
                <div className='space-y-3'>
                  <Label htmlFor='x'>X coordinate</Label>

                  <Input
                    id='x'
                    type='number'
                    step='1'
                    className='h-11'
                    aria-invalid={Boolean(errors.x)}
                    {...register('x', {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.x && (
                    <p className='text-sm text-destructive'>
                      {errors.x.message}
                    </p>
                  )}
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='y'>Y coordinate</Label>

                  <Input
                    id='y'
                    type='number'
                    step='1'
                    className='h-11'
                    aria-invalid={Boolean(errors.y)}
                    {...register('y', {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.y && (
                    <p className='text-sm text-destructive'>
                      {errors.y.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className='justify-end gap-3 border-t px-8 py-6'>
            <Button
              type='button'
              variant='outline'
              disabled={isSubmitting}
              onClick={() => navigate('/')}
            >
              Cancel
            </Button>

            <Button
              type='submit'
              disabled={
                isSubmitting ||
                companiesLoading ||
                !selectedCompanyId ||
                plantsLoading ||
                powerPlants.length === 0
              }
            >
              {isSubmitting && <Loader2 className='size-4 animate-spin' />}

              {isSubmitting ? 'Creating...' : 'Create Power Substation'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePowerSubstation;
