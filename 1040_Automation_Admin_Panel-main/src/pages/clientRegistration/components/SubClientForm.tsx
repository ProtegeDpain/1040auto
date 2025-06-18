import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { formatSSN } from '@/lib/ssn-inputs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import * as z from 'zod';
import { subClientFormSchema } from '../validations/zod';
import { PersonDetailsFields } from '@/components/shared/PersonDetailsFields';
import { usStates } from '@/lib/us-states';

type SubClientFormValue = z.infer<typeof subClientFormSchema>;

interface SubClientFormProps {
  onSubmit?: (data: SubClientFormValue) => void;
  onCancel?: () => void;
  isOpen: boolean;
  editData?: SubClientFormValue | null;
  clients: Array<{ id: string; name: string; companyName?: string }>;
}

export default function SubClientForm({
  onSubmit,
  onCancel,
  isOpen,
  editData,
  clients = []
}: SubClientFormProps) {
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const defaultValues = {
    companyName: editData?.companyName || '',
    clientName: editData?.clientName || '',
    filingStatus: editData?.filingStatus || '',
    residentState: editData?.residentState || '',
    subClientFirstName: editData?.subClientFirstName || '',
    subClientMiddleInitial: editData?.subClientMiddleInitial || '',
    subClientLastName: editData?.subClientLastName || '',
    subClientSSN: editData?.subClientSSN || '',
    subClientSpouseName: editData?.subClientSpouseName || '',
    subClientSpouseMiddleInitial: editData?.subClientSpouseMiddleInitial || '',
    subClientSpouseLastName: editData?.subClientSpouseLastName || '',
    subClientSpouseSSN: editData?.subClientSpouseSSN || '',
    dependents: (editData?.dependents || []).map((dep) => ({
      name: dep.name || '',
      middleInitial: dep.middleInitial || '',
      lastName: dep.lastName || '',
      ssn: dep.ssn || ''
    }))
  };

  const form = useForm<SubClientFormValue>({
    resolver: zodResolver(subClientFormSchema),
    defaultValues
  });

  // Update client name when company changes
  useEffect(() => {
    if (selectedCompany) {
      const found = clients.find(
        (client) => client.companyName === selectedCompany
      );
      if (found) setSelectedClient(found.name);
    }
  }, [selectedCompany, clients]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'dependents'
  });

  const handleSubmit = async (data: SubClientFormValue) => {
    setLoading(true);
    try {
      console.log('SubClient data:', data);
      onSubmit?.(data);
      form.reset();
    } catch (error) {
      console.error('Error submitting subclient form:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  const addDependent = () => {
    if (fields.length < 5) {
      append({ name: '', ssn: '' });
    }
  };

  const removeDependent = (index: number) => {
    if (fields.length > 0) {
      remove(index);
    }
  };

  const handleNext = () => {
    form.trigger(); // Validate current step
    const hasErrors = Object.keys(form.formState.errors).length > 0;
    if (!hasErrors) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    setCurrentStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative max-h-[90vh] w-full overflow-y-auto rounded-lg bg-white md:max-w-4xl">
        {/* Modal Content */}
        <div className="p-4 md:p-6">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold text-gray-900 md:text-2xl">
              Sub Client Registration
            </h1>

            {/* Step Indicator */}
            <div className="mt-4 flex items-center justify-center gap-2 md:gap-4">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${
                  currentStep === 1 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}
              >
                1
              </div>
              <div className="h-1 w-8 bg-gray-200 md:w-16" />
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${
                  currentStep === 2 ? 'bg-primary text-white' : 'bg-gray-200'
                }`}
              >
                2
              </div>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6 md:space-y-8"
            >
              {currentStep === 1 ? (
                /* Step 1: General Information */
                <div className="rounded-lg border border-border p-4 md:p-6">
                  <h2 className="mb-4 text-base font-semibold md:mb-6 md:text-lg">
                    General Information
                  </h2>
                  <div className="grid gap-4 md:gap-6">
                    {/* Company and Client Selection */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                      <FormField
                        control={form.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value); // Add this line
                                setSelectedCompany(value);
                                const matchingClient = clients.find(
                                  (c) => c.companyName === value
                                );
                                if (matchingClient) {
                                  setSelectedClient(matchingClient.name);
                                  form.setValue(
                                    'clientName',
                                    matchingClient.name
                                  );
                                }
                              }}
                              value={field.value}
                            >
                              <SelectTrigger className="h-10">
                                <SelectValue placeholder="Select company" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from(
                                  new Set(clients.map((c) => c.companyName))
                                )
                                  .filter(
                                    (companyName): companyName is string =>
                                      typeof companyName === 'string'
                                  )
                                  .map((companyName) => (
                                    <SelectItem
                                      key={companyName}
                                      value={companyName}
                                    >
                                      {companyName}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="clientName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Client Name *</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                setSelectedClient(value);
                                const matchingCompany = clients.find(
                                  (c) => c.name === value
                                );
                                if (matchingCompany?.companyName) {
                                  setSelectedCompany(
                                    matchingCompany.companyName
                                  );
                                }
                              }}
                              value={selectedClient}
                            >
                              <FormControl>
                                <SelectTrigger className="h-10">
                                  <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients
                                  .filter(
                                    (client) =>
                                      !selectedCompany ||
                                      client.companyName === selectedCompany
                                  )
                                  .map((client) => (
                                    <SelectItem
                                      key={client.id}
                                      value={client.name}
                                    >
                                      {client.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Filing Status and Resident State */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
                      <FormField
                        control={form.control}
                        name="filingStatus"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Filing Status *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={
                                typeof field.value === 'string'
                                  ? field.value
                                  : ''
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select filing status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single">Single</SelectItem>
                                <SelectItem value="married-filing-jointly">
                                  Married Filing Jointly
                                </SelectItem>
                                <SelectItem value="married-filing-separately">
                                  Married Filing Separately
                                </SelectItem>
                                <SelectItem value="head-of-household">
                                  Head of Household
                                </SelectItem>
                                <SelectItem value="qualifying-surviving-spouse">
                                  Qualifying Surviving Spouse
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="residentState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Resident State *</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={
                                typeof field.value === 'string'
                                  ? field.value
                                  : ''
                              }
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select state" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {usStates.map((state) => (
                                  <SelectItem
                                    key={state.value}
                                    value={state.value}
                                  >
                                    {state.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Sub Client Details */}
                    <div className="space-y-4">
                      <PersonDetailsFields
                        control={form.control}
                        namePrefix="subClient"
                      />
                    </div>

                    {/* Step 1 Actions */}
                    <div className="flex justify-end gap-4 pt-2 md:pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        className="w-full sm:w-auto"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleNext}
                        className="w-full md:w-auto"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Step 2: Family Information */
                <div className="space-y-6 md:space-y-8">
                  {/* Section 2: Spouse Information */}
                  <div className="rounded-lg border border-border p-4 md:p-6">
                    <h2 className="mb-4 text-base font-semibold md:mb-6 md:text-lg">
                      Spouse Information (Optional)
                    </h2>
                    <PersonDetailsFields
                      control={form.control}
                      namePrefix="spouse"
                      required={false}
                    />
                  </div>

                  {/* Section 3: Dependents */}
                  <div className="rounded-lg border border-border p-4 md:p-6">
                    <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-center md:mb-6">
                      <h2 className="text-base font-semibold md:text-lg">
                        Dependents (Optional)
                      </h2>
                      <Button
                        type="button"
                        onClick={addDependent}
                        disabled={fields.length >= 5}
                        variant="secondary"
                        className="w-full sm:w-auto"
                      >
                        Add Dependent
                      </Button>
                    </div>

                    <div className="space-y-4 md:space-y-6">
                      {fields.map((field, index) => (
                        <div
                          key={field.id}
                          className="relative rounded-lg border border-border/50 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-sm font-medium text-muted-foreground">
                              Dependent {index + 1}
                            </h3>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeDependent(index)}
                              className="h-8 w-8 p-0"
                            >
                              ✕
                            </Button>
                          </div>
                          <PersonDetailsFields
                            control={form.control}
                            namePrefix={`dependents.${index}.`}
                            required={false}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 Actions */}
                  <div className="flex flex-col items-center justify-end gap-3 sm:flex-row md:gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBack}
                      className="w-full sm:w-auto"
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto"
                    >
                      {loading ? 'Saving...' : editData ? 'Update' : 'Save'}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
