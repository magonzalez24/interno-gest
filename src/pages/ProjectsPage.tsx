import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProjects } from '@/hooks/useProjects';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { permissions } from '@/lib/permissions';
import { ProjectStatus } from '@/types/database';
import { Plus } from 'lucide-react';
import { formatDateShort } from '@/lib/utils';

export const ProjectsPage = () => {
  const { user } = useAuth();
  const { selectedOffice } = useOffices();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const officeId = user?.role === 'DIRECTOR' ? undefined : selectedOffice?.id;
  const { projects, loading } = useProjects({ 
    officeId,
    status: statusFilter !== 'all' ? statusFilter as ProjectStatus : undefined,
  });

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separar proyectos en internos y externos
  const internalProjects = filteredProjects.filter(p => p.isInternal === true);
  const externalProjects = filteredProjects.filter(p => p.isInternal !== true);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case ProjectStatus.PLANNING:
        return 'bg-blue-100 text-blue-800';
      case ProjectStatus.ON_HOLD:
        return 'bg-yellow-100 text-yellow-800';
      case ProjectStatus.COMPLETED:
        return 'bg-gray-100 text-gray-800';
      case ProjectStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
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
    return <div>Cargando proyectos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proyectos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona todos tus proyectos
          </p>
        </div>
          <Link to="/projects/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </Link>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Buscar proyectos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value={ProjectStatus.PLANNING}>Planificación</SelectItem>
            <SelectItem value={ProjectStatus.ACTIVE}>Activo</SelectItem>
            <SelectItem value={ProjectStatus.ON_HOLD}>En Pausa</SelectItem>
            <SelectItem value={ProjectStatus.COMPLETED}>Completado</SelectItem>
            <SelectItem value={ProjectStatus.CANCELLED}>Cancelado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No se encontraron proyectos</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Proyectos Internos */}
          {internalProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Proyectos Internos</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {internalProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription>Proyecto interno</CardDescription>
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
                            <p>Inicio: {formatDateShort(project.startDate)}</p>
                            {project.endDate && (
                              <p>Fin: {formatDateShort(project.endDate)}</p>
                            )}
                          </div>
                          {project.departments && project.departments.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.departments.slice(0, 3).map((pd) => (
                                <Badge key={pd.id} variant="outline" className="text-xs">
                                  {pd.department?.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Proyectos Externos */}
          {externalProjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Proyectos Externos</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {externalProjects.map((project) => (
                  <Link key={project.id} to={`/projects/${project.id}`}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{project.name}</CardTitle>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription>{project.clientName || 'Cliente externo'}</CardDescription>
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
                            <p>Inicio: {formatDateShort(project.startDate)}</p>
                            {project.endDate && (
                              <p>Fin: {formatDateShort(project.endDate)}</p>
                            )}
                          </div>
                          {project.departments && project.departments.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {project.departments.slice(0, 3).map((pd) => (
                                <Badge key={pd.id} variant="outline" className="text-xs">
                                  {pd.department?.name}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

