import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// ✅ Validation schema
const clientFormSchema = z.object({
  clientName: z.string().min(1, 'Client name is required'),
  companyName: z.string().min(1, 'Company name is required'),
  softwareName: z.string().min(1, 'Software name is required'),
  clientNetworkAccess: z.string().min(1, 'Network access is required')
});

type ClientFormValue = z.infer<typeof clientFormSchema>;

interface ClientFormProps {
  onSubmit?: (data: ClientFormValue) => void;
  onCancel?: () => void;
  isOpen: boolean;
  editData?: ClientFormValue | null;
}

export default function ClientForm({
  onSubmit,
  onCancel,
  isOpen,
  editData
}: ClientFormProps) {
  const [loading, setLoading] = useState(false);

  const defaultValues: ClientFormValue = {
    clientName: editData?.clientName || '',
    companyName: editData?.companyName || '',
    softwareName: editData?.softwareName || '',
    clientNetworkAccess: editData?.clientNetworkAccess || ''
  };

  const form = useForm<ClientFormValue>({
    resolver: zodResolver(clientFormSchema),
    defaultValues
  });

  const handleSubmit = async (data: ClientFormValue) => {
    setLoading(true);
    try {
      console.log('Client data:', data);
      onSubmit?.(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting client form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editData ? 'Edit Client' : 'Add New Client'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Company Name */}
            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter company name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Client Name */}
            <FormField
              control={form.control}
              name="clientName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter client name"
                      disabled={loading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Software Name */}
            <FormField
              control={form.control}
              name="softwareName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Software Name</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select software" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Drake">Drake</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Client Network Access */}
            <FormField
              control={form.control}
              name="clientNetworkAccess"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client Network Access</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select network access" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="rdc">RDC</SelectItem>

                      <SelectItem value="vpn-rdc">VPN+RDC</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button disabled={loading} className="ml-auto w-full" type="submit">
              {loading
                ? 'Saving...'
                : editData
                  ? 'Update Client'
                  : 'Add Client'}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
