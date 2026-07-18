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

const createTransformerSchema = z.object({
  companyId: z.string().min(1, 'Power company is required'),

  powerPlantId: z.string().min(1, 'Power plant is required'),

  substationId: z.string().min(1, 'Power substation is required'),

  transformerId: z
    .string()
    .trim()
    .min(1, 'Transformer ID is required')
    .max(50, 'Transformer ID cannot exceed 50 characters'),

  initialInstallationCost: z
    .number()
    .min(0, 'Installation cost cannot be negative'),

  recurringMaintenanceCost: z
    .number()
    .min(0, 'Maintenance cost cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type CreateTransformerForm = z.infer<typeof createTransformerSchema>;

interface PowerCompany {
  id: string;
  longName: string;
  shortName: string;
}

interface PowerPlant {
  id: string;
  plantId: string;
}

interface PowerSubstation {
  id: string;
  substationId: string;
}

interface CreateTransformerRequest {
  transformerId: string;
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

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === 'AbortError';

const CreateTransformer = () => {
  const navigate = useNavigate();

  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [powerPlants, setPowerPlants] = useState<PowerPlant[]>([]);
  const [powerSubstations, setPowerSubstations] = useState<PowerSubstation[]>(
    [],
  );

  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [plantsLoading, setPlantsLoading] = useState(false);
  const [substationsLoading, setSubstationsLoading] = useState(false);

  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [plantsError, setPlantsError] = useState<string | null>(null);
  const [substationsError, setSubstationsError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransformerForm>({
    resolver: zodResolver(createTransformerSchema),
    defaultValues: {
      companyId: '',
      powerPlantId: '',
      substationId: '',
      transformerId: '',
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

  const selectedPowerPlantId = useWatch({
    control,
    name: 'powerPlantId',
  });

  useEffect(() => {
    const controller = new AbortController();

    const getPowerCompanies = async () => {
      try {
        const response = await fetch('/api/companies', {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Failed to retrieve power companies: ${response.status}`,
          );
        }

        const data: PowerCompany[] = await response.json();

        if (!controller.signal.aborted) {
          setPowerCompanies(data);
          setCompaniesError(null);
        }
      } catch (error: unknown) {
        if (isAbortError(error)) {
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

    return () => {
      controller.abort();
    };
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
          setPlantsError(null);
        }
      } catch (error: unknown) {
        if (isAbortError(error)) {
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

  useEffect(() => {
    if (!selectedPowerPlantId) {
      return;
    }

    const controller = new AbortController();

    const getPowerSubstations = async () => {
      try {
        const response = await fetch(
          `/api/plants/${selectedPowerPlantId}/substations`,
          {
            signal: controller.signal,
          },
        );

        if (!response.ok) {
          throw new Error(
            `Failed to retrieve power substations: ${response.status}`,
          );
        }

        const data: PowerSubstation[] = await response.json();

        if (!controller.signal.aborted) {
          setPowerSubstations(data);
          setSubstationsError(null);
        }
      } catch (error: unknown) {
        if (isAbortError(error)) {
          return;
        }

        console.error(error);

        setSubstationsError(
          error instanceof Error
            ? error.message
            : 'Unable to load power substations',
        );
      } finally {
        if (!controller.signal.aborted) {
          setSubstationsLoading(false);
        }
      }
    };

    void getPowerSubstations();

    return () => {
      controller.abort();
    };
  }, [selectedPowerPlantId, selectedCompanyId]);

  const companyOptions = powerCompanies.map((company) => ({
    value: company.id,
    label: company.longName,
  }));

  const plantOptions = powerPlants.map((plant) => ({
    value: plant.id,
    label: plant.plantId,
  }));

  const substationOptions = powerSubstations.map((substation) => ({
    value: substation.id,
    label: substation.substationId,
  }));

  const onSubmit = async (values: CreateTransformerForm) => {
    setFormError(null);

    const request: CreateTransformerRequest = {
      transformerId: values.transformerId,
      initialInstallationCost: values.initialInstallationCost,
      recurringMaintenanceCost: values.recurringMaintenanceCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const response = await fetch(
        `/api/substations/${values.substationId}/transformers`,
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
            `Failed to create transformer: ${response.status}`,
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
          Create Transformer
        </h1>

        <p className='mt-2 text-muted-foreground'>
          Add a transformer to an existing power substation.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className='px-8 pb-6 pt-8'>
            <CardTitle>Transformer Information</CardTitle>

            <CardDescription>
              Select the company, power plant, and substation before entering
              the transformer details.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-7 px-8 pb-8'>
            {formError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertTitle>Unable to create transformer</AlertTitle>
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

            {substationsError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />
                <AlertTitle>Unable to load substations</AlertTitle>
                <AlertDescription>{substationsError}</AlertDescription>
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
                      setValue('substationId', '');

                      setPowerPlants([]);
                      setPowerSubstations([]);

                      setPlantsError(null);
                      setSubstationsError(null);

                      setPlantsLoading(true);
                      setSubstationsLoading(false);
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
                    onValueChange={(powerPlantId) => {
                      field.onChange(powerPlantId);

                      setValue('substationId', '');
                      setPowerSubstations([]);
                      setSubstationsError(null);
                      setSubstationsLoading(true);
                    }}
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
            </div>

            <div className='space-y-3'>
              <Label htmlFor='substationId'>Power substation</Label>

              <Controller
                name='substationId'
                control={control}
                render={({ field }) => (
                  <Select
                    items={substationOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={
                      !selectedPowerPlantId ||
                      substationsLoading ||
                      Boolean(substationsError) ||
                      powerSubstations.length === 0
                    }
                  >
                    <SelectTrigger
                      id='substationId'
                      className='h-11 w-full'
                      aria-invalid={Boolean(errors.substationId)}
                    >
                      <SelectValue
                        placeholder={
                          !selectedPowerPlantId
                            ? 'Select a power plant first'
                            : substationsLoading
                              ? 'Loading substations...'
                              : powerSubstations.length === 0
                                ? 'No substations available'
                                : 'Select a power substation'
                        }
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {powerSubstations.map((substation) => (
                        <SelectItem key={substation.id} value={substation.id}>
                          {substation.substationId}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              {errors.substationId && (
                <p className='text-sm text-destructive'>
                  {errors.substationId.message}
                </p>
              )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='transformerId'>Transformer ID</Label>

              <Input
                id='transformerId'
                className='h-11'
                placeholder='TRANSFORMER-001'
                aria-invalid={Boolean(errors.transformerId)}
                {...register('transformerId')}
              />

              <p className='text-sm text-muted-foreground'>
                Must be unique within the selected substation.
              </p>

              {errors.transformerId && (
                <p className='text-sm text-destructive'>
                  {errors.transformerId.message}
                </p>
              )}
            </div>

            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-3'>
                <Label htmlFor='installCost'>Installation cost</Label>

                <div className='relative'>
                  <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    $
                  </span>

                  <Input
                    id='installCost'
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
                  Position of the transformer on the simulation grid.
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
                plantsLoading ||
                substationsLoading ||
                !selectedCompanyId ||
                !selectedPowerPlantId ||
                powerSubstations.length === 0
              }
            >
              {isSubmitting && <Loader2 className='size-4 animate-spin' />}

              {isSubmitting ? 'Creating...' : 'Create Transformer'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateTransformer;
