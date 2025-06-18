import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { createTask } from '@/services/taskService';
import { getClientsByUser } from '@/services/clientService';
import { getSubClientByUserId } from '@/services/subClientService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { usStates } from '@/lib/us-states';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/ui/icons.tsx';
import {
  companyClientList,
  initialFormState,
  softwareTypes,
  subClientList
} from '../data';

export function TaskCreationForm({ onTaskCreated, onClose }) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ...initialFormState
  });
  const [loading, setLoading] = useState(false);
  const [supportingDocs, setSupportingDocs] = useState<File[]>([]);
  const [taxReturnDoc, setTaxReturnDoc] = useState<File | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [subClients, setSubClients] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Fetch clients and subclients on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, subClientsData] = await Promise.all([
          getClientsByUser(),
          getSubClientByUserId(user?.id || 0)
        ]);

        // Map client data
        const mappedClients = Array.isArray(clientsData) ? clientsData : clientsData.clients || [];
        setClients(mappedClients.map(client => ({
          id: client.id,
          name: client.client_name,
          companyName: client.company_name,
          softwareType: client.software_type
        })));

        // Map subclient data
        const mappedSubClients = subClientsData || [];
        setSubClients(mappedSubClients.map(subClient => ({
          id: subClient.id,
          name: `${subClient.sub_client_name}`,
          clientId: subClient.client_id,
          clientName: subClient.client_name
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to load clients and sub-clients');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    if (!form.clientId || !form.subClientId || !form.taxYear) {
      alert('Client, Sub Client, and Tax Year are required');
      return;
    }

    // Validate tax year format
    const taxYear = parseInt(form.taxYear);
    if (isNaN(taxYear) || taxYear < 2000 || taxYear > 2100) {
      alert('Please enter a valid tax year between 2000 and 2100');
      return;
    }

    setLoading(true);
    try {
      // Create task description from form data
      const description = JSON.stringify({
        residentState: form.residentState,
        softwareType: form.softwareType,
        credentials: {
          software: {
            user: form.softwareUser,
            password: form.softwarePass
          },
          vpn: form.vpnUser ? {
            user: form.vpnUser,
            password: form.vpnPass
          } : undefined,
          rdc: form.rdcUser ? {
            user: form.rdcUser,
            password: form.rdcPass
          } : undefined,
          splashtop: form.splashtopEmail ? {
            email: form.splashtopEmail,
            password: form.splashtopPass
          } : undefined
        },
        supportingDocuments: supportingDocs.map(doc => doc.name),
        taxReturnDocument: taxReturnDoc?.name
      });

      // Create the task with required fields, omitting task_uid
      await createTask({
        userId: String(user.id),
        title: `Tax Return - ${form.clientName} - ${form.subClientName}`,
        description: description,
        client_id: form.clientId,
        sub_client_id: form.subClientId,
        tax_year: taxYear
      });

      // Format the task for the table display
      const newTask = {
        client: form.clientName,
        subClient: form.subClientName,
        software: form.software || 'Drake',
        softwareType: form.softwareType,
        status: 'uploading',
        lastProcessDate: new Date().toISOString().split('T')[0]
      };

      onTaskCreated(newTask);
      onClose();

      // Reset form
      setForm({
        ...initialFormState
      });
      setSupportingDocs([]);
      setTaxReturnDoc(null);
      setStep(1);
    } catch (error) {
      console.error('Failed to create task:', error);
      // Show error message to user
      alert(error instanceof Error ? error.message : 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const renderCredentialFields = () => {
    switch (form.softwareType) {
      case 'VPN+RDC':
        return (
          <>
            {/* Software Row */}
            <div className="grid grid-cols-3 items-center gap-6">
              <div>
                <Select value="Drake" disabled>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Drake" />
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
                  value={form.softwareUser}
                  onChange={(e) => handleChange('softwareUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.softwarePass}
                onChange={(e) => handleChange('softwarePass', e.target.value)}
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
                  value={form.vpnUser}
                  onChange={(e) => handleChange('vpnUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.vpnPass}
                onChange={(e) => handleChange('vpnPass', e.target.value)}
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
                  value={form.rdcUser}
                  onChange={(e) => handleChange('rdcUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.rdcPass}
                onChange={(e) => handleChange('rdcPass', e.target.value)}
              />
            </div>
          </>
        );

      case 'RDC':
        return (
          <>
            {/* Software Row */}
            <div className="grid grid-cols-3 items-center gap-6">
              <div>
                <Select
                  value={form.software}
                  onValueChange={(val) => handleChange('software', val)}
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
                  value={form.softwareUser}
                  onChange={(e) => handleChange('softwareUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.softwarePass}
                onChange={(e) => handleChange('softwarePass', e.target.value)}
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
                  placeholder="Username.Computer"
                  className="flex-1"
                  value={form.rdcUser}
                  onChange={(e) => handleChange('rdcUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.rdcPass}
                onChange={(e) => handleChange('rdcPass', e.target.value)}
              />
            </div>
          </>
        );

      case 'Splashtop':
        return (
          <>
            {/* Software Row */}
            <div className="grid grid-cols-3 items-center gap-6">
              <div>
                <Select
                  value={form.software}
                  onValueChange={(val) => handleChange('software', val)}
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
                  value={form.softwareUser}
                  onChange={(e) => handleChange('softwareUser', e.target.value)}
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.softwarePass}
                onChange={(e) => handleChange('softwarePass', e.target.value)}
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
                  value={form.splashtopEmail}
                  onChange={(e) =>
                    handleChange('splashtopEmail', e.target.value)
                  }
                />
              </div>
              <Input
                type="password"
                placeholder="Password...."
                className="w-full"
                value={form.splashtopPass}
                onChange={(e) => handleChange('splashtopPass', e.target.value)}
              />
            </div>
          </>
        );

      default:
        return (
          <div className="py-8 text-center text-muted-foreground">
            Please select a software type to configure credentials
          </div>
        );
    }
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

      {step === 1 && (
        <div className="rounded-lg border border-border bg-background p-4">
          {/* Remove or comment out Task ID display for now */}
          {/* <div className="mb-4 flex items-center">
            <span className="mr-4 text-base font-medium text-foreground">
              Task ID
            </span>
            <span className="rounded bg-muted px-6 py-2 font-mono text-base text-muted-foreground">
              {form.taskId}
            </span>
          </div> */}

          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName" className="mb-1 text-xs">
                Company Name
              </Label>
              <Select
                value={form.companyName}
                onValueChange={(val) => {
                  const found = clients.find(
                    (client) => client.companyName === val
                  );
                  if (found) {
                    handleChange('companyName', val);
                    handleChange('clientName', found.name);
                    handleChange('clientId', found.id);
                    handleChange('softwareType', found.softwareType);
                  }
                }}
              >
                <SelectTrigger className="mb-1">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Company Name"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.companyName}>
                      {client.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="client" className="mb-1 text-xs">
                Client Name
              </Label>
              <Select
                value={form.clientName}
                onValueChange={(val) => {
                  const found = clients.find(
                    (client) => client.name === val
                  );
                  if (found) {
                    handleChange('clientName', val);
                    handleChange('companyName', found.companyName);
                    handleChange('clientId', found.id);
                    handleChange('softwareType', found.softwareType);
                  }
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Client Name"} />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.name}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subClientName" className="mb-1 text-xs">
                Sub Client Name
              </Label>
              <Select
                value={form.subClientName}
                onValueChange={(val) => {
                  const found = subClients.find(
                    (subClient) => subClient.name === val && (!form.clientId || subClient.clientId === form.clientId)
                  );
                  if (found) {
                    handleChange('subClientName', val);
                    handleChange('subClientId', found.id);
                    // If no client is selected, also set the client
                    if (!form.clientId) {
                      const client = clients.find(c => c.id === found.clientId);
                      if (client) {
                        handleChange('clientName', client.name);
                        handleChange('companyName', client.companyName);
                        handleChange('clientId', client.id);
                        handleChange('softwareType', client.softwareType);
                      }
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={loadingData ? "Loading..." : "Select Sub Client Name"} />
                </SelectTrigger>
                <SelectContent>
                  {subClients
                    .filter(subClient => !form.clientId || subClient.clientId === form.clientId)
                    .map((subClient) => (
                      <SelectItem key={subClient.id} value={subClient.name}>
                        {subClient.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxYear" className="mb-1 text-xs">
                  Tax Year
                </Label>
                <Input
                  type="number"
                  id="taxYear"
                  name="taxYear"
                  min="2000"
                  max="2100"
                  placeholder="YYYY"
                  value={form.taxYear}
                  onChange={(e) => {
                    const value = e.target.value;
                    const year = parseInt(value);
                    if (!value || (year >= 2000 && year <= 2100)) {
                      handleChange('taxYear', value);
                    }
                  }}
                  required
                  className={!form.taxYear ? 'border-red-300 focus:border-red-500' : ''}
                />
                {!form.taxYear && (
                  <span className="mt-1 text-xs text-red-500">Tax year is required</span>
                )}
              </div>
              <div>
                <Label htmlFor="residentState" className="mb-1 text-xs">
                  Resident State
                </Label>
                <Select
                  onValueChange={(val) => handleChange('residentState', val)}
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
              <Label htmlFor="softwareType" className="mb-1 text-xs">
                Software Type
              </Label>
              <Select
                value={form.softwareType}
                onValueChange={(val) => handleChange('softwareType', val)}
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
      )}

      {step === 2 && (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-2 font-semibold text-foreground">
            Connect Using {form.softwareType || 'Selected Software Type'}
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
          <div className="space-y-6">{renderCredentialFields()}</div>

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
      )}

      {step === 3 && (
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
      )}
    </form>
  );
}
