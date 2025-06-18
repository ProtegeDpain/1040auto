import FormPage from '@/pages/form';
import NotFound from '@/pages/not-found';
import ServerMaster from '@/pages/ServerMaster';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import ProtectedRote from '@/components/protected-route';
import { useAuth } from '@/contexts/auth-context';
import { ROLES } from '@/constants/roles';

const DashboardLayout = lazy(
  () => import('@/components/layout/dashboard-layout')
);
const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));
const User = lazy(() => import('@/pages/users'));
const ClientRegistrationPage = lazy(() => import('@/pages/clientRegistration'));
const TaskCreation = lazy(() => import('@/pages/taskCreation'));
const StudentDetailPage = lazy(() => import('@/pages/users/UserDetailPage'));
const RoleMaster = lazy(() => import('@/pages/roleMaster'));
const BrandingMaster = lazy(() => import('@/pages/brandingMaster'));
const AdminConfigurations = lazy(() => import('@/pages/adminConfigurations'));


export default function AppRouter() {
  const { user } = useAuth();
  const userRole = Number(user?.role); // Default to 2 if not set

  const dashboardRoutes = [
    {
      path: '/',
      element: (
        <DashboardLayout userRole={userRole}>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        {
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <DashboardPage />
            </ProtectedRote>
          ),
          index: true
        },
        {
          path: 'user',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN]}>
              <User />
            </ProtectedRote>
          )
        },
        {
          path: 'student/details',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <StudentDetailPage />
            </ProtectedRote>
          )
        },
        {
          path: 'client_registration',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <ClientRegistrationPage />
            </ProtectedRote>
          )
        },
        {
          path: 'task_master',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <TaskCreation />
            </ProtectedRote>
          )
        },
        {
          path: 'role_master',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN]}>
              <RoleMaster />
            </ProtectedRote>
          )
        },
        {
          path: 'branding_master',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN]}>
              <BrandingMaster />
            </ProtectedRote>
          )
        },
        {
          path: 'server_master',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN]}>
              <ServerMaster />
            </ProtectedRote>
          )
        },
        {
          path: 'adminConfigurations',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN]}>
              <AdminConfigurations />
            </ProtectedRote>
          )
        },
        {
          path: 'form',
          element: (
            <ProtectedRote allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <FormPage />
            </ProtectedRote>
          )
        }
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/login',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...dashboardRoutes, ...publicRoutes]);

  return routes;
}
