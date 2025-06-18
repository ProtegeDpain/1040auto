import PageHead from '@/components/shared/page-head';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import UserTable from './components/user-table';
import { useEffect, useState } from 'react';
import { getUsers, archiveUser} from '@/services/userService';
import UserUpdateForm from './components/user-forms/user-update-form';
import TableSearchInput from '@/components/shared/table-search-input';


export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const offset = (page - 1) * pageLimit;

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const search = searchParams.get('search')?.toLowerCase() || '';

  useEffect(() => {
    setIsLoading(true);
    getUsers().then((data: any[]) => {
      const userArray = Array.isArray(data) ? data : [];
      // Filter users by search term (name, username, email, phone)
      const filtered = search
        ? userArray.filter(
            (u) =>
              u.first_name?.toLowerCase().includes(search) ||
              u.username?.toLowerCase().includes(search) ||
              u.email?.toLowerCase().includes(search) ||
              u.phone_number?.toLowerCase().includes(search)
          )
        : userArray;
      setTotalUsers(filtered.length);
      setUsers(filtered.slice(offset, offset + pageLimit));
      setIsLoading(false);
    });
  }, [offset, pageLimit, search]);

  const handleDelete = async (user: any) => {
    try {
      await archiveUser(user.id);
      // Refresh users after deletion
      setIsLoading(true);
      const data = await getUsers();
      const userArray = Array.isArray(data) ? data : [];
      setTotalUsers(userArray.length);
      setUsers(userArray.slice(offset, offset + pageLimit));
      setIsLoading(false);
    } catch (error) {
      // Optionally show error message
      console.error(error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
  };

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
        <TableSearchInput placeholder="Search users..." />
      </div>
      <Breadcrumbs
        items={[
          { title: 'Dashboard', link: '/' },
          { title: 'Users', link: '/user' }
        ]}
      />
      <UserTable
        users={users}
        totalUsers={totalUsers}
        pageCount={pageCount}
        page={page}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <UserUpdateForm
              modalClose={() => setEditingUser(null)}
              initialValues={{
                full_name: editingUser.first_name,
                username: editingUser.username,
                phone_number: editingUser.phone_number,
                email: editingUser.email,
                role: editingUser.role === 'Admin' ? 'Admin' : 'User',
              }}
              userId={editingUser.id}
              onSuccess={async () => {
                setEditingUser(null);
                setIsLoading(true);
                const data = await getUsers();
                const userArray = Array.isArray(data) ? data : [];
                setTotalUsers(userArray.length);
                setUsers(userArray.slice(offset, offset + pageLimit));
                setIsLoading(false);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}