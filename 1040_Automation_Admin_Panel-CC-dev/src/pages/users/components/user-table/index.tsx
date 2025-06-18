import { Employee } from '@/types/employee';
import StudentTableActions from './student-table-action';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import DataTable from '@/components/shared/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { ROLES } from '@/constants/roles';

interface UserTableProps {
  users: Employee[];
  totalUsers?: number;
  pageCount?: number;
  page?: number;
  onEdit?: (user: Employee) => void;
  onDelete?: (user: Employee) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  // Define columns for DataTable
  const columns: ColumnDef<any>[] = [
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(row.original)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="mb-6 items-center">
      <StudentTableActions />
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
        User Management
      </h2>
      <div className="mb-6 overflow-hidden rounded-lg border border-border bg-white p-0">
        <DataTable columns={columns} data={users} pageCount={1} />
      </div>
    </div>
  );
}
