import PageHead from '@/components/shared/page-head';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import UserTable from './components/user-table';

// Example dummy users array
const dummyUsers = [
  {
    id: 1,
    slno: 1,
    first_name: "John",
    last_name: "Doe",
    full_name: "John Doe",
    username: "johndoe",
    phone_number: "1234567890",
    email: "john@example.com",
    password_hash: "hashedpassword1",
    role: "Admin",
    role_id: 1,
    is_active: true,
    is_archieve: false,
    created_at: "2024-06-01T10:00:00Z",
    updated_at: "2024-06-05T12:00:00Z",
    date_registered: "2024-06-01T10:00:00Z"
  },
  {
    id: 2,
    slno: 2,
    first_name: "Jane",
    last_name: "Smith",
    full_name: "Jane Smith",
    username: "janesmith",
    phone_number: "9876543210",
    email: "jane@example.com",
    password_hash: "hashedpassword2",
    role: "User",
    role_id: 2,
    is_active: true,
    is_archieve: false,
    created_at: "2024-06-02T11:00:00Z",
    updated_at: "2024-06-06T13:00:00Z",
    date_registered: "2024-06-02T11:00:00Z"
  }
  // Add more users as needed
];

export default function StudentPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const country = searchParams.get('search') || null;
  const offset = (page - 1) * pageLimit;
  const isLoading = false; // Simulate no loading for dummy data
  const users = dummyUsers.slice(offset, offset + pageLimit);
  const totalUsers = dummyUsers.length;
  const pageCount = Math.ceil(totalUsers / pageLimit);

  if (isLoading) {
    return (
      <div className="p-5">
        <DataTableSkeleton
          columnCount={10}
          filterableColumnCount={2}
          searchableColumnCount={1}
        />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <PageHead title="Student Management | App" />
      <div className="flex items-center justify-between space-y-2 mb-2">
        <h2 className="text-3xl font-bold tracking-tight">
          1040 Automation
        </h2>
      </div>
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Users', link: '/user' }
        ]}
      />
      <UserTable
      //@ts-ignore
        users={users}
        page={page}
        totalUsers={totalUsers}
        pageCount={pageCount}
      />
    </div>
  );
}