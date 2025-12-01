import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Building2 } from 'lucide-react';
import { mockApi } from '@/lib/mock-api';
import type { Department, Project } from '@/types/database';
import { EmployeeStatus, ProjectStatus } from '@/types/database';
import { useEmployees } from '@/hooks/useEmployees';
import { useProjects } from '@/hooks/useProjects';

export const DepartmentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [department, setDepartment] = useState<Department | null>(null);
  const [loadingDepartment, setLoadingDepartment] = useState(true);

  const { employees, loading: loadingEmployees } = useEmployees(
    id ? { departmentId: id } : undefined
  );
  const { projects, loading: loadingProjects } = useProjects();

  const handleLoadDepartment = async () => {
    if (!id) {
      return;
    }

    try {
      setLoadingDepartment(true);
      const data = await mockApi.getDepartmentById(id);
      setDepartment(data);
    } catch (error) {
      console.error('Error loading department:', error);
    } finally {
      setLoadingDepartment(false);
    }
  };

  useEffect(() => {
    handleLoadDepartment();
  }, [id]);

  const projectsForDepartment = useMemo(() => {
    if (!id) {
      return [];
    }

    return projects.filter((project: Project) =>
      project.departments?.some((projectDepartment) => projectDepartment.departmentId === id)
    );
  }, [projects, id]);

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

  if (loadingDepartment || loadingEmployees || loadingProjects) {
    return <div>Cargando departamento...</div>;
  }

  if (!department) {
    return <div>Departamento no encontrado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/departments')}
          aria-label="Volver a departamentos"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{department.name}</h1>
            <p className="text-muted-foreground mt-1">
              {department.description || 'Sin descripción'}
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="projects" className="space-y-4">
        <TabsList>
          <TabsTrigger value="projects">Proyectos</TabsTrigger>
          <TabsTrigger value="employees">Trabajadores</TabsTrigger>
        </TabsList>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Proyectos del departamento</CardTitle>
            </CardHeader>
            <CardContent>
              {projectsForDepartment.length === 0 ? (
                <p className="text-muted-foreground">No hay proyectos asociados a este departamento.</p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {projectsForDepartment.map((project) => (
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

        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trabajadores del departamento</CardTitle>
            </CardHeader>
            <CardContent>
              {employees.length === 0 ? (
                <p className="text-muted-foreground">
                  No hay trabajadores asociados a este departamento.
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
                            <p className="text-sm text-muted-foreground">
                              {employee.position}
                            </p>
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
      </Tabs>
    </div>
  );
};


