import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';
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
import { usePowerCompanies } from '@/hooks/use-power-companies';
import { usePowerPlants } from '@/hooks/use-power-plants';
import { AlertError } from '@/components/alert-error';
import { SelectPowerCompany } from '@/components/select-power-company';
import { SelectPowerPlants } from '@/components/select-power-plant';
import {
  createPowerSubstation,
  type CreatePowerSubstationRequest,
} from '@/api/power-substations';

const createPowerSubstationSchema = z.object({
  substationId: z
    .string()
    .trim()
    .min(1, 'Substation ID is required')
    .max(50, 'Substation ID cannot exceed 50 characters'),

  initialBuildCost: z
    .number()
    .min(0, 'Initial installation cost cannot be negative'),

  recurringMaintenanceCost: z
    .number()
    .min(0, 'Recurring maintenance cost cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type CreatePowerSubstationForm = z.infer<typeof createPowerSubstationSchema>;

const CreatePowerSubstation = () => {
  const navigate = useNavigate();

  const powerCompaniesState = usePowerCompanies();
  const powerPlantsState = usePowerPlants(
    powerCompaniesState.selectedPowerCompanyId,
  );

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePowerSubstationForm>({
    resolver: zodResolver(createPowerSubstationSchema),
    defaultValues: {
      substationId: '',
      initialBuildCost: 0,
      recurringMaintenanceCost: 0,
      x: 0,
      y: 0,
    },
  });

  const onSubmit = async (values: CreatePowerSubstationForm) => {
    const powerPlantId = powerPlantsState.selectedPowerPlantId;

    if (!powerPlantId) {
      setSubmitError('Select a power plant before creating a new subsation.');
      return;
    }

    const request: CreatePowerSubstationRequest = {
      substationId: values.substationId.trim(),
      initialBuildCost: values.initialBuildCost,
      recurringMaintenanceCost: values.recurringMaintenanceCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      setSubmitError(null);
      await createPowerSubstation(powerPlantId, request);

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create substation',
      );
    }
  };

  const isLoadingHierarchy =
    powerCompaniesState.isLoadingPowerCompanies ||
    powerPlantsState.isLoadingPowerPlants;

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
            {submitError && (
              <AlertError
                title='Unable to create substation'
                error={submitError}
              />
            )}

            {powerCompaniesState.powerCompanyError && (
              <AlertError
                title='Unable to load companies'
                error={powerCompaniesState.powerCompanyError}
              />
            )}

            {powerPlantsState.powerPlantError && (
              <AlertError
                title='Unable to load power plants'
                error={powerPlantsState.powerPlantError}
              />
            )}

            <div className='space-y-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <SelectPowerCompany
                  {...powerCompaniesState}
                  isSubmitting={isSubmitting}
                />

                <SelectPowerPlants
                  {...powerPlantsState}
                  isSubmitting={isSubmitting}
                />
              </div>
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
                !powerCompaniesState.selectedPowerCompanyId ||
                isLoadingHierarchy ||
                powerPlantsState.powerPlants.length === 0
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
