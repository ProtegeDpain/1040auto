import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Control } from 'react-hook-form';
import { usStates } from '@/lib/us-states';

interface FilingInfoFieldsProps {
  control: Control<any>;
}

export function FilingInfoFields({ control }: FilingInfoFieldsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <FormField
        control={control}
        name="filingStatus"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Filing Status *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-10">
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
        control={control}
        name="residentState"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Resident State *</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {usStates.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
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
  );
}
