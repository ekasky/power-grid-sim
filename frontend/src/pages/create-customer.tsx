import type { CustomerType } from '@/api/customer';
import { FormError } from '@/components/form-error';
import { SelectPowerCompany } from '@/components/select-power-company';
import { SelectPowerPlants } from '@/components/select-power-plant';
import { SelectSubstation } from '@/components/select-substation';
import { SelectTransformer } from '@/components/select-transformer';
import {
  Card,
  CardContent,
  CardDescription,
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
import { usePowerCompanies } from '@/hooks/use-power-companies';
import { usePowerPlants } from '@/hooks/use-power-plants';
import { useSubstation } from '@/hooks/use-substation';
import { useTransformers } from '@/hooks/use-transformers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const createCustomerSchema = z.object({
  accountNumber: z
    .string()
    .trim()
    .min(1, 'Account number is required')
    .max(20, 'Account number cannot exceed 20 characters'),

  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(120, 'Name cannot exceed 120 characters'),

  customerType: z.enum(['RESIDENTIAL', 'COMMERCIAL']),

  x: z.number().int('X coordinate must be a integer'),

  y: z.number().int('Y coordinate must be a integer'),
});

type CreateCustomerForm = z.infer<typeof createCustomerSchema>;

const customerTypeOptions: Array<{
  value: CustomerType;
  label: string;
}> = [
  {
    value: 'RESIDENTIAL',
    label: 'Residential',
  },
  {
    value: 'COMMERCIAL',
    label: 'Commercial',
  },
];

const CreateCustomer = () => {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const powerCompaniesState = usePowerCompanies();
  const powerPlantsState = usePowerPlants(
    powerCompaniesState.selectedPowerCompanyId,
  );
  const substationState = useSubstation(powerPlantsState.selectedPowerPlantId);
  const transformersState = useTransformers(
    substationState.selectedSubstationId,
  );

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateCustomerForm>({
    resolver: zodResolver(createCustomerSchema),
    defaultValues: {
      accountNumber: '',
      name: '',
      customerType: 'RESIDENTIAL',
      x: 0,
      y: 0,
    },
  });

  const onSubmit = (values: CreateCustomerForm) => {
    // temp
    console.log(values);
    setSubmitError(null);
  };

  return (
    <div className='mx-auto max-w-3xl space-y-6'>
      <div>
        <h1 className='mt-1 text-muted-foreground'>Create Customer</h1>

        <p className='mt-1 text-muted-foreground'>
          Create a Residential or Commerical customer
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Infomation</CardTitle>

          <CardDescription>
            Select the transfromer that will provide power to the customer
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            {powerCompaniesState.powerCompanyError && (
              <FormError
                title='Unable to load power companies'
                error={powerCompaniesState.powerCompanyError}
              />
            )}

            {powerPlantsState.powerPlantError && (
              <FormError
                title='Unable to load power plants'
                error={powerPlantsState.powerPlantError}
              />
            )}

            {substationState.substationError && (
              <FormError
                title='Unable to load substations'
                error={substationState.substationError}
              />
            )}

            {transformersState.transformerError && (
              <FormError
                title='Unable to load transformers'
                error={transformersState.transformerError}
              />
            )}

            {submitError && (
              <FormError
                title='Unable to create customer'
                error={submitError}
              />
            )}

            <div className='space-y-4'>
              <div>
                <h2 className='font-medium'>Power connection</h2>

                <p className='text-sm text-muted-foreground'>
                  Choose the power company, plant, substation, and transformer
                </p>
              </div>

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
                  {...substationState}
                  isSubmitting={isSubmitting}
                />

                <SelectTransformer
                  {...transformersState}
                  isSubmitting={isSubmitting}
                />
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <h2 className='font-medium'>Customer details</h2>

                <p className='text-sm text-muted-foreground'>
                  Enter the customer account information.
                </p>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='space-y-2'>
                  <Label htmlFor='accountNumber'>Account Number</Label>

                  <Input
                    id='accountNumber'
                    className='h-11'
                    placeholder='CUST-00001'
                    aria-invalid={Boolean(errors.accountNumber)}
                    {...register('accountNumber')}
                  />

                  {errors.accountNumber && (
                    <p className='text-sm text-destructive'>
                      {errors.accountNumber.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='customerName'>Customer Name</Label>

                  <Input
                    id='customerName'
                    className='h-11'
                    placeholder='John Doe'
                    aria-invalid={Boolean(errors.name)}
                    {...register('name')}
                  />

                  {errors.name && (
                    <p className='text-sm text-destructive'>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className='space-y-2 sm:col-span-2'>
                  <Label>Customer Type</Label>

                  <Controller
                    name='customerType'
                    control={control}
                    render={({ field }) => (
                      <Select
                        items={customerTypeOptions}
                        value={field.value}
                        onValueChange={(value) => {
                          if (
                            value === 'RESIDENTIAL' ||
                            value === 'COMMERCIAL'
                          ) {
                            field.onChange(value);
                          }
                        }}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className='w-full'>
                          <SelectValue placeholder='Select customer type' />
                        </SelectTrigger>

                        <SelectContent>
                          {customerTypeOptions.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  {errors.customerType && (
                    <p className='text-sm text-destructive'>
                      {errors.customerType.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCustomer;
