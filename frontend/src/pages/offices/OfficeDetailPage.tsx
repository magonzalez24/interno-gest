import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2, Users, FolderKanban, MapPin, Clock, Globe, Euro, TrendingUp } from 'lucide-react';
import { api } from '@/lib/api';
import type { Office, Department } from '@/types/database';
import { EmployeeStatus, ProjectStatus } from '@/types/database';
import { useEmployees } from '@/hooks/useEmployees';
import { useProjects } from '@/hooks/useProjects';
import { formatCurrency } from '@/lib/utils';

export const OfficeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [office, setOffice] = useState<Office | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loadingOffice, setLoadingOffice] = useState(true);
  const [loadingDepartments, setLoadingDepartments] = useState(true);

  const { employees, loading: loadingEmployees } = useEmployees(
    id ? { officeId: id } : undefined
  );
  const { projects, loading: loadingProjects } = useProjects(
    id ? { officeId: id } : undefined
  );

  useEffect(() => {
    const loadOffice = async () => {
      if (!id) return;
      try {
        setLoadingOffice(true);
        const data = await api.getOfficeById(id);
        setOffice(data);
      } catch (error) {
        console.error('Error loading office:', error);
      } finally {
        setLoadingOffice(false);
      }
    };
    loadOffice();
  }, [id]);

  useEffect(() => {
    const loadDepartments = async () => {
      if (!id) return;
      try {
        setLoadingDepartments(true);
        const data = await api.getDepartments(id);
        setDepartments(data);
      } catch (error) {
        console.error('Error loading departments:', error);
      } finally {
        setLoadingDepartments(false);
      }
    };
    loadDepartments();
  }, [id]);

  const getProjectStatusColor = (status: ProjectStatus) => {
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

  const getEmployeeStatusColor = (status: EmployeeStatus) => {
    switch (status) {
      case EmployeeStatus.ACTIVE:
        return 'bg-green-100 text-green-800';
      case EmployeeStatus.INACTIVE:
        return 'bg-gray-100 text-gray-800';
      case EmployeeStatus.ON_LEAVE:
        return 'bg-yellow-100 text-yellow-800';
      case EmployeeStatus.TERMINATED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmployeeInitials = (name: string) => {
    return name
      .split(' ')
      .map((namePart) => namePart[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const activeEmployees = employees.filter((e) => e.status === EmployeeStatus.ACTIVE).length;
  const activeProjects = projects.filter((p) => p.status === ProjectStatus.ACTIVE).length;

  // Calcular presupuesto total (suma de budgets de todos los proyectos)
  const totalBudget = useMemo(() => {
    return projects.reduce((total, project) => {
      return total + (project.budget || 0);
    }, 0);
  }, [projects]);

  // Calcular gastos totales (coste de empleados asignados a proyectos)
  const totalExpenses = useMemo(() => {
    return projects.reduce((totalProjectsCost, project) => {
      if (!project.employees) return totalProjectsCost;

      const projectCost = project.employees.reduce((projectSum, pe) => {
        if (!pe.employee || !pe.employee.salary) return projectSum;

        const allocationFactor = pe.allocation ? pe.allocation / 100 : 1;
        return projectSum + pe.employee.salary * allocationFactor;
      }, 0);

      return totalProjectsCost + projectCost;
    }, 0);
  }, [projects]);

  // Calcular beneficio total
  const totalProfit = useMemo(() => {
    return totalBudget - totalExpenses;
  }, [totalBudget, totalExpenses]);

  if (loadingOffice || loadingDepartments || loadingEmployees || loadingProjects) {
    return <div>Cargando sede...</div>;
  }

  if (!office) {
    return <div>Sede no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/offices')}
          aria-label="Volver a sedes"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{office.name}</h1>
            <p className="text-muted-foreground mt-1">{office.country}</p>
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">{activeEmployees} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Proyectos</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">{activeProjects} activos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zona Horaria</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{office.timezone}</div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas Financieras */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Presupuesto</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
            <p className="text-xs text-muted-foreground">Total de proyectos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gastos</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
            <p className="text-xs text-muted-foreground">Coste de empleados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beneficio Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(totalProfit)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totalProfit >= 0 ? 'Beneficio' : 'Pérdida'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Información básica */}
      <Card>
        <CardHeader>
          <CardTitle>Información de la Sede</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Dirección</p>
                <p className="mt-1">{office.address || 'No especificada'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">País</p>
                <p className="mt-1">{office.country}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="departments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="departments">Departamentos</TabsTrigger>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Departamentos de la Sede</CardTitle>
            </CardHeader>
            <CardContent>
              {departments.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay departamentos asociados a esta sede.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {departments.map((department) => (
                    <Link key={department.id} to={`/departments/${department.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardHeader>
                          <CardTitle className="text-lg">{department.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {department.description || 'Sin descripción'}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Empleados de la Sede</CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay empleados asociados a esta sede.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {employees.map((employee) => (
                    <Link key={employee.id} to={`/employees/${employee.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="flex items-center gap-4 p-4">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback>{getEmployeeInitials(employee.name)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="font-medium">{employee.name}</p>
                              <Badge
                                variant="outline"
                                className={getEmployeeStatusColor(employee.status)}
                              >
                                {employee.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{employee.position}</p>
                            {employee.department && (
                              <p className="text-xs text-muted-foreground">
                                {employee.department.name}
                              </p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos de la Sede</CardTitle>
            </CardHeader>
            <CardContent>
              {projects.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay proyectos asociados a esta sede.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projects.map((project) => (
                    <Link key={project.id} to={`/projects/${project.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg">{project.name}</CardTitle>
                            <Badge className={getProjectStatusColor(project.status)}>
                              {project.status}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {project.description || 'Sin descripción'}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

