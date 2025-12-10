import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import type { Project } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { Search, X, Copy, Clipboard } from 'lucide-react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

interface NewTimeEntryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface SelectedTimeEntry {
  project: Project;
  hours: string;
  description: string;
  date: string;
}

interface CopiedTimeEntry {
  projectId: string;
  hours: string;
  description: string;
}

export const NewTimeEntryModal = ({ open, onOpenChange, onSuccess }: NewTimeEntryModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEntries, setSelectedEntries] = useState<SelectedTimeEntry[]>([]);
  const [copiedEntry, setCopiedEntry] = useState<CopiedTimeEntry | null>(null);
  const [pasteDaysOpen, setPasteDaysOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [defaultDate, setDefaultDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const allProjects = await api.getProjects();
        // Filtrar solo proyectos activos donde el empleado está asignado
        const employeeId = user?.employee?.id;
        if (!employeeId) return;

        const employeeProjects = allProjects.filter(project => {
          // El backend devuelve projectEmployees, pero el tipo puede tener employees
          const projectEmployees = project.projectEmployees || project.employees;
          return projectEmployees?.some(pe => pe.employeeId === employeeId);
        });

        setProjects(allProjects);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    if (open) {
      loadProjects();
      setSearchQuery('');
      setSelectedEntries([]);
      setCopiedEntry(null);
      setSelectedDays([]);
      setDefaultDate(new Date().toISOString().split('T')[0]);
    }
  }, [open, user]);

  // Filtrar proyectos según la búsqueda y excluir los ya seleccionados
  const filteredProjects = useMemo(() => {
    let filtered = projects;
    const selectedProjectIds = new Set(selectedEntries.map(se => se.project.id));

    // Excluir proyectos ya seleccionados
    filtered = filtered.filter(project => !selectedProjectIds.has(project.id));

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(project =>
        project.name.toLowerCase().includes(query) ||
        project.clientName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [projects, searchQuery, selectedEntries]);

  const handleAddProject = (project: Project) => {
    // Verificar que el proyecto no esté ya seleccionado
    if (selectedEntries.find(se => se.project.id === project.id)) {
      return;
    }

    setSelectedEntries(prev => [...prev, {
      project,
      hours: '',
      description: '',
      date: defaultDate,
    }]);
  };

  const handleRemoveEntry = (projectId: string) => {
    setSelectedEntries(prev => prev.filter(se => se.project.id !== projectId));
  };

  const handleUpdateEntry = (projectId: string, field: 'hours' | 'description' | 'date', value: string) => {
    setSelectedEntries(prev =>
      prev.map(se =>
        se.project.id === projectId
          ? { ...se, [field]: value }
          : se
      )
    );
  };

  const handleCopyEntry = (entry: SelectedTimeEntry) => {
    setCopiedEntry({
      projectId: entry.project.id,
      hours: entry.hours,
      description: entry.description,
    });
    toast({
      title: 'Copiado',
      description: 'Imputación copiada. Selecciona los días para pegar.',
    });
  };

  const handlePasteEntry = () => {
    if (!copiedEntry) return;

    // Generar días de la semana actual
    const today = new Date();
    const currentDay = today.getDay(); // 0 = domingo, 1 = lunes, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // Ajustar para que lunes sea 0
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const weekDays: Date[] = [];
    // Solo lunes a viernes (5 días)
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }

    // Filtrar solo los días seleccionados
    const daysToPaste = weekDays.filter((day) => {
      const dayKey = format(day, 'yyyy-MM-dd');
      return selectedDays.includes(dayKey);
    });

    if (daysToPaste.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona al menos un día',
        variant: 'destructive',
      });
      return;
    }

    // Buscar el proyecto copiado
    const copiedProject = projects.find(p => p.id === copiedEntry.projectId);
    if (!copiedProject) {
      toast({
        title: 'Error',
        description: 'No se encontró el proyecto copiado',
        variant: 'destructive',
      });
      return;
    }

    // Crear entradas para cada día seleccionado
    const newEntries: SelectedTimeEntry[] = daysToPaste.map(day => ({
      project: copiedProject,
      hours: copiedEntry.hours,
      description: copiedEntry.description,
      date: format(day, 'yyyy-MM-dd'),
    }));

    // Agregar las nuevas entradas (evitando duplicados)
    setSelectedEntries(prev => {
      const existing = new Set(prev.map(e => `${e.project.id}-${e.date}`));
      const unique = newEntries.filter(e => !existing.has(`${e.project.id}-${e.date}`));
      return [...prev, ...unique];
    });

    setPasteDaysOpen(false);
    setSelectedDays([]);
    setCopiedEntry(null);
    toast({
      title: 'Éxito',
      description: `${daysToPaste.length} imputación(es) pegada(s) correctamente`,
    });
  };

  const handleSelectDay = (dayKey: string) => {
    setSelectedDays(prev =>
      prev.includes(dayKey)
        ? prev.filter(d => d !== dayKey)
        : [...prev, dayKey]
    );
  };

  const getWeekDays = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    const weekDays: Date[] = [];
    // Solo lunes a viernes (5 días)
    for (let i = 0; i < 5; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      weekDays.push(day);
    }
    return weekDays;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedEntries.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona al menos un proyecto',
        variant: 'destructive',
      });
      return;
    }

    // Validar que todos los proyectos seleccionados tengan horas
    const invalidEntries = selectedEntries.filter(se => !se.hours || parseFloat(se.hours) <= 0);
    if (invalidEntries.length > 0) {
      toast({
        title: 'Error',
        description: 'Por favor completa las horas para todos los proyectos seleccionados',
        variant: 'destructive',
      });
      return;
    }

    // Validar horas
    const invalidHours = selectedEntries.filter(se => {
      const hours = parseFloat(se.hours);
      return isNaN(hours) || hours <= 0 || hours > 24;
    });
    if (invalidHours.length > 0) {
      toast({
        title: 'Error',
        description: 'Las horas deben ser un número entre 0.5 y 24 para todos los proyectos',
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

      // Crear todas las imputaciones
      await Promise.all(
        selectedEntries.map(entry =>
          api.createTimeEntry({
            employeeId,
            projectId: entry.project.id,
            hours: parseFloat(entry.hours),
            description: entry.description || undefined,
            date: new Date(entry.date),
          })
        )
      );

      toast({
        title: 'Éxito',
        description: `${selectedEntries.length} imputación(es) creada(s) correctamente`,
      });

      // Reset form
      setSelectedEntries([]);
      setSearchQuery('');
      setCopiedEntry(null);
      setSelectedDays([]);
      setDefaultDate(new Date().toISOString().split('T')[0]);

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al crear las imputaciones',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const weekDays = getWeekDays();

  return (
    <>
      {/* Dialog para seleccionar días al pegar */}
      <Dialog open={pasteDaysOpen} onOpenChange={setPasteDaysOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Selecciona los días para pegar</DialogTitle>
            <DialogDescription>
              Semana actual: {format(weekDays[0], 'dd/MM', { locale: es })} - {format(weekDays[4], 'dd/MM', { locale: es })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
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
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setPasteDaysOpen(false);
                setSelectedDays([]);
              }}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handlePasteEntry}
            >
              Pegar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nueva Imputación</DialogTitle>
          <DialogDescription>
            Registra las horas trabajadas en proyectos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Filtro de búsqueda */}
            <div className="flex gap-4 pb-4 border-b">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar proyecto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {copiedEntry && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => setPasteDaysOpen(true)}
                >
                  <Clipboard className="h-4 w-4" />
                  Pegar Imputación
                </Button>
              )}
            </div>

            {/* Tabla de proyectos disponibles */}
            <div className="space-y-2">
              <Label>Proyectos Disponibles</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium w-12"></th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Proyecto</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Sede</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            {projects.length === 0
                              ? 'No hay proyectos disponibles para asignar'
                              : selectedEntries.length > 0 && filteredProjects.length === 0
                              ? 'Todos los proyectos disponibles ya están seleccionados'
                              : 'No hay proyectos que coincidan con la búsqueda'}
                          </td>
                        </tr>
                      ) : (
                        filteredProjects.map((project) => (
                          <tr
                            key={project.id}
                            className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleAddProject(project)}
                          >
                            <td className="px-4 py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddProject(project);
                                }}
                              >
                                Añadir
                              </Button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{project.name}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {project.clientName || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {project.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {project.office?.name || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tabla de imputaciones seleccionadas */}
            {selectedEntries.length > 0 && (
              <div className="space-y-2">
                <Label>Imputaciones Seleccionadas</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[400px]">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium w-12"></th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Proyecto</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Cliente</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Estado</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Sede</th>
                          <th className="px-4 py-3 text-left text-sm font-medium w-12"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEntries.map((entry) => (
                          <>
                            {/* Primera fila: Datos del proyecto */}
                            <tr
                              key={entry.project.id}
                              className="border-b hover:bg-muted/50 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveEntry(entry.project.id)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-medium">{entry.project.name}</div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {entry.project.clientName || '-'}
                              </td>
                              <td className="px-4 py-3">
                                <Badge variant="outline" className="text-xs">
                                  {entry.project.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                {entry.project.office?.name || '-'}
                              </td>
                              <td className="px-4 py-3">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleCopyEntry(entry)}
                                  title="Copiar imputación"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </td>
                            </tr>
                            {/* Segunda fila: Inputs de horas y descripción */}
                            <tr key={`${entry.project.id}-inputs`} className="border-b bg-muted/20">
                              <td colSpan={6} className="px-4 py-3">
                                <div className="grid grid-cols-3 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`date-${entry.project.id}`} className="text-xs">
                                      Fecha
                                    </Label>
                                    <Input
                                      id={`date-${entry.project.id}`}
                                      type="date"
                                      value={entry.date}
                                      onChange={(e) => handleUpdateEntry(entry.project.id, 'date', e.target.value)}
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`hours-${entry.project.id}`} className="text-xs">
                                      Horas *
                                    </Label>
                                    <Input
                                      id={`hours-${entry.project.id}`}
                                      type="number"
                                      step="0.5"
                                      min="0.5"
                                      max="24"
                                      value={entry.hours}
                                      onChange={(e) => handleUpdateEntry(entry.project.id, 'hours', e.target.value)}
                                      placeholder="Ej: 8"
                                      className="h-9"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`description-${entry.project.id}`} className="text-xs">
                                      Descripción
                                    </Label>
                                    <Input
                                      id={`description-${entry.project.id}`}
                                      type="text"
                                      value={entry.description}
                                      onChange={(e) => handleUpdateEntry(entry.project.id, 'description', e.target.value)}
                                      placeholder="Describe el trabajo realizado..."
                                      className="h-9"
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || selectedEntries.length === 0}>
              {loading ? 'Guardando...' : `Guardar${selectedEntries.length > 0 ? ` (${selectedEntries.length})` : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
};
