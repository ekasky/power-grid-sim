import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { z } from 'zod';

import {
  updatePowerCompany,
  type PowerCompany,
  type UpdatePowerCompanyRequest,
} from '@/api/power-companies';
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

const updatePowerCompanySchema = z.object({
  longName: z
    .string()
    .trim()
    .min(1, 'Company name is required')
    .max(255, 'Company name cannot exceed 255 characters'),

  shortName: z
    .string()
    .trim()
    .min(1, 'Short name is required')
    .max(20, 'Short name cannot exceed 20 characters'),

  standardRate: z.number().min(0, 'Standard rate cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type UpdatePowerCompanyForm = z.infer<typeof updatePowerCompanySchema>;

interface EditPowerCompanyDialogProps {
  company: PowerCompany;
  onUpdated: (company: PowerCompany) => void;
}

export const EditPowerCompanyDialog = ({
  company,
  onUpdated,
}: EditPowerCompanyDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePowerCompanyForm>({
    resolver: zodResolver(updatePowerCompanySchema),
    defaultValues: {
      longName: company.longName,
      shortName: company.shortName,
      standardRate: Number(company.standardRate),
      x: company.location.x,
      y: company.location.y,
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormError(null);

      reset({
        longName: company.longName,
        shortName: company.shortName,
        standardRate: Number(company.standardRate),
        x: company.location.x,
        y: company.location.y,
      });
    }
  };

  const onSubmit = async (values: UpdatePowerCompanyForm) => {
    setFormError(null);

    const request: UpdatePowerCompanyRequest = {
      longName: values.longName,
      shortName: values.shortName,
      standardRate: values.standardRate,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const updatedCompany = await updatePowerCompany(company.id, request);

      onUpdated(updatedCompany);
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to update the power company',
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={<Button type='button' variant='outline' size='sm' />}
      >
        <Pencil className='size-4' />
        Edit
      </DialogTrigger>

      <DialogContent className='sm:max-w-lg'>
        <DialogHeader>
          <DialogTitle>Edit Power Company</DialogTitle>

          <DialogDescription>
            Update the information for {company.longName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {formError && (
            <Alert variant='destructive'>
              <AlertTitle>Unable to update company</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className='space-y-2'>
            <Label htmlFor={`longName-${company.id}`}>Company name</Label>

            <Input
              id={`longName-${company.id}`}
              aria-invalid={Boolean(errors.longName)}
              {...register('longName')}
            />

            {errors.longName && (
              <p className='text-sm text-destructive'>
                {errors.longName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`shortName-${company.id}`}>Short name</Label>

            <Input
              id={`shortName-${company.id}`}
              aria-invalid={Boolean(errors.shortName)}
              {...register('shortName')}
            />

            {errors.shortName && (
              <p className='text-sm text-destructive'>
                {errors.shortName.message}
              </p>
            )}
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`standardRate-${company.id}`}>
              Standard rate per kWh
            </Label>

            <div className='relative'>
              <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                $
              </span>

              <Input
                id={`standardRate-${company.id}`}
                type='number'
                min='0'
                step='0.0001'
                className='pl-8'
                aria-invalid={Boolean(errors.standardRate)}
                {...register('standardRate', {
                  valueAsNumber: true,
                })}
              />
            </div>

            {errors.standardRate && (
              <p className='text-sm text-destructive'>
                {errors.standardRate.message}
              </p>
            )}
          </div>

          <div className='space-y-3'>
            <div>
              <Label>Location</Label>

              <p className='text-sm text-muted-foreground'>
                Position on the simulation grid.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor={`x-${company.id}`}>X coordinate</Label>

                <Input
                  id={`x-${company.id}`}
                  type='number'
                  step='1'
                  aria-invalid={Boolean(errors.x)}
                  {...register('x', {
                    valueAsNumber: true,
                  })}
                />

                {errors.x && (
                  <p className='text-sm text-destructive'>{errors.x.message}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label htmlFor={`y-${company.id}`}>Y coordinate</Label>

                <Input
                  id={`y-${company.id}`}
                  type='number'
                  step='1'
                  aria-invalid={Boolean(errors.y)}
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
