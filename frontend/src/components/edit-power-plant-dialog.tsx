import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { z } from 'zod';
import {
  updatePowerPlant,
  type PowerPlant,
  type UpdatePowerPlantRequest,
} from '@/api/power-plants';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const updatePowerPlantSchema = z.object({
  plantId: z
    .string()
    .trim()
    .min(1, 'Plant ID is required')
    .max(255, 'Plant ID cannot exceed 255 characters'),

  initialBuildCost: z.number().min(0, 'Initial build cost cannot be negative'),

  recurringGenerationCost: z
    .number()
    .min(0, 'Generation cost cannot be negative'),
});

type UpdatePowerPlantForm = z.infer<typeof updatePowerPlantSchema>;

interface EditPowerPlantDialogProps {
  plant: PowerPlant;
  onUpdated: (plant: PowerPlant) => void;
  disabled?: boolean;
}

export const EditPowerPlantDialog = ({
  plant,
  onUpdated,
  disabled = false,
}: EditPowerPlantDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePowerPlantForm>({
    resolver: zodResolver(updatePowerPlantSchema),
    defaultValues: {
      plantId: plant.plantId,
      initialBuildCost: Number(plant.initialBuildCost),
      recurringGenerationCost: Number(plant.recurringGenerationCost),
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormError(null);

      reset({
        plantId: plant.plantId,
        initialBuildCost: Number(plant.initialBuildCost),
        recurringGenerationCost: Number(plant.recurringGenerationCost),
      });
    }
  };

  const onSubmit = async (values: UpdatePowerPlantForm) => {
    setFormError(null);

    const request: UpdatePowerPlantRequest = {
      plantId: values.plantId,
      initialBuildCost: values.initialBuildCost,
      recurringGenerationCost: values.recurringGenerationCost,
    };

    try {
      const updatedPlant = await updatePowerPlant(plant.id, request);

      onUpdated(updatedPlant);
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to update the power plant',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            type='button'
            variant='outline'
            size='sm'
            disabled={disabled}
          />
        }
      >
        <Pencil className='size-4' />
        Edit
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Power Plant</DialogTitle>

          <DialogDescription>
            Update the information for {plant.plantId}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {formError && (
            <Alert variant='destructive'>
              <AlertTitle>Unable to update power plant</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor={`plantId-${plant.id}`}>Plant ID</Label>

            <Input
              id={`plantId-${plant.id}`}
              aria-invalid={Boolean(errors.plantId)}
              disabled={isSubmitting}
              {...register('plantId')}
            />

            {errors.plantId && (
              <p className='text-sm text-destructive'>
                {errors.plantId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`initialBuildCost-${plant.id}`}>
              Initial build cost
            </Label>

            <div className='relative'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>

              <Input
                id={`initialBuildCost-${plant.id}`}
                type='number'
                min='0'
                step='0.01'
                className='pl-8'
                aria-invalid={Boolean(errors.initialBuildCost)}
                disabled={isSubmitting}
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

          <div className='space-y-2'>
            <Label htmlFor={`recurringGenerationCost-${plant.id}`}>
              Recurring generation cost
            </Label>

            <div className='relative'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>

              <Input
                id={`recurringGenerationCost-${plant.id}`}
                type='number'
                min='0'
                step='0.0001'
                className='pl-8'
                aria-invalid={Boolean(errors.recurringGenerationCost)}
                disabled={isSubmitting}
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

          <DialogFooter>
            <Button
              type='button'
              variant='outline'
              disabled={isSubmitting}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 animate-spin' />}

              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
