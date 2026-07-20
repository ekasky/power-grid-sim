import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertError } from '@/components/alert-error';
import { usePowerCompanies } from '@/hooks/use-power-companies';
import { SelectPowerCompany } from '@/components/select-power-company';
import {
  createPowerPlant,
  type CreatePowerPlantRequest,
} from '@/api/power-plants';

const createPowerPlantSchema = z.object({
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

const CreatePowerPlant = () => {
  const navigate = useNavigate();

  const powerCompaniesState = usePowerCompanies();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePowerPlantForm>({
    resolver: zodResolver(createPowerPlantSchema),
    defaultValues: {
      plantId: '',
      initialBuildCost: 0,
      recurringGenerationCost: 0,
      x: 0,
      y: 0,
    },
  });

  const onSubmit = async (values: CreatePowerPlantForm) => {
    const powerCompanyId = powerCompaniesState.selectedPowerCompanyId;

    if (!powerCompanyId) {
      setSubmitError(
        'Select a power company before creating a new power plant.',
      );
      return;
    }

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
      setSubmitError(null);
      await createPowerPlant(powerCompanyId, request);

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create power plant',
      );
    }
  };

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
            {submitError && (
              <AlertError
                title='Unable to create power plant'
                error={submitError}
              />
            )}

            {powerCompaniesState.powerCompanyError && (
              <AlertError
                title='Unable to load power companies'
                error={powerCompaniesState.powerCompanyError}
              />
            )}

            <div className='space-y-4'>
              <SelectPowerCompany
                {...powerCompaniesState}
                isSubmitting={isSubmitting}
              />
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
                powerCompaniesState.isLoadingPowerCompanies ||
                Boolean(powerCompaniesState.powerCompanyError) ||
                powerCompaniesState.powerCompanies.length === 0
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
