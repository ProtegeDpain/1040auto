import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

// Define a type for your user data (based on your previous dummy data)
export type User = {
  id: number;
  slno: number;
  full_name: string;
  phone_number: string;
  email: string;
  password_hash: string;
  role_id: number;
  is_active: boolean;
  is_archieve: boolean;
  created_at: string;
  updated_at: string;
  date_registered: string;
};

export const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'first_name',
    header: () => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        NAME
      </th>
    ),
    cell: ({ row }) => (
      //@ts-ignore
      <td className="border-b border-border px-4 py-2 font-medium">{`${row.original.first_name} ${row.original.last_name}`}</td>
    )
  },
  {
    accessorKey: 'username',
    header: () => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        USER NAME
      </th>
    ),
    cell: ({ row }) => (
      <td className="border-b border-border px-4 py-2">
        {
        //@ts-ignore
        row.original.username}
      </td>
    )
  },
  {
    accessorKey: 'email',
    header: () => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        EMAIL
      </th>
    ),
    cell: ({ row }) => (
      <td className="border-b border-border px-4 py-2">{row.original.email}</td>
    )
  },
  {
    accessorKey: 'role',
    header: () => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        ROLE
      </th>
    ),
    cell: ({ row }) => {
      //@ts-ignore
      const role = row.original.role;
      let badgeColor = '';
      switch (role?.toLowerCase()) {
        case 'admin':
          badgeColor = 'bg-blue-100 text-blue-800';
          break;
        case 'user':
          badgeColor = 'bg-pink-100 text-pink-800';
          break;
      
        default:
          badgeColor = 'bg-gray-100 text-gray-800';
      }
      return (
        <td className="border-b border-border px-4 py-2">
          <Badge className={`font-medium ${badgeColor}`}>{role}</Badge>
        </td>
      );
    }
  },
  {
    id: 'actions',
    header: () => (
      <th className="border-b border-border bg-muted px-4 py-2 text-left font-semibold">
        ACTIONS
      </th>
    ),
    cell: ({ row }) => (
      <td className="border-b border-border px-4 py-2">
        <CellAction data={row.original} />
      </td>
    )
  }
];