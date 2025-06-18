import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

const defaultRoles = [
  { id: 1, name: 'Standard User' },
  { id: 2, name: 'Admin User' }
];

export default function AdminConfigurations() {
  // Logo state
  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  // Title state
  const [title, setTitle] = useState('1040 Automation Admin Panel');

  // Favicon URL state
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null);

  // Roles state
  const [roles, setRoles] = useState(defaultRoles);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [roleEdit, setRoleEdit] = useState<{
    id?: number;
    name: string;
  } | null>(null);

  // Logo upload handler
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Title update handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // Role handlers
  const handleRoleSave = () => {
    if (!roleEdit || !roleEdit.name.trim()) return;
    if (roleEdit.id) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === roleEdit.id ? { ...r, name: roleEdit.name } : r
        )
      );
    } else {
      setRoles((prev) => [...prev, { id: Date.now(), name: roleEdit.name }]);
    }
    setRoleDialogOpen(false);
    setRoleEdit(null);
  };

  const handleRoleDelete = (id: number) => {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-6">
      <h1 className="mb-6 text-2xl font-bold">Admin Configurations</h1>
      {/* Logo and Title Update (Combined) */}
      <Card className="flex flex-col gap-6 p-6 md:flex-row md:items-center">
        <div className="flex-1">
          <h2 className="mb-2 text-lg font-semibold">Update Logo</h2>
          <p className="mb-4 text-sm text-gray-500">
            Upload a new logo for your webapp.
          </p>
          <Input type="file" accept="image/*" onChange={handleLogoChange} />
          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold">
              Update Webapp Name/Title
            </h2>
            <Input
              value={title}
              onChange={handleTitleChange}
              className="max-w-md"
            />
            <div className="mt-4">
              <h2 className="mb-2 text-lg font-semibold">Favicon URL</h2>
              <Input
                value={faviconUrl || ''}
                onChange={(e) => setFaviconUrl(e.target.value)}
                className="max-w-md"
                placeholder="https://example.com/favicon.ico"
              />
            </div>
          </div>
        </div>
        <div className="flex h-32 w-32 items-center justify-center rounded border bg-gray-50">
          {logoPreview ? (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="max-h-28 max-w-28 object-contain"
            />
          ) : (
            <img
              src="/Zylitix-Logo-light.png"
              alt="Default Logo"
              className="max-h-28 max-w-28 object-contain opacity-60"
            />
          )}
        </div>
      </Card>

      {/* Roles Management */}
      <Card className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Manage User Roles</h2>
          <Button
            onClick={() => {
              setRoleEdit({ name: '' });
              setRoleDialogOpen(true);
            }}
          >
            + Add New Role
          </Button>
        </div>
        <div className="space-y-2">
          {roles.map((role) => (
            <div
              key={role.id}
              className="flex items-center gap-4 rounded border bg-gray-50 px-4 py-2"
            >
              <span className="flex-1">{role.name}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setRoleEdit(role);
                  setRoleDialogOpen(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleRoleDelete(role.id)}
                disabled={
                  roles.length <= 2 &&
                  (role.name === 'Standard User' || role.name === 'Admin User')
                }
              >
                Delete
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {roleEdit?.id ? 'Edit Role' : 'Add New Role'}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={roleEdit?.name || ''}
            onChange={(e) =>
              setRoleEdit((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Role name"
            className="mb-4"
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleSave} disabled={!roleEdit?.name.trim()}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
