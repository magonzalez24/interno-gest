import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { TimeEntry } from '@/types/database';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

interface PasteTimeEntriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  copiedEntries: TimeEntry[];
  onSuccess: () => void;
}

export const PasteTimeEntriesModal = ({
  open,
  onOpenChange,
  copiedEntries,
  onSuccess,
}: PasteTimeEntriesModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const getWeekDays = (startDate?: Date) => {
    const baseDate = startDate || new Date();
    const currentDay = baseDate.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() + mondayOffset);

    const weekDays: Date[] = [];
    // Solo lunes a viernes (5 días)
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const weekDays = getWeekDays();

  const handleSelectDay = (dayKey: string) => {
    setSelectedDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const handlePaste = async () => {
    if (selectedDays.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona al menos un día',
        variant: 'destructive',
      });
      return;
    }

    if (copiedEntries.length === 0) {
      toast({
        title: 'Error',
        description: 'No hay imputaciones copiadas',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      const employeeId = user?.employee?.id;
      if (!employeeId) {
        throw new Error('No se encontró información del empleado');
      }

      // Crear imputaciones para cada día seleccionado
      const entriesToCreate: Array<{
        employeeId: string;
        projectId: string;
        hours: number;
        description?: string;
        date: Date;
      }> = [];

      selectedDays.forEach(dayKey => {
        const targetDate = new Date(dayKey);
        copiedEntries.forEach(entry => {
          entriesToCreate.push({
            employeeId,
            projectId: entry.projectId,
            hours: entry.hours,
            description: entry.description || undefined,
            date: targetDate,
          });
        });
      });

      // Helper para normalizar fechas a string YYYY-MM-DD
      const normalizeDate = (date: Date | string): string => {
        if (typeof date === 'string') {
          // Si ya es string, extraer solo la parte de la fecha (YYYY-MM-DD)
          return date.split('T')[0];
        }
        // Si es Date, convertir a YYYY-MM-DD
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Verificar duplicados antes de crear
      const existingEntries = await api.getTimeEntries(employeeId);
      const existingKeys = new Set(
        existingEntries.map(e => 
          `${e.projectId}-${normalizeDate(e.date as Date | string)}`
        )
      );

      const uniqueEntries = entriesToCreate.filter(entry => {
        const key = `${entry.projectId}-${normalizeDate(entry.date)}`;
        return !existingKeys.has(key);
      });

      if (uniqueEntries.length === 0) {
        toast({
          title: 'Información',
          description: 'Todas las imputaciones ya existen en los días seleccionados',
        });
        onOpenChange(false);
        setSelectedDays([]);
        return;
      }

      // Crear todas las imputaciones
      await Promise.all(
        uniqueEntries.map(entry => api.createTimeEntry(entry))
      );

      toast({
        title: 'Éxito',
        description: `${uniqueEntries.length} imputación(es) creada(s) en ${selectedDays.length} día(s)`,
      });

      setSelectedDays([]);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error al pegar las imputaciones:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al pegar las imputaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedDays([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Pegar Imputaciones</DialogTitle>
          <DialogDescription>
            Selecciona los días donde quieres pegar {copiedEntries.length} imputación(es) copiada(s)
            <br />
            Semana actual: {format(weekDays[0], 'dd/MM', { locale: es })} - {format(weekDays[4], 'dd/MM', { locale: es })}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Imputaciones a pegar:
            </Label>
            <div className="space-y-1 max-h-[150px] overflow-y-auto border rounded-md p-2">
              {copiedEntries.map((entry, index) => (
                <div key={index} className="text-sm flex items-center justify-between">
                  <span className="font-medium">{entry.project?.name || 'Proyecto'}</span>
                  <span className="text-muted-foreground">{entry.hours}h</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">
              Selecciona los días:
            </Label>
            <div className="grid grid-cols-5 gap-2">
              {weekDays.map((day) => {
                const dayKey = format(day, 'yyyy-MM-dd');
                const dayName = format(day, 'EEE', { locale: es });
                const dayNumber = format(day, 'd');
                const isSelected = selectedDays.includes(dayKey);
                return (
                  <button
                    key={dayKey}
                    type="button"
                    onClick={() => handleSelectDay(dayKey)}
                    className={`
                      flex flex-col items-center justify-center p-2 rounded-md border transition-colors
                      ${isSelected
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted border-border'
                      }
                    `}
                  >
                    <span className="text-xs font-medium">{dayName}</span>
                    <span className="text-sm font-semibold">{dayNumber}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handlePaste}
            disabled={loading || selectedDays.length === 0}
          >
            {loading ? 'Pegando...' : `Pegar en ${selectedDays.length} día(s)`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

