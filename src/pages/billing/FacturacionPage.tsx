import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/hooks/useProjects';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ProjectStatus } from '@/types/database';
import { formatDateShort } from '@/lib/utils';
import { useTranslation } from 'react-i18next';

export const FacturacionPage = () => {
  const { user } = useAuth();
  const { selectedOffice } = useOffices();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const officeId = user?.role === 'DIRECTOR' ? undefined : selectedOffice?.id;
  
  // Obtener todos los proyectos y filtrar por estado ACTIVE o COMPLETED
  const { projects, loading } = useProjects({ officeId });
  
  const billableProjects = projects.filter(p => 
    p.status === ProjectStatus.ACTIVE || p.status === ProjectStatus.COMPLETED
  );

  const filteredProjects = billableProjects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ProjectStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return <div>{t('common.loading')}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('billing.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('billing.subtitle')}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder={t('billing.searchPlaceholder', 'Buscar proyectos...')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              {t('billing.noProjects')}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Link key={project.id} to={`/billing/projects/${project.id}/invoices`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {project.clientName || t('billing.clientFallback', 'Cliente')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {project.office && (
                      <div className="text-sm font-medium text-foreground">
                        <p>Excelia {project.office.name}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getPriorityColor(project.priority)}`} />
                      <span className="text-sm text-muted-foreground">
                        {project.priority}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {t('projects.startDate')}:{' '}
                        {formatDateShort(project.startDate)}
                      </p>
                      {project.endDate && (
                        <p>
                          {t('projects.endDate')}:{' '}
                          {formatDateShort(project.endDate)}
                        </p>
                      )}
                    </div>
                    {project.budget && (
                      <div className="text-sm font-semibold text-foreground pt-2 border-t">
                        <p>
                          {t('billing.budget')}: {new Intl.NumberFormat('es-ES', {
                            style: 'currency',
                            currency: 'EUR'
                          }).format(project.budget)}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

