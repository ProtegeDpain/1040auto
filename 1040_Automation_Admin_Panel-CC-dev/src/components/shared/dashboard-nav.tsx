'use client';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/lib/utils';
import { NavItem } from '@/types/nav';
import { Dispatch, SetStateAction } from 'react';
import { useSidebar } from '@/hooks/use-sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { usePathname } from '@/routes/hooks';
import { Link } from 'react-router-dom';
import { RoleGuard } from '@/components/role-gaurd';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import * as Popover from '@radix-ui/react-popover';
interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export default function DashboardNav({
  items,
  setOpen,
  isMobileNav = false
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const { logout } = useAuth();
  const navigate = useNavigate();

  if (!items?.length) {
    return null;
  }

  console.log('isActive', isMobileNav, isMinimized);

  return (
    <nav className="grid items-start gap-2">
      <TooltipProvider>
        {items.map((item, index) => {
          const Icon = Icons[item.icon || 'arrowRight'];

          return (
            <RoleGuard key={index} allowedRoles={item.roles || []}>
              {item.href && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      to={item.disabled ? '/' : item.href}
                      className={cn(
                        'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:text-muted-foreground',
                        path === item.href
                          ? 'bg-white text-black hover:text-black'
                          : 'transparent',
                        item.disabled && 'cursor-not-allowed opacity-80'
                      )}
                      onClick={() => {
                        if (setOpen) setOpen(false);
                      }}
                    >
                      <Icon className={`ml-2.5 size-5`} />

                      {isMobileNav || (!isMinimized && !isMobileNav) ? (
                        <span className="mr-2 truncate">{item.title}</span>
                      ) : (
                        ''
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    align="center"
                    side="right"
                    sideOffset={8}
                    className={!isMinimized ? 'hidden' : 'inline-block'}
                  >
                    {item.title}
                  </TooltipContent>
                </Tooltip>
              )}
            </RoleGuard>
          );
        })}
        <Popover.Root>
        <Popover.Trigger asChild>
          <button
              className={cn(
                'flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium text-red-600 hover:text-red-700 ml-2.5'
              )}
            >
              <Icons.login className="size-5" />
              {isMobileNav || (!isMinimized && !isMobileNav) ? (
                <span className="mr-2 truncate">Log out</span>
              ) : (
                ''
              )}
            </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
  align="center"
  side={isMobileNav || (!isMinimized && !isMobileNav) ? 'bottom' : 'right'}
  sideOffset={8}
  className={`w-64 rounded-md bg-white border p-4 shadow-lg ${
    isMobileNav || (!isMinimized && !isMobileNav) ? 'z-50' : 'z-20'
  }`}
>
            <div className="flex flex-col gap-4">
              <span className="text-sm text-gray-800">
                Are you sure you want to log out?
              </span>
              <div className="flex justify-end gap-2">
                <Popover.Close asChild>
                  <button className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
                    Cancel
                  </button>
                </Popover.Close>
                <button
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={() => {
                    alert('Logged out');
                    logout();
                    navigate('/login');
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
            <Popover.Arrow className="fill-white" />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      </TooltipProvider>
    </nav>
  );
}
