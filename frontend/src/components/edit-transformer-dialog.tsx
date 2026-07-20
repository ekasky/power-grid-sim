import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { z } from 'zod';
import {
  updateTransformer,
  type Transformer,
  type UpdateTransformerRequest,
} from '@/api/transformers';
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

const updateTransformerSchema = z.object({
  transformerId: z
    .string()
    .trim()
    .min(1, 'Transformer ID is required')
    .max(255, 'Transformer ID cannot exceed 255 characters'),

  initialInstallationCost: z
    .number()
    .min(0, 'Initial installation cost cannot be negative'),

  recurringMaintenanceCost: z
    .number()
    .min(0, 'Recurring maintenance cost cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type UpdateTransformerForm = z.infer<typeof updateTransformerSchema>;

interface EditTransformerDialogProps {
  transformer: Transformer;
  onUpdated: (transformer: Transformer) => void;
  disabled?: boolean;
}

export const EditTransformerDialog = ({
  transformer,
  onUpdated,
  disabled = false,
}: EditTransformerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateTransformerForm>({
    resolver: zodResolver(updateTransformerSchema),
    defaultValues: {
      transformerId: transformer.transformerId,
      initialInstallationCost: Number(transformer.initialInstallationCost),
      recurringMaintenanceCost: Number(transformer.recurringMaintenanceCost),
      x: transformer.location.x,
      y: transformer.location.y,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormError(null);

      reset({
        transformerId: transformer.transformerId,
        initialInstallationCost: Number(transformer.initialInstallationCost),
        recurringMaintenanceCost: Number(transformer.recurringMaintenanceCost),
        x: transformer.location.x,
        y: transformer.location.y,
      });
    }
  };

  const onSubmit = async (values: UpdateTransformerForm) => {
    setFormError(null);

    const request: UpdateTransformerRequest = {
      transformerId: values.transformerId,
      initialInstallationCost: values.initialInstallationCost,
      recurringMaintenanceCost: values.recurringMaintenanceCost,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const updatedTransformer = await updateTransformer(
        transformer.id,
        request,
      );

      onUpdated(updatedTransformer);
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to update the transformer',
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
          <DialogTitle>Edit Transformer</DialogTitle>

          <DialogDescription>
            Update the information for {transformer.transformerId}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {formError && (
            <Alert variant='destructive'>
              <AlertTitle>Unable to update transformer</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor={`transformerId-${transformer.id}`}>
              Transformer ID
            </Label>

            <Input
              id={`transformerId-${transformer.id}`}
              aria-invalid={Boolean(errors.transformerId)}
              disabled={isSubmitting}
              {...register('transformerId')}
            />

            {errors.transformerId && (
              <p className='text-sm text-destructive'>
                {errors.transformerId.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`initialInstallationCost-${transformer.id}`}>
              Initial installation cost
            </Label>

            <div className='relative'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>

              <Input
                id={`initialInstallationCost-${transformer.id}`}
                type='number'
                min='0'
                step='0.0001'
                className='pl-8'
                aria-invalid={Boolean(errors.initialInstallationCost)}
                disabled={isSubmitting}
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

          <div className='space-y-2'>
            <Label htmlFor={`recurringMaintenanceCost-${transformer.id}`}>
              Recurring maintenance cost
            </Label>

            <div className='relative'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>

              <Input
                id={`recurringMaintenanceCost-${transformer.id}`}
                type='number'
                min='0'
                step='0.0001'
                className='pl-8'
                aria-invalid={Boolean(errors.recurringMaintenanceCost)}
                disabled={isSubmitting}
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

          <div className='space-y-3'>
            <div>
              <Label>Location</Label>

              <p className='text-sm text-muted-foreground'>
                Position of the transformer on the simulation grid.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor={`x-${transformer.id}`}>X coordinate</Label>

                <Input
                  id={`x-${transformer.id}`}
                  type='number'
                  step='1'
                  aria-invalid={Boolean(errors.x)}
                  disabled={isSubmitting}
                  {...register('x', {
                    valueAsNumber: true,
                  })}
                />

                {errors.x && (
                  <p className='text-sm text-destructive'>{errors.x.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`y-${transformer.id}`}>Y coordinate</Label>

                <Input
                  id={`y-${transformer.id}`}
                  type='number'
                  step='1'
                  aria-invalid={Boolean(errors.y)}
                  disabled={isSubmitting}
                  {...register('y', {
                    valueAsNumber: true,
                  })}
                />

                {errors.y && (
                  <p className='text-sm text-destructive'>{errors.y.message}</p>
                )}
              </div>
            </div>
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
