

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { useRouter } from '@/routes/hooks';
// import { useState } from 'react';
// import { Link } from 'react-router-dom';

// export default function UserAuthForm() {
//   const router = useRouter();
//   const [loading] = useState(false);

//   const onSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     router.push('/');
//   };

//   return (
//     <div className="w-full space-y-4">
//       <div>
//         <label className="block text-sm font-medium">Email Address</label>
//         <Input
//           type="email"
//           placeholder="your.email@example.com"
//           disabled={loading}
//           className="rounded-lg border-gray-300 bg-gray-100 px-4 py-3"
//         />
//       </div>
//       <div>
//         <div className="flex justify-between items-center">
//           <label className="block text-sm font-medium">Password</label>
//           <Link
//             to="/forgot-password"
//             className="text-sm text-[#1b9bd8] hover:underline"
//           >
//             Forget your password?
//           </Link>
//         </div>
//         <Input
//           type="password"
//           placeholder="••••••••"
//           disabled={loading}
//           className="rounded-lg border-gray-300 bg-gray-100 px-4 py-3"
//         />
//       </div>
//       <Button
//         disabled={loading}
//         className="ml-auto w-full"
//         type="submit"
//         onClick={onSubmit}
//       >
//         Login
//       </Button>
//     </div>
//   );
// }

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRouter } from '@/routes/hooks';
import { useAuth } from '@/contexts/auth-context';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function UserAuthForm() {
  const { login } = useAuth(); // Use login from AuthContext
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    setLoading(true);
    try {
      await login(email, password); // Call login from AuthContext
      router.push('/task_master'); // Redirect to Task_master route on successful login
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        alert(error.message); // Show error message to the user
      } else {
        alert('An unknown error occurred'); // Handle unknown error types
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium">Email Address</label>
        <Input
          type="email"
          name="email"
          placeholder="your.email@example.com"
          disabled={loading}
          className="rounded-lg border-gray-300 bg-gray-100 px-4 py-3"
        />
      </div>
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Password</label>
          {/* <Link
            to="/forgot-password"
            className="text-sm text-[#1b9bd8] hover:underline"
          >
            Forget your password?
          </Link> */}
        </div>
        <Input
          type="password"
          name="password"
          placeholder="••••••••"
          disabled={loading}
          className="rounded-lg border-gray-300 bg-gray-100 px-4 py-3"
        />
      </div>
      <Button
        disabled={loading}
        className="ml-auto w-full"
        type="submit"
      >
        Login
      </Button>
    </form>
  );
}