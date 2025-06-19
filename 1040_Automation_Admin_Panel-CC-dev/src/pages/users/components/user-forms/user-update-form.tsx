import Heading from '@/components/shared/heading';
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
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { updateUser } from '@/services/userService';
import { Employee } from '@/constants/data';

const userFormSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(1, { message: 'First name should be at least 1 character' }),
    last_name: z.string().min(1, { message: 'Last Name is required' }),
    phone_number: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    role: z.enum(['Admin', 'User'], {
      required_error: 'Role is required'
    })
  });

type UserFormSchemaType = z.infer<typeof userFormSchema>;

type Props = {
  modalClose: () => void;
  initialValues: {
    first_name: string;
    last_name: string;
    phone_number: string;
    email: string;
    role: "Admin" | "User";
  };
  userId: string | number;
  onSuccess?: ( updatedUser: Employee) => void | Promise<void>;
};

const UserUpdateForm = ({ modalClose, initialValues, userId, onSuccess }: Props) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<UserFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      ...initialValues,
      role: initialValues.role === 'Admin' ? 'Admin' : 'User'
    }
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues]);

  const onSubmit = async (values: UserFormSchemaType) => {
    setLoading(true);
    try {
      const payload = {
        firstName: values.first_name,
        lastName: values.last_name,
        phoneNumber: values.phone_number,
        email: values.email,
        roleId: values.role === 'Admin' ? 1 : 2
      };
      const updatedUser = await updateUser(String(userId), payload);
      if (onSuccess) await onSuccess(updatedUser);
      modalClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-2">
      <Heading
        title={'Edit User'}
        description={''}
        className="space-y-2 py-4 "
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          autoComplete="off"
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="User">User</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 pt-2">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={modalClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserUpdateForm;
