import FormPage from '@/pages/form';
import NotFound from '@/pages/not-found';
import ServerMaster from '@/pages/ServerMaster';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import ProtectedRoute from '@/components/protected-route';
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
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <DashboardPage />
            </ProtectedRoute>
          ),
          index: true
        },
        {
          path: 'user',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <User />
            </ProtectedRoute>
          )
        },
        {
          path: 'student/details',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <StudentDetailPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'client_registration',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <ClientRegistrationPage />
            </ProtectedRoute>
          )
        },
        {
          path: 'task_master',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <TaskCreation />
            </ProtectedRoute>
          )
        },
        {
          path: 'role_master',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <RoleMaster />
            </ProtectedRoute>
          )
        },
        {
          path: 'branding_master',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <BrandingMaster />
            </ProtectedRoute>
          )
        },
        {
          path: 'server_master',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <ServerMaster />
            </ProtectedRoute>
          )
        },
        {
          path: 'adminConfigurations',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
              <AdminConfigurations />
            </ProtectedRoute>
          )
        },
        {
          path: 'form',
          element: (
            <ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.USER]}>
              <FormPage />
            </ProtectedRoute>
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
