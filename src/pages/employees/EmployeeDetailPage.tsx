import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApi } from '@/lib/mock-api';
import type { Employee } from '@/types/database';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, Edit } from 'lucide-react';
import { SkillLevel } from '@/types/database';

export const EmployeeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployee = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await mockApi.getEmployeeById(id);
        setEmployee(data);
      } catch (error) {
        console.error('Error loading employee:', error);
      } finally {
        setLoading(false);
      }
    };
    loadEmployee();
  }, [id]);

  if (loading) {
    return <div>Cargando empleado...</div>;
  }

  if (!employee) {
    return <div>Empleado no encontrado</div>;
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800';
      case 'TERMINATED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.EXPERT: return 'bg-purple-100 text-purple-800';
      case SkillLevel.ADVANCED: return 'bg-blue-100 text-blue-800';
      case SkillLevel.INTERMEDIATE: return 'bg-green-100 text-green-800';
      case SkillLevel.BEGINNER: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const currentProjects = employee.projects?.filter(
    pe => !pe.endDate || new Date(pe.endDate) > new Date()
  ) || [];
  const totalAllocation = currentProjects.reduce((sum, pe) => sum + pe.allocation, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">
                {getInitials(employee.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{employee.name}</h1>
              <p className="text-muted-foreground">{employee.position}</p>
            </div>
          </div>
        </div>
        <Link to={`/employees/${id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="technologies">Tecnologías</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="mt-1">{employee.user?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teléfono</p>
                  <p className="mt-1">{employee.phone || 'No disponible'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sede</p>
                  <p className="mt-1">{employee.office?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Departamento</p>
                  <p className="mt-1">{employee.department?.name || 'Sin departamento'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Ingreso</p>
                  <p className="mt-1">{formatDate(employee.hireDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Estado</p>
                  <Badge className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sueldo Anual</p>
                  <p className="mt-1">
                    {employee.salary ? formatCurrency(employee.salary) : 'No disponible'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Carga de Trabajo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Dedicación Actual</span>
                  <span className="font-medium">{totalAllocation}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${Math.min(totalAllocation, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {100 - totalAllocation}% disponible
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technologies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Stack Tecnológico</CardTitle>
            </CardHeader>
            <CardContent>
              {employee.technologies && employee.technologies.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {employee.technologies.map((et) => (
                    <div key={et.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{et.technology?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {et.yearsOfExp} años de experiencia
                        </p>
                      </div>
                      <Badge className={getLevelColor(et.level)}>
                        {et.level}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay tecnologías asignadas</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos Actuales</CardTitle>
            </CardHeader>
            <CardContent>
              {currentProjects.length > 0 ? (
                <div className="space-y-4">
                  {currentProjects.map((pe) => (
                    <Link key={pe.id} to={`/projects/${pe.projectId}`}>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent">
                        <div>
                          <p className="font-medium">{pe.project?.name}</p>
                          <p className="text-sm text-muted-foreground">{pe.role}</p>
                        </div>
                        <Badge variant="outline">{pe.allocation}%</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No hay proyectos activos</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

