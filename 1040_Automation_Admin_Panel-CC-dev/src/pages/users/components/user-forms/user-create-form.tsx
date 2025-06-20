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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { createUser } from '@/services/userService';
import { toast } from 'react-toastify';
import { validateForm } from '@/utils/validationErrorHandler';

const userFormSchema = z
  .object({
    first_name: z
      .string({ required_error: 'First name is required' })
      .min(1, { message: 'First Name should be at least 1 character' }),
    last_name: z.string().min(1, { message: 'Last Name is required' }),
    phone_number: z.string().min(1, { message: 'Phone number is required' }),
    email: z.string().email({ message: 'Enter a valid email address' }),
    password_hash: z.string().min(1, { message: 'Password is required' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm Password is required' }),
    role: z.enum(['Admin', 'User'], {
      required_error: 'Role is required'
    })
  })
  .refine((data) => data.password_hash === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword']
  });

type UserFormSchemaType = z.infer<typeof userFormSchema>;

interface UserCreateFormProps {
  modalClose: () => void;
  onUserCreated?: () => void;
}

const UserCreateForm = ({ modalClose, onUserCreated }: UserCreateFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UserFormSchemaType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      phone_number: '',
      email: '',
      password_hash: '',
      confirmPassword: '',
      role: undefined
    }
  });

  const onSubmit = async (values: UserFormSchemaType) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Validate the data first
      const validationResult = await validateForm(userFormSchema, values);
      if (!validationResult.isValid && validationResult.errors) {
        validationResult.errors.forEach((error) => {
          toast.error(`${error.field}: ${error.message}`);
        });
        return;
      }

      // Map form values to API payload
      const payload = {
        firstName: values.first_name,
        lastName: values.last_name,
        phoneNumber: values.phone_number,
        email: values.email,
        password: values.password_hash,
        confirmPassword: values.confirmPassword,
        roleId: values.role === 'Admin' ? 1 : 2 // Adjust role mapping as needed
      };

      await createUser(payload);
      toast.success('User created successfully');

      // Close modal first
      modalClose();

      // Then trigger the callback to refresh the user list
      if (onUserCreated) {
        onUserCreated();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-2">
      <Heading
        title={'Create New User'}
        description={''}
        className="space-y-2 py-4 "
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          autoComplete="off"
        >
          {/* Main fields */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter First Name" {...field} />
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
                    <FormLabel>Last name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Last Name" {...field} />
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
            <div className="flex flex-col gap-6 md:flex-row">
              <FormField
                control={form.control}
                name="password_hash"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Enter password"
                          type={showPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Confirm password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          {...field}
                          className="pr-12"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </Button>
                      </div>
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
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create User'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UserCreateForm;