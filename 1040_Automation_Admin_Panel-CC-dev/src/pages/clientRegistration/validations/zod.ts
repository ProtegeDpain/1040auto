import { z } from 'zod';

export const subClientFormSchema = z.object({
  
  filingStatus: z.string().min(1, 'Filing status is required'),
  residentState: z.string().min(1, 'Resident state is required'),
  subClientFirstName: z.string().min(1, 'First name is required'),
  subClientMiddleInitial: z.string().optional(),
  subClientLastName: z.string().optional(),
  subClientSSN: z.string().min(1, 'SSN is required'),
  subClientSpouseName: z.string().optional(),
  subClientSpouseMiddleInitial: z.string().optional(),
  subClientSpouseLastName: z.string().optional(),
  subClientSpouseSSN: z.string().optional(),
  dependents: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        middleInitial: z.string().optional(),
        lastName: z.string().optional(),
        ssn: z.string().min(1, 'SSN is required')
      })
    )
    .max(5)
    .optional()
    .default([])
});

export interface SubClientFormValue {
  
  filingStatus: string;
  residentState: string;
  subClientFirstName: string;
  subClientMiddleInitial?: string;
  subClientLastName?: string;
  subClientSSN: string;
  subClientSpouseName?: string;
  subClientSpouseMiddleInitial?: string;
  subClientSpouseLastName?: string;
  subClientSpouseSSN?: string;
  dependents: Array<{
    name: string;
    middleInitial?: string;
    lastName?: string;
    ssn: string;
  }>;
}
