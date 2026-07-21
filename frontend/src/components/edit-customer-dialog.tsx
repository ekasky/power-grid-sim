import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Pencil } from 'lucide-react';
import { z } from 'zod';
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
import {
  updateCustomer,
  type Customer,
  type UpdateCustomerRequest,
} from '@/api/customer';

const updateCustomerSchema = z
  .object({
    accountNumber: z
      .string()
      .trim()
      .min(1, 'Account number is required')
      .max(20, 'Account number cannot exceed 20 characters'),

    name: z
      .string()
      .trim()
      .min(1, 'Customer name is required')
      .max(120, 'Customer name cannot exceed 120 characters'),

    useStandardBillingRate: z.boolean(),

    customBillingRate: z
      .number()
      .min(0, 'Custom billing rate cannot be negative')
      .optional(),

    x: z.number().int('X coordinate must be an integer'),

    y: z.number().int('Y coordinate must be an integer'),
  })
  .superRefine((values, context) => {
    if (
      !values.useStandardBillingRate &&
      values.customBillingRate === undefined
    ) {
      context.addIssue({
        code: 'custom',
        path: ['customBillingRate'],
        message: 'Enter a custom billing rate or use the company standard rate',
      });
    }
  });

type UpdateCustomerForm = z.infer<typeof updateCustomerSchema>;

interface EditCustomerDialogProps {
  customer: Customer;
  onUpdated: (customer: Customer) => void;
  disabled?: boolean;
}

export const EditCustomerDialog = ({
  customer,
  onUpdated,
  disabled = false,
}: EditCustomerDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateCustomerForm>({
    resolver: zodResolver(updateCustomerSchema),
    defaultValues: {
      accountNumber: customer.accountNumber,
      name: customer.name,
      useStandardBillingRate: customer.customBillingRate == null,
      customBillingRate:
        customer.customBillingRate == null
          ? undefined
          : Number(customer.customBillingRate),
      x: customer.location.x,
      y: customer.location.y,
    },
  });

  const useStandardBillingRate = Boolean(
    useWatch({
      control,
      name: 'useStandardBillingRate',
    }),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (nextOpen) {
      setFormError(null);

      reset({
        accountNumber: customer.accountNumber,
        name: customer.name,
        useStandardBillingRate: customer.customBillingRate == null,
        customBillingRate:
          customer.customBillingRate == null
            ? undefined
            : Number(customer.customBillingRate),
        x: customer.location.x,
        y: customer.location.y,
      });
    }
  };

  const onSubmit = async (values: UpdateCustomerForm) => {
    setFormError(null);

    const request: UpdateCustomerRequest = {
      accountNumber: values.accountNumber.trim(),
      name: values.name.trim(),
      useStandardBillingRate: values.useStandardBillingRate,
      customBillingRate: values.useStandardBillingRate
        ? null
        : values.customBillingRate,
      location: {
        x: values.x,
        y: values.y,
      },
    };

    try {
      const updatedCustomer = await updateCustomer(customer.id, request);

      onUpdated(updatedCustomer);
      setOpen(false);
    } catch (error: unknown) {
      console.error(error);

      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to update the customer',
      );
    }
  };

  const formattedCustomerType =
    customer.customerType === 'RESIDENTIAL' ? 'Residential' : 'Commercial';

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
          <DialogTitle>Edit Customer</DialogTitle>

          <DialogDescription>
            Update the information for {customer.name}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          {formError && (
            <Alert variant='destructive'>
              <AlertTitle>Unable to update customer</AlertTitle>

              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <div className='grid gap-4 sm:grid-cols-2'>
            <div className='space-y-2'>
              <Label htmlFor={`accountNumber-${customer.id}`}>
                Account number
              </Label>

              <Input
                id={`accountNumber-${customer.id}`}
                aria-invalid={Boolean(errors.accountNumber)}
                disabled={isSubmitting}
                {...register('accountNumber')}
              />

              {errors.accountNumber && (
                <p className='text-sm text-destructive'>
                  {errors.accountNumber.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <Label htmlFor={`customerType-${customer.id}`}>
                Customer type
              </Label>

              <Input
                id={`customerType-${customer.id}`}
                value={formattedCustomerType}
                disabled
                readOnly
              />

              <p className='text-sm text-muted-foreground'>
                Customer type cannot be changed.
              </p>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor={`name-${customer.id}`}>Customer name</Label>

            <Input
              id={`name-${customer.id}`}
              aria-invalid={Boolean(errors.name)}
              disabled={isSubmitting}
              {...register('name')}
            />

            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
            )}
          </div>

          <div className='space-y-4'>
            <div>
              <Label>Billing rate</Label>

              <p className='text-sm text-muted-foreground'>
                Use the company standard rate or assign a custom rate.
              </p>
            </div>

            <label
              htmlFor={`useStandardBillingRate-${customer.id}`}
              className='flex cursor-pointer items-start gap-3 rounded-md border p-4'
            >
              <input
                id={`useStandardBillingRate-${customer.id}`}
                type='checkbox'
                disabled={isSubmitting}
                {...register('useStandardBillingRate')}
              />

              <span>
                <span className='block font-medium'>
                  Use company standard rate
                </span>

                <span className='block text-sm text-muted-foreground'>
                  Company standard rate: $
                  {Number(customer.standardBillingRate).toFixed(4)} per kWh
                </span>
              </span>
            </label>

            <div className='space-y-2'>
              <Label htmlFor={`customBillingRate-${customer.id}`}>
                Custom billing rate
              </Label>

              <div className='relative'>
                <span className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'>
                  $
                </span>

                <Input
                  id={`customBillingRate-${customer.id}`}
                  type='number'
                  min='0'
                  step='0.0001'
                  className='pl-8'
                  placeholder='0.1500'
                  disabled={isSubmitting || useStandardBillingRate}
                  aria-invalid={Boolean(errors.customBillingRate)}
                  {...register('customBillingRate', {
                    setValueAs: (value) =>
                      value === '' ? undefined : Number(value),
                  })}
                />
              </div>

              {useStandardBillingRate ? (
                <p className='text-sm text-muted-foreground'>
                  This customer will follow the company standard rate.
                </p>
              ) : (
                <p className='text-sm text-muted-foreground'>
                  This rate overrides the company standard rate.
                </p>
              )}

              {errors.customBillingRate && (
                <p className='text-sm text-destructive'>
                  {errors.customBillingRate.message}
                </p>
              )}
            </div>
          </div>

          <div className='space-y-3'>
            <div>
              <Label>Location</Label>

              <p className='text-sm text-muted-foreground'>
                Position of the customer on the simulation grid.
              </p>
            </div>

            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor={`x-${customer.id}`}>X coordinate</Label>

                <Input
                  id={`x-${customer.id}`}
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
                <Label htmlFor={`y-${customer.id}`}>Y coordinate</Label>

                <Input
                  id={`y-${customer.id}`}
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
