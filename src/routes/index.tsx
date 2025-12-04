import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';

// Lazy load de páginas
const LoginPage = lazy(() => import('@/pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const HomePage = lazy(() => import('@/pages/dashboard/HomePage').then(module => ({ default: module.HomePage })));
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })));
const ProjectsPage = lazy(() => import('@/pages/projects/ProjectsPage').then(module => ({ default: module.ProjectsPage })));
const ProjectDetailPage = lazy(() => import('@/pages/projects/ProjectDetailPage').then(module => ({ default: module.ProjectDetailPage })));
const ProjectFormPage = lazy(() => import('@/pages/projects/ProjectFormPage').then(module => ({ default: module.ProjectFormPage })));
const EmployeesPage = lazy(() => import('@/pages/employees/EmployeesPage').then(module => ({ default: module.EmployeesPage })));
const EmployeeDetailPage = lazy(() => import('@/pages/employees/EmployeeDetailPage').then(module => ({ default: module.EmployeeDetailPage })));
const EmployeeFormPage = lazy(() => import('@/pages/employees/EmployeeFormPage').then(module => ({ default: module.EmployeeFormPage })));
const DepartmentsPage = lazy(() => import('@/pages/departments/DepartmentsPage').then(module => ({ default: module.DepartmentsPage })));
const DepartmentDetailPage = lazy(() => import('@/pages/departments/DepartmentDetailPage').then(module => ({ default: module.DepartmentDetailPage })));
const TechnologiesPage = lazy(() => import('@/pages/technologies/TechnologiesPage').then(module => ({ default: module.TechnologiesPage })));
const TechnologyFormPage = lazy(() => import('@/pages/technologies/TechnologyFormPage').then(module => ({ default: module.TechnologyFormPage })));
const OfficesPage = lazy(() => import('@/pages/offices/OfficesPage').then(module => ({ default: module.OfficesPage })));
const OfficeDetailPage = lazy(() => import('@/pages/offices/OfficeDetailPage').then(module => ({ default: module.OfficeDetailPage })));
const OfficeFormPage = lazy(() => import('@/pages/offices/OfficeFormPage').then(module => ({ default: module.OfficeFormPage })));
const UsersPage = lazy(() => import('@/pages/users/UsersPage').then(module => ({ default: module.UsersPage })));
const ProfilePage = lazy(() => import('@/pages/settings/ProfilePage').then(module => ({ default: module.ProfilePage })));
const ReportsPage = lazy(() => import('@/pages/reports/ReportsPage').then(module => ({ default: module.ReportsPage })));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage').then(module => ({ default: module.SettingsPage })));
const TimeEntriesPage = lazy(() => import('@/pages/time-entries/TimeEntriesPage').then(module => ({ default: module.TimeEntriesPage })));
const FacturacionPage = lazy(() => import('@/pages/billing/FacturacionPage').then(module => ({ default: module.FacturacionPage })));
const ProjectInvoicesPage = lazy(() => import('@/pages/billing/ProjectInvoicesPage').then(module => ({ default: module.ProjectInvoicesPage })));

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
        path: 'technologies/new', 
        element: (
          <LazyWrapper>
            <TechnologyFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'technologies/:id/edit', 
        element: (
          <LazyWrapper>
            <TechnologyFormPage />
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
        path: 'offices/:id', 
        element: (
          <LazyWrapper>
            <OfficeDetailPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'offices/new', 
        element: (
          <LazyWrapper>
            <OfficeFormPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'offices/:id/edit', 
        element: (
          <LazyWrapper>
            <OfficeFormPage />
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
      { 
        path: 'billing', 
        element: (
          <LazyWrapper>
            <FacturacionPage />
          </LazyWrapper>
        ) 
      },
      { 
        path: 'billing/projects/:id/invoices', 
        element: (
          <LazyWrapper>
            <ProjectInvoicesPage />
          </LazyWrapper>
        ) 
      },
    ],
  },
]);

