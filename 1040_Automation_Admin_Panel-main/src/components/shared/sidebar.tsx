'use client';
import DashboardNav from '@/components/shared/dashboard-nav';
import { navItems } from '@/routes/navItems';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { ChevronsLeft } from 'lucide-react';
import { useState } from 'react';
import { Dispatch, SetStateAction } from 'react';

type SidebarProps = {
  className?: string;
   setSidebarOpen: Dispatch<SetStateAction<boolean>>;
    sidebarOpen: boolean;
     userRole: number;
};

export default function Sidebar({ className }: SidebarProps) {
  const { isMinimized, toggle } = useSidebar();
  const [status, setStatus] = useState(false);

  const handleToggle = () => {
    setStatus(true);
    toggle();
    setTimeout(() => setStatus(false), 500);
  };
  return (
    <nav
      className={cn(
        `relative z-10 hidden h-screen flex-none px-3 md:block`,
        status && 'duration-500',
        !isMinimized ? 'w-72' : 'w-[80px]',
        className
      )}
    >
      <div
        className={cn(
          'flex items-center px-0 py-5 md:px-2',
          isMinimized ? 'justify-center' : 'justify-between'
        )}
      >
        {!isMinimized && (
          <img 
            src="/Zylitix-Logo-light.png" 
            alt="Zylitix Logo" 
            className="h-14" // Adjust height as needed
          />
        )}
        <ChevronsLeft
          className={cn(
            'size-8 cursor-pointer rounded-full border bg-background text-foreground',
            isMinimized && 'rotate-180'
          )}
          onClick={handleToggle}
        />
      </div>
      <div className="space-y-4 py-4">
        <div className="px-2 py-2">
          <div className="mt-3 space-y-1">
            <DashboardNav items={navItems} />
          </div>
        </div>
      </div>
    </nav>
  );
}