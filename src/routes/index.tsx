import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Lazy load de páginas
const LoginPage = lazy(() => import('@/pages/LoginPage').then(module => ({ default: module.LoginPage })));
const HomePage = lazy(() => import('@/pages/HomePage').then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProjectsPage = lazy(() => import('@/pages/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const ProjectFormPage = lazy(() => import('@/pages/ProjectFormPage').then(module => ({ default: module.ProjectFormPage })));
const EmployeesPage = lazy(() => import('@/pages/EmployeesPage').then(module => ({ default: module.EmployeesPage })));
const EmployeeDetailPage = lazy(() => import('@/pages/EmployeeDetailPage').then(module => ({ default: module.EmployeeDetailPage })));
const EmployeeFormPage = lazy(() => import('@/pages/EmployeeFormPage').then(module => ({ default: module.EmployeeFormPage })));
const DepartmentsPage = lazy(() => import('@/pages/DepartmentsPage').then(module => ({ default: module.DepartmentsPage })));
const DepartmentDetailPage = lazy(() => import('@/pages/DepartmentDetailPage').then(module => ({ default: module.DepartmentDetailPage })));
const TechnologiesPage = lazy(() => import('@/pages/TechnologiesPage').then(module => ({ default: module.TechnologiesPage })));
const OfficesPage = lazy(() => import('@/pages/OfficesPage').then(module => ({ default: module.OfficesPage })));
const UsersPage = lazy(() => import('@/pages/UsersPage').then(module => ({ default: module.UsersPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(module => ({ default: module.ProfilePage })));
const ReportsPage = lazy(() => import('@/pages/ReportsPage').then(module => ({ default: module.ReportsPage })));
const SettingsPage = lazy(() => import('@/pages/SettingsPage').then(module => ({ default: module.SettingsPage })));
const TimeEntriesPage = lazy(() => import('@/pages/TimeEntriesPage').then(module => ({ default: module.TimeEntriesPage })));

// Componente de carga
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-muted-foreground">Cargando...</div>
  </div>
);

// Wrapper para Suspense
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingFallback />}>
    {children}
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <LazyWrapper>
        <LoginPage />
      </LazyWrapper>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { 
        index: true, 
        element: (
          <LazyWrapper>
            <HomePage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'dashboard', 
        element: (
          <LazyWrapper>
            <DashboardPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'projects', 
        element: (
          <LazyWrapper>
            <ProjectsPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'projects/:id', 
        element: (
          <LazyWrapper>
            <ProjectDetailPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'projects/new', 
        element: (
          <LazyWrapper>
            <ProjectFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'projects/:id/edit', 
        element: (
          <LazyWrapper>
            <ProjectFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'employees', 
        element: (
          <LazyWrapper>
            <EmployeesPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'employees/:id', 
        element: (
          <LazyWrapper>
            <EmployeeDetailPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'employees/new', 
        element: (
          <LazyWrapper>
            <EmployeeFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'employees/:id/edit', 
        element: (
          <LazyWrapper>
            <EmployeeFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'departments', 
        element: (
          <LazyWrapper>
            <DepartmentsPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'departments/:id', 
        element: (
          <LazyWrapper>
            <DepartmentDetailPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'technologies', 
        element: (
          <LazyWrapper>
            <TechnologiesPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'offices', 
        element: (
          <LazyWrapper>
            <OfficesPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'users', 
        element: (
          <LazyWrapper>
            <UsersPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'profile', 
        element: (
          <LazyWrapper>
            <ProfilePage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'reports', 
        element: (
          <LazyWrapper>
            <ReportsPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'settings', 
        element: (
          <LazyWrapper>
            <SettingsPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'time-entries', 
        element: (
          <LazyWrapper>
            <TimeEntriesPage />
          </LazyWrapper>
        ) 
      },
    ],
  },
]);

