import { z } from 'zod';

export const clientFormSchema = z.object({
  clientName: z.string().min(1, { message: 'Client name is required' }),
  softwareName: z.string().min(1, { message: 'Software name is required' }),
  clientNetworkAccess: z
    .string()
    .min(1, { message: 'Client network access is required' })
});

export const dependentSchema = z.object({
  name: z.string().min(1, { message: 'Dependent name is required' }),
  middleInitial: z.string().max(1, { message: 'Max 1 character' }).optional(),
  ssn: z.string().min(1, { message: 'Dependent SSN is required' })
});

export const subClientFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  filingStatus: z.string().min(1, 'Filing status is required'),
  residentState: z.string().min(1, 'Resident state is required'),
  clientName: z.string().min(1, 'Client name is required'),
  subClientFirstName: z.string().min(1, 'First name is required'),
  subClientLastName: z.string().min(1, 'Last name is required'),
  subClientSSN: z.string().min(1, 'SSN is required'),
  dependents: z
    .array(
      z.object({
        name: z.string().min(1, 'Dependent name is required'),
        ssn: z.string().min(1, 'Dependent SSN is required'),
        middleInitial: z.string().optional(),
        lastName: z.string().optional()
      })
    )
    .max(5),
  subClientMiddleInitial: z.string().optional(),
  subClientSpouseName: z.string().optional(),
  subClientSpouseMiddleInitial: z.string().optional(),
  subClientSpouseSSN: z.string().optional()
});
