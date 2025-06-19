import React from 'react';
import PopupModal from '@/components/shared/popup-modal';
import TableSearchInput from '@/components/shared/table-search-input';
import StudentCreateForm from '../user-forms/user-create-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface StudentTableActionsProps {
  onSearch: (searchTerm: string) => void;
  searchValue: string;
  onRoleFilter: (role: string) => void;
  selectedRole: string;
  availableRoles: string[];
  onUserCreated?: () => void;
}

export default function StudentTableActions({ 
  onSearch, 
  searchValue, 
  onRoleFilter, 
  selectedRole, 
  availableRoles,
  onUserCreated
}: StudentTableActionsProps) {
  const handleRoleChange = (value: string) => {
    // If "all" is selected, clear the filter
    if (value === "all") {
      onRoleFilter('');
    } else {
      onRoleFilter(value);
    }
  };

  const clearRoleFilter = () => {
    onRoleFilter('');
  };

  return (
    <div className="flex items-center justify-between gap-2 py-5">
      <div className="flex flex-1 gap-4">
        <TableSearchInput 
          placeholder="Search Users Here" 
          value={searchValue}
          onChange={onSearch}
        />
        
        <div className="flex items-center gap-2">
          <Select value={selectedRole || "all"} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {availableRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedRole && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearRoleFilter}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <div className="flex gap-3">
        <PopupModal
          renderModal={(onClose) => (
            <StudentCreateForm 
              modalClose={onClose} 
              onUserCreated={onUserCreated}
            />
          )}
        />
      </div>
    </div>
  );
}