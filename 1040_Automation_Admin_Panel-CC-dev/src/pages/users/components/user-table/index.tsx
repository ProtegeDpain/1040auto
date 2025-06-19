import React, { useState, useMemo } from 'react';
import { Employee } from '@/types/employee';
import StudentTableActions from './student-table-action';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ROLES } from '@/constants/roles';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface UserTableProps {
  users: Employee[];
  totalUsers?: number;
  pageCount?: number;
  page?: number;
  onEdit?: (user: Employee) => void;
  onDelete?: (user: Employee) => void;
  onUserCreated?: () => void;
}

export default function UserTable({ users, onEdit, onDelete, onUserCreated }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

  // Get unique roles from users for filter options
  const availableRoles = useMemo(() => {
    const roles = users.map(user => String(user.role)).filter(Boolean);
    return Array.from(new Set(roles));
  }, [users]);

  // Filter users based on search term and role filter
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(user => {
        const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
        const username = (user.username || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const role = String(user.role || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return fullName.includes(search) || 
               username.includes(search) || 
               email.includes(search) || 
               role.includes(search);
      });
    }

    // Apply role filter
    if (selectedRole) {
      filtered = filtered.filter(user => String(user.role) === selectedRole);
    }

    return filtered;
  }, [users, searchTerm, selectedRole]);

  // Define columns for DataTable
  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: () => <div className="font-semibold">Name</div>,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name || ''} {row.original.last_name || ''}
        </span>
      )
    },
    {
      accessorKey: 'username',
      header: () => <div className="font-semibold">User Name</div>,
      cell: ({ row }) => <span>{row.original.username}</span>
    },
    {
      accessorKey: 'email',
      header: () => <div className="font-semibold">Email</div>,
      cell: ({ row }) => <span>{row.original.email}</span>
    },
    {
      accessorKey: 'role',
      header: () => <div className="font-semibold">Role</div>,
      cell: ({ row }) => (
        <span
          className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
            row.original.role === ROLES.ADMIN
              ? 'bg-blue-100 text-blue-800'
              : row.original.role === ROLES.USER
                ? 'bg-pink-100 text-pink-800'
                : 'bg-purple-100 text-purple-800'
          }`}
        >
          {row.original.role}
        </span>
      )
    },
    {
      id: 'actions',
      header: () => <div className="font-semibold">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(row.original)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="center" side="right" sideOffset={8}>
                <div className="flex flex-col gap-4">
                  <span className="text-sm">Are you sure you want to delete?</span>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(row.original)}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="mb-6 items-center">
      <StudentTableActions 
        onSearch={setSearchTerm} 
        searchValue={searchTerm}
        onRoleFilter={setSelectedRole}
        selectedRole={selectedRole}
        availableRoles={availableRoles}
        onUserCreated={onUserCreated}
      />
      <div className="mb-6 overflow-hidden rounded-lg border border-border bg-white p-0">
        <DataTable columns={columns} data={filteredUsers} pageCount={1} />
      </div>
    </div>
  );
}