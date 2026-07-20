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

const CreateCustomer = () => {
  return <>Create Customer Page</>;
};

export default CreateCustomer;
