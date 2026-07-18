import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, Loader2 } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const createPowerPlantSchema = z.object({
  companyId: z.string().min(1, 'Power company is required'),

  plantId: z
    .string()
    .trim()
    .min(1, 'Plant ID is required')
    .max(50, 'Plant ID cannot exceed 50 characters'),

  initialBuildCost: z.number().min(0, 'Initial build cost cannot be negative'),

  recurringGenerationCost: z
    .number()
    .min(0, 'Generation cost cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type CreatePowerPlantForm = z.infer<typeof createPowerPlantSchema>;

interface PowerCompany {
  id: string;
  longName: string;
  shortName: string;
}

interface CreatePowerPlantRequest {
  plantId: string;
  initialBuildCost: number;
  recurringGenerationCost: number;
  location: {
    x: number;
    y: number;
  };
}

interface ApiErrorResponse {
  message?: string;
  details?: string;
}

const CreatePowerPlant = () => {
  const navigate = useNavigate();

  const [powerCompanies, setPowerCompanies] = useState<PowerCompany[]>([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePowerPlantForm>({
    resolver: zodResolver(createPowerPlantSchema),
    defaultValues: {
      companyId: '',
      plantId: '',
      initialBuildCost: 0,
      recurringGenerationCost: 0,
      x: 0,
      y: 0,
    },
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

    return () => {
      controller.abort();
    };
  }, []);

  const onSubmit = async (values: CreatePowerPlantForm) => {
    setFormError(null);

    const request: CreatePowerPlantRequest = {
      plantId: values.plantId,
      initialBuildCost: values.initialBuildCost,
      recurringGenerationCost: values.recurringGenerationCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const response = await fetch(
        `/api/companies/${values.companyId}/plants`,
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
            `Failed to create power plant: ${response.status}`,
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

  const powerCompanyOptions = powerCompanies.map((company) => ({
    value: company.id,
    label: `${company.longName} (${company.shortName})`,
  }));

  return (
    <div className='mx-auto w-full max-w-2xl py-4'>
      <div className='mb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create Power Plant
        </h1>

        <p className='mt-2 text-muted-foreground'>
          Add a new power plant to a power company.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className='px-8 pb-6 pt-8'>
            <CardTitle>Power Plant Information</CardTitle>

            <CardDescription className='mt-1'>
              Select the owning company and enter the plant details.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-7 px-8 pb-8'>
            {formError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />

                <AlertTitle>Unable to create power plant</AlertTitle>

                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            {companiesError && (
              <Alert variant='destructive'>
                <AlertCircle className='size-4' />

                <AlertTitle>Unable to load power companies</AlertTitle>

                <AlertDescription>{companiesError}</AlertDescription>
              </Alert>
            )}

            <div className='space-y-3'>
              <Label htmlFor='companyId'>Power company</Label>

              <Controller
                name='companyId'
                control={control}
                render={({ field }) => (
                  <Select
                    items={powerCompanyOptions}
                    value={field.value}
                    onValueChange={field.onChange}
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

              {!companiesLoading &&
                !companiesError &&
                powerCompanies.length === 0 && (
                  <p className='text-sm text-muted-foreground'>
                    Create a power company before creating a power plant.
                  </p>
                )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='plantId'>Plant ID</Label>

              <Input
                id='plantId'
                className='h-11'
                placeholder='PLANT-001'
                aria-invalid={Boolean(errors.plantId)}
                {...register('plantId')}
              />

              <p className='text-sm text-muted-foreground'>
                The plant ID must be unique within the selected company.
              </p>

              {errors.plantId && (
                <p className='text-sm text-destructive'>
                  {errors.plantId.message}
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
                    placeholder='1000000.00'
                    aria-invalid={Boolean(errors.initialBuildCost)}
                    {...register('initialBuildCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {errors.initialBuildCost && (
                  <p className='text-sm text-destructive'>
                    {errors.initialBuildCost.message}
                  </p>
                )}
              </div>

              <div className='space-y-3'>
                <Label htmlFor='recurringGenerationCost'>
                  Generation cost per kWh
                </Label>

                <div className='relative'>
                  <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                    $
                  </span>

                  <Input
                    id='recurringGenerationCost'
                    type='number'
                    min='0'
                    step='0.0001'
                    className='h-11 pl-8'
                    placeholder='0.0500'
                    aria-invalid={Boolean(errors.recurringGenerationCost)}
                    {...register('recurringGenerationCost', {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                {errors.recurringGenerationCost && (
                  <p className='text-sm text-destructive'>
                    {errors.recurringGenerationCost.message}
                  </p>
                )}
              </div>
            </div>

            <div className='space-y-4 pt-1'>
              <div className='space-y-1'>
                <Label>Location</Label>

                <p className='text-sm text-muted-foreground'>
                  Position of the power plant on the simulation grid.
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
                Boolean(companiesError) ||
                powerCompanies.length === 0
              }
            >
              {isSubmitting && <Loader2 className='size-4 animate-spin' />}

              {isSubmitting ? 'Creating...' : 'Create Power Plant'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePowerPlant;
