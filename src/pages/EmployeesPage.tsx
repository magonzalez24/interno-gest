import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEmployees } from '@/hooks/useEmployees';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus } from 'lucide-react';
import { EmployeeStatus } from '@/types/database';

export const EmployeesPage = () => {
  const { user } = useAuth();
  const { selectedOffice } = useOffices();
  const [searchTerm, setSearchTerm] = useState('');
  
  const officeId = user?.role === 'DIRECTOR' ? undefined : selectedOffice?.id;
  const { employees, loading } = useEmployees({ officeId });

  const filteredEmployees = employees.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: EmployeeStatus) => {
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

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateAllocation = (employee: typeof employees[0]) => {
    if (!employee.projects) return 0;
    return employee.projects
      .filter(pe => !pe.endDate || new Date(pe.endDate) > new Date())
      .reduce((sum, pe) => sum + pe.allocation, 0);
  };

  // Agrupar empleados por categoría de posición
  const getPositionCategory = (position: string): string => {
    const positionLower = position.toLowerCase();
    if (positionLower.includes('director') || positionLower.includes('manager')) {
      return 'Directivos';
    }
    if (positionLower.includes('desarrollador') || positionLower.includes('developer') || positionLower.includes('tech lead')) {
      return 'Desarrollo';
    }
    if (positionLower.includes('devops')) {
      return 'DevOps';
    }
    if (positionLower.includes('qa') || positionLower.includes('engineer')) {
      if (positionLower.includes('qa')) {
        return 'QA';
      }
      return 'Desarrollo';
    }
    if (positionLower.includes('diseñador') || positionLower.includes('ux') || positionLower.includes('ui')) {
      return 'Diseño';
    }
    if (positionLower.includes('product manager') || positionLower.includes('scrum') || positionLower.includes('business analyst')) {
      return 'Gestión';
    }
    return 'Otros';
  };

  const employeesByPosition = filteredEmployees.reduce((acc, employee) => {
    const category = getPositionCategory(employee.position);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(employee);
    return acc;
  }, {} as Record<string, typeof filteredEmployees>);

  // Ordenar categorías
  const categoryOrder = ['Directivos', 'Desarrollo', 'DevOps', 'QA', 'Diseño', 'Gestión', 'Otros'];
  const sortedCategories = Object.keys(employeesByPosition).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    if (indexA === -1 && indexB === -1) return a.localeCompare(b);
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (loading) {
    return <div>Cargando empleados...</div>;
  }

  const categoriesEntries = sortedCategories.map((category) => [
    category,
    employeesByPosition[category],
  ] as const);
  const defaultCategory = categoriesEntries[0]?.[0] ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Empleados</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona el equipo de trabajo
          </p>
        </div>
          <Link to="/employees/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </Link>
      </div>

      <Input
        placeholder="Buscar empleados..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {filteredEmployees.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No se encontraron empleados</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={defaultCategory} className="space-y-6">
          <TabsList>
            {categoriesEntries.map(([category]) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categoriesEntries.map(([category, employeesInCategory]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {employeesInCategory.map((employee) => {
                  const allocation = calculateAllocation(employee);
                  return (
                    <Link key={employee.id} to={`/employees/${employee.id}`}>
                      <Card className="transition-shadow hover:shadow-md">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarFallback>{getInitials(employee.name)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{employee.name}</h3>
                                <Badge className={getStatusColor(employee.status)}>
                                  {employee.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {employee.position}
                              </p>
                              {employee.department && (
                                <p className="text-sm text-muted-foreground">
                                  {employee.department.name}
                                </p>
                              )}
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex-1 h-2 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${Math.min(allocation, 100)}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {allocation}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

