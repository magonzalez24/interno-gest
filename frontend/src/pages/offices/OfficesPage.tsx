import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import type { Office } from '@/types/database';
import { Building2, Plus } from 'lucide-react';

export const OfficesPage = () => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOffices = async () => {
      try {
        const data = await api.getOffices();
        setOffices(data);
      } catch (error) {
        console.error('Error loading offices:', error);
      } finally {
        setLoading(false);
      }
    };
    loadOffices();
  }, []);

  if (loading) {
    return <div>Cargando sedes...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sedes</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona las sedes de la empresa
          </p>
        </div>
        <Link to="/offices/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Crear sede
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {offices.map((office) => (
          <Link key={office.id} to={`/offices/${office.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <CardTitle>{office.name}</CardTitle>
                </div>
                <CardDescription>{office.country}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{office.address}</p>
                <p className="text-sm text-muted-foreground mt-1">{office.timezone}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

