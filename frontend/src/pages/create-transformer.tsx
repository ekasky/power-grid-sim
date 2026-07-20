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
import { useSubstation } from '@/hooks/use-substation';
import { AlertError } from '@/components/alert-error';
import { SelectPowerCompany } from '@/components/select-power-company';
import { SelectPowerPlants } from '@/components/select-power-plant';
import { SelectSubstation } from '@/components/select-substation';
import {
  createTransformer,
  type CreateTransformerRequest,
} from '@/api/transformers';

const createTransformerSchema = z.object({
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

const CreateTransformer = () => {
  const navigate = useNavigate();

  const powerCompaniesState = usePowerCompanies();
  const powerPlantsState = usePowerPlants(
    powerCompaniesState.selectedPowerCompanyId,
  );
  const substationsState = useSubstation(powerPlantsState.selectedPowerPlantId);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransformerForm>({
    resolver: zodResolver(createTransformerSchema),
    defaultValues: {
      transformerId: '',
      initialInstallationCost: 0,
      recurringMaintenanceCost: 0,
      x: 0,
      y: 0,
    },
  });

  const onSubmit = async (values: CreateTransformerForm) => {
    const substationId = substationsState.selectedSubstationId;

    if (!substationId) {
      setSubmitError('Select a substation before creating a new transformer');
      return;
    }

    const request: CreateTransformerRequest = {
      transformerId: values.transformerId.trim(),
      initialInstallationCost: values.initialInstallationCost,
      recurringMaintenanceCost: values.recurringMaintenanceCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      setSubmitError(null);
      await createTransformer(substationId, request);

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      setSubmitError(
        error instanceof Error ? error.message : 'Unable to create transformer',
      );
    }
  };

  const isLoadingHierarchy =
    powerCompaniesState.isLoadingPowerCompanies ||
    powerPlantsState.isLoadingPowerPlants ||
    substationsState.isLoadingSubstations;

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
            {submitError && (
              <AlertError
                title='Unable to create transformer'
                error={submitError}
              />
            )}

            {powerCompaniesState.powerCompanyError && (
              <AlertError
                title='Unable to load power companies'
                error={powerCompaniesState.powerCompanyError}
              />
            )}

            {powerPlantsState.powerPlantError && (
              <AlertError
                title='Unable to load power plants'
                error={powerPlantsState.powerPlantError}
              />
            )}

            {substationsState.substationError && (
              <AlertError
                title='Unable to load substations'
                error={substationsState.substationError}
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

                <SelectSubstation
                  {...substationsState}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            <div className='space-y-4'>
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
                isLoadingHierarchy ||
                !substationsState.selectedSubstationId
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
