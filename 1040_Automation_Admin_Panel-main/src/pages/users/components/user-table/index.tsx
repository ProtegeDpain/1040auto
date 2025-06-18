import { Employee } from '@/types/employee';
import StudentTableActions from './student-table-action';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

interface UserTableProps {
  users: Employee[];
  onEdit: (user: Employee) => void;
  onDelete: (user: Employee) => void;
}

export default function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="mb-6 items-center">
      <StudentTableActions />
      <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
        User Management
      </h2>
      <div className="mb-6 overflow-hidden rounded-lg border border-border bg-white p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="border-b border-border px-4 py-2 text-left font-semibold">
                Name
              </th>
              <th className="border-b border-border px-4 py-2 text-left font-semibold">
                User Name
              </th>
              <th className="border-b border-border px-4 py-2 text-left font-semibold">
                Email
              </th>
              <th className="border-b border-border px-4 py-2 text-left font-semibold">
                Role
              </th>
              <th className="border-b border-border px-4 py-2 text-left font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-gray-50">
                <td className="border-b border-border px-4 py-2 font-medium">
                  {user.first_name} {user.last_name}
                </td>
                <td className="border-b border-border px-4 py-2">
                  {user.username}
                </td>
                <td className="border-b border-border px-4 py-2">
                  {user.email}
                </td>
                <td className="border-b border-border px-4 py-2">
                  <span
                    className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
                      user.role === 'Admin'
                        ? 'bg-blue-100 text-blue-800'
                        : user.role === 'User'
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="border-b border-border px-4 py-2">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(user)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
