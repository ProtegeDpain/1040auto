import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { createTask } from '@/services/taskService';
import { getSubClientById } from '@/services/subClientService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usStates } from '@/lib/us-states';
import { v4 as uuidv4 } from 'uuid';
import { stepSchemas } from '@/pages/taskCreation/validations/taskSchema';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons.tsx';
import { softwareTypes, type TaskFormData, initialFormState } from '../data';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { FormikErrors } from 'formik'; // if you use Formik types
import { validateFiles } from '../validations/fileValidator';

interface SubClientData {
  id: number;
  sub_client_name: string;
  client_name: string;
  client_id: number;
  company_name: string;
  tax_software_type: string;
}

export interface TaskCreationFormProps {
  onTaskCreated: (task: any) => void;
  onClose: () => void;
}

export function TaskCreationForm({ onTaskCreated, onClose }: TaskCreationFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<TaskFormData>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [taxReturnDoc, setTaxReturnDoc] = useState<File | null>(null);
  const [subClients, setSubClients] = useState<SubClientData[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch subclients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subClientsData = await getSubClientById();
        // Map subclient data to match SubClientResponse
        const formattedSubClients = subClientsData.map(subClient => ({
          id: subClient.id,
          sub_client_name: subClient.sub_client_name,
          client_name: subClient.client_name,
          client_id: subClient.client_id,
          company_name: subClient.company_name,
          tax_software_type: subClient.tax_software_type
        }));
        setSubClients(formattedSubClients);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load sub-clients');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);
  
const [errors, setErrors] = useState<FormikErrors<TaskFormData>>({});
async function validateStep(
  step: number,
  form: TaskFormData,
  setErrors: (errors: FormikErrors<TaskFormData>) => void
): Promise<boolean> {
  try {
    await stepSchemas[step - 1].validate(form, { abortEarly: false });
    return true;
  } catch (validationError) {
    const errors: FormikErrors<TaskFormData> = {};
    if (validationError instanceof Yup.ValidationError) {
      validationError.inner.forEach((err) => {
        if (err.path) {
          errors[err.path as keyof TaskFormData] = err.message;
          toast.error(err.message, {
            toastId: `step-${step}-${err.path}`,
          });
        }
      });
    }
    setErrors(errors);
    return false;
  }
}

const handleNext = async () => {
  const isValid = await validateStep(step, form, setErrors); // ✅ await the Promise

  if (isValid) {
    setStep((prev) => prev + 1);
  }
};

  
  const handleBack = () => setStep((prev) => prev - 1);

  const handleChange = (field: keyof TaskFormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

const isFormValid = await validateStep(3, form, setErrors);
  const areFilesValid = validateFiles(supportingDocs);

  if (!isFormValid || !areFilesValid) {
    return;
  }
    setLoading(true);
    try {
      // TODO: Upload documents and get blobUrl
      // Build the payload as expected by the backend
      const data = {
        task_uid: uuidv4(),
        client_id: Number(form.client_id),
        sub_client_id: Number(form.sub_client_id),
        tax_year: Number(form.tax_year),
        resident_state: form.resident_state,
        software_type: form.software_type,
        software_name: form.software_name,
        software_exe_path: form.software_exe_path,
        software_ip_address: form.software_ip_address,
        software_username: form.software_username,
        software_password: form.software_password,
        vpn_name: form.vpn_name,
        vpn_exe_path: form.vpn_exe_path,
        vpn_ip_address: form.vpn_ip_address,
        vpn_username: form.vpn_username,
        vpn_password: form.vpn_password,
        rdc_name: form.rdc_name,
        rdc_exe_path: form.rdc_exe_path,
        rdc_ip_address: form.rdc_ip_address,
        rdc_username: form.rdc_username,
        rdc_password: form.rdc_password,
        splashtop_email: form.splashtop_email,
        splashtop_password: form.splashtop_password,
        created_by: user.id
      };
      await createTask(data, supportingDocs);

      // Format the task for the table display
      const newTask = {
        client: form.client_name,
        subClient: form.sub_client_name,
        software: form.software_name,
        softwareType: form.software_type,
        status: 'uploading',
        lastProcessDate: new Date().toISOString().split('T')[0]
      };

      onTaskCreated(newTask);
      onClose();

      // Reset form
      setForm(initialFormState);
      setSupportingDocs([]);
      setTaxReturnDoc(null);
      setStep(1);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (step === 1) {
      return (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="company_name" className="mb-1 text-xs">
                Company Name
              </Label>
              <Select
                value={form.company_name}
                onValueChange={(val) => {
                  const found = subClients.find((s) => s.company_name === val);
                  if (found) {
                    handleChange('company_name', val);
                    handleChange('client_name', found.client_name);
                    handleChange('client_id', Number(found.client_id));
                    handleChange('sub_client_id', Number(found.id));
                    handleChange('software_type', found.tax_software_type);
                  }
                }}
              >
                <SelectTrigger className="mb-1">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Company Name"} />
                </SelectTrigger>
                <SelectContent>
                  {subClients.map((subClient) => (
                    <SelectItem key={subClient.company_name} value={subClient.company_name}>
                      {subClient.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="client_name" className="mb-1 text-xs">
                Client Name
              </Label>
              <Select
                value={form.client_name}
                onValueChange={(val) => {
                  const found = subClients.find((s) => s.client_name === val);
                  if (found) {
                    handleChange('client_name', val);
                    handleChange('company_name', found.company_name);
                    handleChange('client_id', Number(found.client_id));
                    handleChange('software_type', found.tax_software_type);
                    handleChange('sub_client_id', Number(found.id));
                  }
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Client Name"} />
                </SelectTrigger>
                <SelectContent>
                  {subClients.map((s) => (
                    <SelectItem key={s.client_name} value={s.client_name}>
                      {s.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="sub_client_name" className="mb-1 text-xs">
                Sub Client Name
              </Label>
              <Select
                value={form.sub_client_name}
                onValueChange={(val) => {
                  const found = subClients.find(
                    (s) => s.sub_client_name === val && (!form.client_id || s.client_id === Number(form.client_id))
                  );
                  if (found) {
                    handleChange('sub_client_name', val);
                    handleChange('sub_client_id', Number(found.id)); // Ensure it's a number
                    // If no client is selected, also set the client
                    if (!form.client_id) {
                      handleChange('client_name', found.client_name);
                      handleChange('company_name', found.company_name);
                      handleChange('client_id', Number(found.client_id));
                      handleChange('software_type', found.tax_software_type);
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Sub Client Name"} />
                </SelectTrigger>
                <SelectContent>
                  {subClients
                    .filter(sc => !form.client_id || sc.client_id === Number(form.client_id))
                    .map((sc) => (
                      <SelectItem 
                        key={sc.id} 
                        value={sc.sub_client_name}
                      >
                        {sc.sub_client_name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tax_year" className="mb-1 text-xs">
                  Tax Year
                </Label>
                <Input
                  type="number"
                  id="tax_year"
                  name="tax_year"
                  min={2000}
                  max={2100}
                  placeholder="YYYY"
                  value={(form.tax_year)}
                  onChange={(e) => {
                    const value = e.target.value;
                    const year = parseInt(value);
                    if (!value || (year >= 2000 && year <= 2100)) {
                      handleChange('tax_year', year);
                    }
                  }}
                  required
                  className={!form.tax_year ? 'border-red-300 focus:border-red-500' : ''}
                />
                {!form.tax_year && (
                  <span className="mt-1 text-xs text-red-500">Tax year is required</span>
                )}
              </div>
              <div>
                <Label htmlFor="resident_state" className="mb-1 text-xs">
                  Resident State
                </Label>
                <Select
                  value={form.resident_state}
                  onValueChange={(val) => handleChange('resident_state', val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {usStates.map((state) => (
                      <SelectItem key={state.value} value={state.value}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="software_type" className="mb-1 text-xs">
                Software Type
              </Label>
              <Select
                value={form.software_type}
                onValueChange={(val) => handleChange('software_type', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Software Type" />
                </SelectTrigger>
                <SelectContent>
                  {softwareTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              type="button"
              onClick={handleNext}
              className="w-full md:w-auto"
            >
              Next
            </Button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-2 font-semibold text-foreground">
            Connect Using {form.software_type || 'Selected Software Type'}
          </div>

          {/* Table Header */}
          <div className="mb-6 grid grid-cols-3 gap-6 border-b border-border pb-4">
            <Label className="text-sm font-medium text-muted-foreground">
              Software Tools
            </Label>
            <Label className="text-sm font-medium text-muted-foreground">
              User ID
            </Label>
            <Label className="text-sm font-medium text-muted-foreground">
              Password
            </Label>
          </div>

          {/* Dynamic Credential Fields */}
          <div className="space-y-6">
            {form.software_type === 'VPN+RDC' && (
              <>
                {/* Software Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div>
                    <Select value={form.software_name} disabled>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={form.software_name} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={form.software_name}>{form.software_name}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Username"
                      className="flex-1"
                      value={form.software_username}
                      onChange={(e) => handleChange('software_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.software_password}
                    onChange={(e) => handleChange('software_password', e.target.value)}
                  />
                </div>

                {/* VPN Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div className="font-medium">VPN</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="VPN Username"
                      className="flex-1"
                      value={form.vpn_username}
                      onChange={(e) => handleChange('vpn_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.vpn_password}
                    onChange={(e) => handleChange('vpn_password', e.target.value)}
                  />
                </div>

                {/* RDC Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div className="font-medium">RDC</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Username/Computer"
                      className="flex-1"
                      value={form.rdc_username}
                      onChange={(e) => handleChange('rdc_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.rdc_password}
                    onChange={(e) => handleChange('rdc_password', e.target.value)}
                  />
                </div>
              </>
            )}

            {form.software_type === 'RDC' && (
              <>
                {/* Software Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div>
                    <Select
                      value={form.software_name}
                      onValueChange={(val) => handleChange('software_name', val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tax Preparation Software" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Drake">Drake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Username"
                      className="flex-1"
                      value={form.software_username}
                      onChange={(e) => handleChange('software_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.software_password}
                    onChange={(e) => handleChange('software_password', e.target.value)}
                  />
                </div>

                {/* RDC Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div className="font-medium">RDC</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Username/Computer"
                      className="flex-1"
                      value={form.rdc_username}
                      onChange={(e) => handleChange('rdc_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.rdc_password}
                    onChange={(e) => handleChange('rdc_password', e.target.value)}
                  />
                </div>
              </>
            )}

            {form.software_type === 'Splashtop' && (
              <>
                {/* Software Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div>
                    <Select
                      value={form.software_name}
                      onValueChange={(val) => handleChange('software_name', val)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tax Preparation Software" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Drake">Drake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      placeholder="Username"
                      className="flex-1"
                      value={form.software_username}
                      onChange={(e) => handleChange('software_username', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.software_password}
                    onChange={(e) => handleChange('software_password', e.target.value)}
                  />
                </div>

                {/* Splashtop Row */}
                <div className="grid grid-cols-3 items-center gap-6">
                  <div className="font-medium">Splashtop</div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-muted">
                      <Icons.user className="h-full w-full p-2 text-muted-foreground" />
                    </div>
                    <Input
                      type="email"
                      placeholder="Email"
                      className="flex-1"
                      value={form.splashtop_email}
                      onChange={(e) => handleChange('splashtop_email', e.target.value)}
                    />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="w-full"
                    value={form.splashtop_password}
                    onChange={(e) => handleChange('splashtop_password', e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="w-full md:w-auto"
            >
              Back
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
      );
    }

    return (
      // Step 3 - File Upload
      <div className="rounded-lg border border-border bg-background p-4">
        <div className="mb-8 flex flex-row gap-6">
          <div className="flex flex-1 flex-col items-center">
            <Label className="mb-2 font-medium">Upload Documents</Label>
            <label
              htmlFor="supportingDocs"
              className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted"
            >
              <span className="mb-2 text-sm text-muted-foreground">
                Click to select multiple documents
              </span>
              <Input
                id="supportingDocs"
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const filesArray = Array.from(e.target.files);
                    setSupportingDocs((prev) => [...prev, ...filesArray]);
                    e.target.value = '';
                  }
                }}
              />
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
            {/* Preview uploaded supporting docs */}
            <div className="mt-2 flex w-full flex-wrap gap-2">
              {supportingDocs.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center rounded border bg-white px-2 py-1 text-xs shadow-sm"
                >
                  <span className="max-w-[100px] truncate">{file.name}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-500 hover:text-red-700"
                    onClick={() =>
                      setSupportingDocs((docs) =>
                        docs.filter((_, i) => i !== idx)
                      )
                    }
                    title="Remove"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-1 flex-col items-center">
            <Label className="mb-2 font-medium">
              Upload Previous Year Tax Return
            </Label>
            <label
              htmlFor="taxReturn"
              className="flex h-28 w-full cursor-not-allowed flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted opacity-60"
              style={{ pointerEvents: 'none' }}
            >
              <span className="mb-2 text-sm text-muted-foreground">
                Click to select single document
              </span>
              <Input id="taxReturn" type="file" className="hidden" disabled />
              <svg
                className="h-8 w-8 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </label>
            {/* Preview uploaded tax return doc */}
            {taxReturnDoc && (
              <div className="mt-2 flex w-full items-center rounded border bg-white px-2 py-1 text-xs shadow-sm">
                <span className="max-w-[100px] truncate">
                  {taxReturnDoc.name}
                </span>
                <button
                  type="button"
                  className="ml-2 text-red-500 hover:text-red-700"
                  onClick={() => setTaxReturnDoc(null)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="w-full md:w-auto"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="w-full bg-green-600 text-white hover:bg-green-700 md:w-auto"
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Process Documents'}
          </Button>
        </div>
      </div>
    );
  };


  return (
    <form
      className="max-h-full w-full max-w-full space-y-8 overflow-y-auto pr-2"
      onSubmit={handleSubmit}
    >
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-center gap-2 md:gap-4">
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          1
        </div>
        <div className="h-1 w-8 bg-gray-200 md:w-16" />
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          2
        </div>
        <div className="h-1 w-8 bg-gray-200 md:w-16" />
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}
        >
          3
        </div>
      </div>

      {renderForm()}
    </form>
  );
}
