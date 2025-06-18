import { z } from 'zod';

// Helper for SSN auto-hyphenation
export function autoHyphenateSSN(value: string): string {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  // Format as XXX-XX-XXXX
  if (digits.length <= 3) return digits;
  if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
}

// IP address regex (IPv4)
const ipRegex =
  /^(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)){3}$/;

export const taskCreationSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  subClientName: z.string().min(1, 'Sub client name is required'),
  taxYear: z.string().regex(/^\d{4}$/, 'Tax year must be a 4-digit year'),

  // Software credentials
  software: z.object({
    name: z.string().min(1, 'Software name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
  }),
  vpn: z.object({
    name: z.string().min(1, 'VPN name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
  }),
  rdc: z.object({
    name: z.string().min(1, 'RDC name is required'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required')
  }),

  // Remote IP
  remoteIp: z
    .string()
    .regex(ipRegex, 'Invalid IP address format (e.g. 192.168.1.1)'),

  // File uploads (optional, can be refined as needed)
  supportingDocs: z.any().optional(),
  taxReturn: z.any().optional()
});

export type TaskCreationFormValues = z.infer<typeof taskCreationSchema>;
