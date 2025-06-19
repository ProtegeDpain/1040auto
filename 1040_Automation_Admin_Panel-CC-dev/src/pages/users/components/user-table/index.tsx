import React, { useState, useMemo } from 'react';
import { Employee } from '@/types/employee';
import StudentTableActions from './student-table-action';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';

import * as Popover from '@radix-ui/react-popover';

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
        const firstName = (user.first_name).toLowerCase();
        const lastName = (user.last_name || '').toLowerCase();
        const email = (user.email || '').toLowerCase();
        const role = String(user.role || '').toLowerCase();
        const search = searchTerm.toLowerCase();
        
        return firstName.includes(search) || 
               lastName.includes(search) || 
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
      accessorKey: 'firstName',
      header: () => <div className="font-semibold">First Name</div>,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.first_name || ''}
        </span>
      )
    },
    {
      accessorKey: 'lastName',
      header: () => <div className="font-semibold">Last Name</div>,
      cell: ({ row }) => (
        <span className="font-medium">
          {row.original.last_name || ''}
        </span>
      )
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
          className={`inline-block rounded px-2 py-1 text-xs font-semibold`}
        >
          {row.original.role}
        </span>
      )
    },
    {
      id: 'actions',
      header: () => <div className="font-semibold text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex gap-2 justify-center">
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
            <Popover.Root>
        <Popover.Trigger asChild>
          <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="center"
            side="left"
            sideOffset={8}
            className="w-64 rounded-md bg-white border p-4 shadow-lg"
          >
            <div className="flex flex-col gap-4">
                  <span className="text-sm">Are you sure you want to delete?</span>
                  <div className="flex justify-end gap-2">
                    <Popover.Close>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </Button>
                    </Popover.Close>
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
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
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