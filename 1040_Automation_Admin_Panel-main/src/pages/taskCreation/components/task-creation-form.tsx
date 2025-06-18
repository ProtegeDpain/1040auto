import React, { useState } from 'react';
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
import { companyClientList, initialFormState, softwareTypes, subClientList } from '../data';



export function TaskCreationForm({ onTaskCreated, onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    ...initialFormState
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const newTask = {
        client: form.clientName,
        subClient: form.subClientName,
        software: form.software,
        softwareType: form.softwareType,
        status: 'uploading',
        lastProcessDate: new Date().toISOString().split('T')[0]
      };
      
      onTaskCreated(newTask);
      setLoading(false);
      onClose();
      
      // Reset form
      setForm({
        ...initialFormState
      });
      setStep(1);
    }, 1000);
  };

  const renderCredentialFields = () => {
    switch (form.softwareType) {
      case 'VPN+RDC':
        return (
          <>
            {/* Software Row */}
            <div className="grid grid-cols-3 items-center gap-6">
              <div>
                <Select
                  value="Drake"
                  disabled
                >
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
                  onChange={(e) => handleChange('splashtopEmail', e.target.value)}
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
          <div className="text-center text-muted-foreground py-8">
            Please select a software type to configure credentials
          </div>
        );
    }
  };

  return (
    <form className="max-h-full w-full max-w-full space-y-8 overflow-y-auto pr-2" onSubmit={handleSubmit}>
      {/* Step Indicator */}
      <div className="mb-6 flex items-center justify-center gap-2 md:gap-4">
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          1
        </div>
        <div className="h-1 w-8 bg-gray-200 md:w-16" />
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          2
        </div>
        <div className="h-1 w-8 bg-gray-200 md:w-16" />
        <div className={`flex h-6 w-6 items-center justify-center rounded-full text-sm md:h-8 md:w-8 md:text-base ${step === 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
          3
        </div>
      </div>

      {step === 1 && (
        <div className="rounded-lg border border-border bg-background p-4">
          <div className="mb-4 flex items-center">
            <span className="mr-4 text-base font-medium text-foreground">Task ID</span>
            <span className="rounded bg-muted px-6 py-2 font-mono text-base text-muted-foreground">
              {form.taskId}
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="companyName" className="mb-1 text-xs">Company Name</Label>
              <Select
                value={form.companyName}
                onValueChange={(val) => {
                  handleChange('companyName', val);
                  const found = companyClientList.find(item => item.companyName === val);
                  if (found) {
                    handleChange('clientName', found.clientName);
                  }
                }}
              >
                <SelectTrigger className="mb-1">
                  <SelectValue placeholder="Select Company Name" />
                </SelectTrigger>
                <SelectContent>
                  {companyClientList.map((item) => (
                    <SelectItem key={item.companyName} value={item.companyName}>
                      {item.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="client" className="mb-1 text-xs">Client Name</Label>
              <Select
                value={form.clientName}
                onValueChange={(val) => {
                  handleChange('clientName', val);
                  const found = companyClientList.find(item => item.clientName === val);
                  if (found) {
                    handleChange('companyName', found.companyName);
                    handleChange('softwareType', found.softwareType); // Auto-populate softwareType
                  }
                }}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Select Client Name" />
                </SelectTrigger>
                <SelectContent>
                  {companyClientList.map((item) => (
                    <SelectItem key={item.clientName} value={item.clientName}>
                      {item.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="subClientName" className="mb-1 text-xs">Sub Client Name</Label>
              <Select
                value={form.subClientName}
                onValueChange={(val) => handleChange('subClientName', val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sub Client Name" />
                </SelectTrigger>
                <SelectContent>
                  {subClientList.map((item) => (
                    <SelectItem key={item.subClientName} value={item.subClientName}>
                      {item.subClientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="taxYear" className="mb-1 text-xs">Tax Year</Label>
                <Input
                  type="number"
                  id="taxYear"
                  name="taxYear"
                  min="2000"
                  max="2100"
                  placeholder="YYYY"
                  value={form.taxYear}
                  onChange={(e) => handleChange('taxYear', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="residentState" className="mb-1 text-xs">Resident State</Label>
                <Select onValueChange={(val) => handleChange('residentState', val)}>
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
              <Label htmlFor="softwareType" className="mb-1 text-xs">Software Type</Label>
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
            <Button type="button" onClick={handleNext} className="w-full md:w-auto">
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
            <Label className="text-sm font-medium text-muted-foreground">Software Tools</Label>
            <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
            <Label className="text-sm font-medium text-muted-foreground">Password</Label>
          </div>
          
          {/* Dynamic Credential Fields */}
          <div className="space-y-6">
            {renderCredentialFields()}
          </div>

          <div className="mt-6 flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleBack} className="w-full md:w-auto">
              Back
            </Button>
            <Button type="button" onClick={handleNext} className="w-full md:w-auto">
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
                <Input id="supportingDocs" type="file" multiple className="hidden" />
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </label>
            </div>
            <div className="flex flex-1 flex-col items-center">
              <Label className="mb-2 font-medium">Upload Previous Year Tax Return</Label>
              <label
                htmlFor="taxReturn"
                className="flex h-28 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted"
              >
                <span className="mb-2 text-sm text-muted-foreground">
                  Click to select single document
                </span>
                <Input id="taxReturn" type="file" className="hidden" />
                <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              </label>
            </div>
          </div>
          
          <div className="flex flex-row justify-between gap-4">
            <Button type="button" variant="outline" onClick={handleBack} className="w-full md:w-auto">
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


