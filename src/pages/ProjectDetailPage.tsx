import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { mockApi } from '@/lib/mock-api';
import type { Project, ProjectTechnology } from '@/types/database';
import { TechCategory } from '@/types/database';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Edit, Plus } from 'lucide-react';
import { AddTeamMemberModal } from '@/components/projects/AddTeamMemberModal';

export const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  const loadProject = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await mockApi.getProjectById(id);
      setProject(data);
    } catch (error) {
      console.error('Error loading project:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  // Calcular el gasto total del proyecto
  const totalExpense = useMemo(() => {
    if (!project?.employees) return 0;
    
    const HOURS_PER_YEAR = 2000; // 40 horas/semana * 50 semanas
    
    return project.employees.reduce((total, pe) => {
      const hours = pe.hours || 0;
      const salary = pe.employee?.salary || 0;
      const hourlyRate = salary / HOURS_PER_YEAR;
      return total + (hours * hourlyRate);
    }, 0);
  }, [project]);

  // Agrupar tecnologías por categoría
  const techsByCategory = useMemo(() => {
    if (!project?.technologies) return {} as Record<TechCategory, ProjectTechnology[]>;
    
    return project.technologies.reduce((acc, pt) => {
      const category = pt.technology?.category || TechCategory.OTHER;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(pt);
      return acc;
    }, {} as Record<TechCategory, ProjectTechnology[]>);
  }, [project]);

  if (loading) {
    return <div>Cargando proyecto...</div>;
  }

  if (!project) {
    return <div>Proyecto no encontrado</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'ON_HOLD': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">{project.name}</h1>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">{project.clientName}</p>
        </div>
        <Link to={`/projects/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="technologies">Tecnologías</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Descripción</p>
                <p className="mt-1">{project.description || 'Sin descripción'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Prioridad</p>
                  <p className="mt-1">{project.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Inicio</p>
                  <p className="mt-1">{formatDate(project.startDate)}</p>
                </div>
                {project.endDate && (
                  <div>
                    <p className="text-sm text-muted-foreground">Fecha de Fin</p>
                    <p className="mt-1">{formatDate(project.endDate)}</p>
                  </div>
                )}
                {project.budget && (
                  <div>
                    <p className="text-sm text-muted-foreground">Presupuesto</p>
                    <p className="mt-1">{formatCurrency(project.budget)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Gasto</p>
                  <p className="mt-1">{formatCurrency(totalExpense)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sede</p>
                  <p className="mt-1">{project.office?.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Equipo del Proyecto</CardTitle>
                <Button onClick={() => setIsAddMemberModalOpen(true)} size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir Compañero
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {project.employees && project.employees.length > 0 ? (
                <div className="space-y-4">
                  {project.employees.map((pe) => (
                    <div key={pe.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {pe.employee?.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{pe.employee?.name}</p>
                          <p className="text-sm text-muted-foreground">{pe.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{pe.allocation}%</Badge>
                        <Badge variant="secondary">
                          {pe.hours || 0} horas
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay empleados asignados</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos</CardTitle>
            </CardHeader>
            <CardContent>
              {project.departments && project.departments.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {project.departments.map((pd) => (
                    <Badge key={pd.id} variant="outline">
                      {pd.department?.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay departamentos asignados</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          {project.technologies && project.technologies.length > 0 ? (
            Object.entries(techsByCategory)
              .filter(([_, techs]) => techs && techs.length > 0)
              .map(([category, techs]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle>{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {techs?.map((pt) => (
                        <Badge 
                          key={pt.id} 
                          variant="outline"
                          style={{ 
                            borderColor: pt.technology?.color,
                            color: pt.technology?.color 
                          }}
                        >
                          {pt.technology?.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Tecnologías</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No hay tecnologías asignadas</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {project && (
        <AddTeamMemberModal
          open={isAddMemberModalOpen}
          onOpenChange={setIsAddMemberModalOpen}
          project={project}
          onSuccess={loadProject}
        />
      )}
    </div>
  );
};

