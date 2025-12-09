import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useOffices } from '@/contexts/OfficeContext';
import { UserRole } from '@/types/database';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import type { DashboardStats } from '@/types/database';
import { FolderKanban, Users, Building2, CheckCircle2 } from 'lucide-react';
import { ChartAreaInteractive } from '@/components/dashboard/ChartAreaInteractive';
import { ChartPieLabelList } from '@/components/dashboard/ChartPieLabelList';
import { useTranslation } from 'react-i18next';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { selectedOffice, offices } = useOffices();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const getLocale = () => {
    if (i18n.language.startsWith('en')) {
      return 'en-US';
    }
    if (i18n.language.startsWith('pt')) {
      return 'pt-PT';
    }
    return 'es-ES';
  };

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const officeIds = user?.role === UserRole.DIRECTOR 
          ? undefined 
          : selectedOffice 
            ? [selectedOffice.id] 
            : offices.map(o => o.id);
        
        const data = await api.getDashboardStats(officeIds);
        console.log(data);
        setStats(data);
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [user, selectedOffice, offices]);

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  if (!stats) {
    return <div>{t('dashboard.noData', 'No hay datos disponibles')}</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {user?.role === UserRole.DIRECTOR
            ? t('dashboard.subtitleAll')
            : t('dashboard.subtitleOffice', {
                office:
                  selectedOffice?.name ||
                  t('dashboard.subtitleFallbackOffice'),
              })}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.totalProjects.title')}
            </CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.totalProjects.subtitle', {
                count: stats.activeProjects,
              })}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.employees.title')}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.employees.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.departments.title')}
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.departments.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.completed.title')}
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedProjectsThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.completed.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.annualBudget.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.annualBudget.toLocaleString(getLocale(), {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.annualBudget.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.annualExpenses.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.annualExpenses.toLocaleString(getLocale(), {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.annualExpenses.subtitle')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.annualProfit.title')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="text-2xl font-bold"
            >
              {stats.annualProfit.toLocaleString(getLocale(), {
                style: 'currency',
                currency: 'EUR',
              })}
            </div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.annualProfit.subtitle')}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-3">
          <ChartAreaInteractive />
        </div>
        <div className="md:col-span-1">
          <ChartPieLabelList />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.sections.projectsByStatus')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.projectsByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{status}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {t('dashboard.sections.employeesByDepartment')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.employeesByDepartment).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{dept}</span>
                  <span className="font-medium">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
};

