import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { formatSSN } from '@/lib/ssn-inputs';

interface PersonDetailsFieldsProps {
  control: any;
  namePrefix: string;
  required?: boolean;
}

export function PersonDetailsFields({
  control,
  namePrefix,
  required = true
}: PersonDetailsFieldsProps) {
  return (
    <div className="flex items-center gap-4">
      <FormField
        control={control}
        name={`${namePrefix}SSN`}
        render={({ field }) => (
          <FormItem className="flex-[2]">
            <FormLabel>SSN {required && '*'}</FormLabel>
            <FormControl>
              <Input
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                className="h-10"
                value={field.value}
                onChange={(e) => {
                  const formatted = formatSSN(e.target.value);
                  field.onChange(formatted);
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex flex-[3] items-center gap-4">
        <FormField
          control={control}
          name={`${namePrefix}FirstName`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>First Name {required && '*'}</FormLabel>
              <FormControl>
                <Input placeholder="First name" className="h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}MiddleInitial`}
          render={({ field }) => (
            <FormItem className="w-20">
              <FormLabel>M.I.</FormLabel>
              <FormControl>
                <Input
                  placeholder="M.I."
                  maxLength={1}
                  className="h-10 text-center"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`${namePrefix}LastName`}
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" className="h-10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
