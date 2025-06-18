import { ROLES } from '@/constants/roles';
import { NavItem } from '@/types/nav';

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: 'dashboard',
    label: 'Dashboard',
    roles: [ROLES.ADMIN] // Accessible to both Admin and User roles
  },
  {
    title: 'Users',
    href: '/user',
    icon: 'user',
    label: 'Users',
    roles: [ROLES.ADMIN] // Accessible to Admin role only
  },
  {
    title: 'Client Registration',
    href: '/client_registration',
    icon: 'profile',
    label: 'Client Registration',
    roles: [ROLES.ADMIN, ROLES.USER] // Accessible to both Admin and User roles
  },
  {
    title: 'Task Creation',
    href: '/task_master',
    icon: 'kanban', // Changed from 'settings' to 'kanban' for a more relevant task logo
    label: 'Task Creation',
    roles: [ROLES.ADMIN, ROLES.USER] // Accessible to both Admin and User roles
  },
  {
    title: 'Admin Configurations',
    href: '/adminConfigurations',
    icon: 'settings',
    label: 'Admin Configurations',
    roles: [ROLES.ADMIN] // Accessible to Admin role only
  }
];

