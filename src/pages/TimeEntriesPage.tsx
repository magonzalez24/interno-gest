import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/lib/mock-api';
import { useAuth } from '@/contexts/AuthContext';
import type { TimeEntry } from '@/types/database';
import { formatDate } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { NewTimeEntryModal } from '@/components/time-entries/NewTimeEntryModal';

export const TimeEntriesPage = () => {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const employeeId = user?.employee?.id;

  useEffect(() => {
    const loadTimeEntries = async () => {
      if (!employeeId) return;
      try {
        setLoading(true);
        const data = await mockApi.getTimeEntries(employeeId);
        setTimeEntries(data);
      } catch (error) {
        console.error('Error loading time entries:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTimeEntries();
  }, [employeeId]);

  const handleNewEntry = async () => {
    if (!employeeId) return;
    const data = await mockApi.getTimeEntries(employeeId);
    setTimeEntries(data);
  };

  if (loading) {
    return <div>Cargando imputaciones...</div>;
  }

  if (!employeeId) {
    return <div>No se encontró información del empleado</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Imputaciones</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona tus horas imputadas a proyectos
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {timeEntries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">
              No hay imputaciones registradas. Crea una nueva imputación para comenzar.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {timeEntries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{entry.project?.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <Badge variant="outline">{entry.hours} horas</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {entry.description && (
                  <p className="text-sm text-muted-foreground">{entry.description}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <NewTimeEntryModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSuccess={handleNewEntry}
      />
    </div>
  );
};

