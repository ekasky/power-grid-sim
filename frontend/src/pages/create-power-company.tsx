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
import {
  createPowerCompany,
  type CreatePowerCompanyRequest,
} from '@/api/power-companies';
import { AlertError } from '@/components/alert-error';

const createPowerCompanySchema = z.object({
  longName: z
    .string()
    .trim()
    .min(1, 'Long name is required')
    .max(255, 'Long name cannot exceed 255 characters'),

  shortName: z
    .string()
    .trim()
    .min(1, 'Short name is required')
    .max(20, 'Short name cannot exceed 20 characters'),

  standardRate: z.number().min(0, 'Standard rate cannot be negative'),

  x: z.number().int('X coordinate must be an integer'),

  y: z.number().int('Y coordinate must be an integer'),
});

type CreatePowerCompanyForm = z.infer<typeof createPowerCompanySchema>;

const CreatePowerCompany = () => {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePowerCompanyForm>({
    resolver: zodResolver(createPowerCompanySchema),
    defaultValues: {
      longName: '',
      shortName: '',
      standardRate: 0,
      x: 0,
      y: 0,
    },
  });

  const onSubmit = async (values: CreatePowerCompanyForm) => {
    const request: CreatePowerCompanyRequest = {
      longName: values.longName,
      shortName: values.shortName,
      standardRate: values.standardRate,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      setSubmitError(null);

      await createPowerCompany(request);

      navigate('/');
    } catch (error: unknown) {
      console.error(error);

      setSubmitError(
        error instanceof Error ? error.message : 'An unexpected error occurred',
      );
    }
  };

  return (
    <div className='mx-auto w-full max-w-2xl py-4'>
      <div className='mb-4'>
        <h1 className='text-3xl font-bold tracking-tight'>
          Create Power Company
        </h1>

        <p className='mt-2 text-muted-foreground'>
          Add a new power company to the simulation.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader className='px-8 pb-3 pt-3'>
            <CardTitle>Company Information</CardTitle>

            <CardDescription className='mt-1'>
              Enter the company details and location.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-7 px-8 pb-8'>
            {submitError && (
              <AlertError
                title='Unable to create company'
                error={submitError}
              />
            )}

            <div className='space-y-3'>
              <Label htmlFor='longName'>Company name</Label>

              <Input
                id='longName'
                className='h-11'
                placeholder='Florida Power Company'
                aria-invalid={Boolean(errors.longName)}
                {...register('longName')}
              />

              {errors.longName && (
                <p className='text-sm text-destructive'>
                  {errors.longName.message}
                </p>
              )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='shortName'>Short name</Label>

              <Input
                id='shortName'
                className='h-11'
                placeholder='FPC'
                aria-invalid={Boolean(errors.shortName)}
                {...register('shortName')}
              />

              <p className='text-sm text-muted-foreground'>
                Must be unique within the simulation.
              </p>

              {errors.shortName && (
                <p className='text-sm text-destructive'>
                  {errors.shortName.message}
                </p>
              )}
            </div>

            <div className='space-y-3'>
              <Label htmlFor='standardRate'>Standard rate per kWh</Label>

              <div className='relative'>
                <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  $
                </span>

                <Input
                  id='standardRate'
                  type='number'
                  min='0'
                  step='0.0001'
                  className='h-11 pl-8'
                  placeholder='0.1500'
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

            <div className='space-y-4 pt-1'>
              <div className='space-y-1'>
                <Label>Location</Label>

                <p className='text-sm text-muted-foreground'>
                  Position on the simulation grid.
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

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting && <Loader2 className='size-4 animate-spin' />}

              {isSubmitting ? 'Creating...' : 'Create Power Company'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreatePowerCompany;
