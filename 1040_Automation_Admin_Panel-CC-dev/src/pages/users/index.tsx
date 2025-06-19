import PageHead from '@/components/shared/page-head';
import { useSearchParams } from 'react-router-dom';
import { DataTableSkeleton } from '@/components/shared/data-table-skeleton';
import { Breadcrumbs } from '@/components/shared/breadcrumbs';
import UserTable from './components/user-table';
import { useEffect, useState, useCallback } from 'react';
import { getUsers, archiveUser } from '@/services/userService';
import UserUpdateForm from './components/user-forms/user-update-form';
import TableSearchInput from '@/components/shared/table-search-input';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || 1);
  const pageLimit = Number(searchParams.get('limit') || 10);
  const offset = (page - 1) * pageLimit;

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const [roleFilter, setRoleFilter] = useState<string>('all');
  const search = searchParams.get('search')?.toLowerCase() || '';

  // Function to fetch and update users
  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getUsers();
      const userArray = Array.isArray(data) ? data : [];
      
      // Filter users by search term (name, username, email, phone)
      let filtered = search
        ? userArray.filter(
            (u) =>
              u.first_name?.toLowerCase().includes(search) ||
              u.username?.toLowerCase().includes(search) ||
              u.email?.toLowerCase().includes(search) ||
              u.phone_number?.toLowerCase().includes(search)
          )
        : userArray;
      
      // Filter by role if not 'all'
      if (roleFilter !== 'all') {
        filtered = filtered.filter(u => u.role === roleFilter);
      }
      
      setTotalUsers(filtered.length);
      setUsers(filtered.slice(offset, offset + pageLimit));
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  }, [offset, pageLimit, search, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = async (user: any) => {
    try {
      await archiveUser(user.id);
       

  setUsers((prev) => prev.filter((u) => u.id !== user.id));
      // Refresh users after deletion

    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (user: any) => {
    setEditingUser(user);
  };

  const handleUserCreated = useCallback(async () => {
  try {
    const allUsers = await getUsers();
    const userArray = Array.isArray(allUsers) ? allUsers : [];

    // Get the most recently created user (assuming last in list)
    const newlyCreatedUser = userArray[0];

    // Optional: check if they match current search or filter
    if (
      (roleFilter === 'all' || newlyCreatedUser.role === roleFilter) &&
      (
        newlyCreatedUser.first_name?.toLowerCase().includes(search) ||
        newlyCreatedUser.username?.toLowerCase().includes(search) ||
        newlyCreatedUser.email?.toLowerCase().includes(search) ||
        newlyCreatedUser.phone_number?.toLowerCase().includes(search)
      )
    ) {
      setUsers((prev) => [newlyCreatedUser, ...prev.slice(0, pageLimit - 1)]);
      setTotalUsers((prev) => prev + 1);
    } else {
      // fallback: reload normally
      await fetchUsers();
    }
  } catch (err) {
    console.error("Failed to refresh users after creation", err);
  }
}, [roleFilter, search, fetchUsers, pageLimit]);

  
const handleUserUpdated = useCallback(async (updatedUser: any) => {
  setEditingUser(null);

  setUsers((prevUsers) =>
    prevUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    )
  );
}, []);

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
          User Management
        </h2>
      </div>
     
      <UserTable
        users={users}
        totalUsers={totalUsers}
        pageCount={pageCount}
        page={page}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onUserCreated={handleUserCreated}
      />
      
      {editingUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-md min-w-[300px]">
            <UserUpdateForm
              modalClose={() => setEditingUser(null)}
              initialValues={{
                first_name: editingUser.first_name,
                last_name: editingUser.last_name,
                phone_number: editingUser.phone_number,
                email: editingUser.email,
                role: editingUser.role === 'Admin' ? 'Admin' : 'User',
              }}
              userId={editingUser.id}
              onSuccess={handleUserUpdated}
            />
          </div>
        </div>
      )}
      
      
    </div>
  );
}