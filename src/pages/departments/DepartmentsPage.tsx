import { Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDepartments } from '@/hooks/useDepartments';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Building2 } from 'lucide-react';

export const DepartmentsPage = () => {
  const { user } = useAuth();
  const { selectedOffice } = useOffices();
  const officeId = user?.role === 'DIRECTOR' ? undefined : selectedOffice?.id;
  const { departments, loading } = useDepartments(officeId);

  if (loading) {
    return <div>Cargando departamentos...</div>;
  }

  const departmentsByOffice = departments.reduce((acc, dept) => {
    const officeName = dept.officeId || 'Sin sede';
    if (!acc[officeName]) {
      acc[officeName] = [];
    }
    acc[officeName].push(dept);
    return acc;
  }, {} as Record<string, typeof departments>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Departamentos</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona los departamentos de la empresa
        </p>
      </div>

      {Object.entries(departmentsByOffice).map(([officeName, depts]) => (
        <div key={officeName} className="space-y-4">
          <h2 className="text-xl font-semibold">{officeName}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {depts.map((dept) => (
              <Link key={dept.id} to={`/departments/${dept.id}`}>
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      <CardTitle>{dept.name}</CardTitle>
                    </div>
                    <CardDescription>{dept.description || 'Sin descripción'}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

