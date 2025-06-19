import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TableSearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

export default function TableSearchInput({ 
  placeholder = "Search...", 
  value = "", 
  onChange,
  className = ""
}: TableSearchInputProps) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent any form submission
    const newValue = e.target.value;
    onChange?.(newValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent form submission on Enter key
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        className="pl-9"
      />
    </div>
  );
}