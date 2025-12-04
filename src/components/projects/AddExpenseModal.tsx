import { useState, useEffect } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockApi } from '@/lib/mock-api';
import type { Project, ProjectExpense } from '@/types/database';
import { ExpenseCategory } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
// Helper para formatear fecha a YYYY-MM-DD
const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  expense?: ProjectExpense | null;
  onSuccess: () => void;
}

export const AddExpenseModal = ({ 
  open, 
  onOpenChange, 
  project, 
  expense,
  onSuccess 
}: AddExpenseModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    cost: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    if (open) {
      if (expense) {
        // Modo edición
        setFormData({
          category: expense.category,
          description: expense.description,
          cost: expense.cost.toString(),
          startDate: formatDateForInput(expense.startDate),
          endDate: expense.endDate ? formatDateForInput(expense.endDate) : '',
        });
      } else {
        // Modo creación
        setFormData({
          category: ExpenseCategory.OTHER,
          description: '',
          cost: '',
          startDate: formatDateForInput(project.startDate),
          endDate: project.endDate ? formatDateForInput(project.endDate) : '',
        });
      }
    }
  }, [open, expense, project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.description || !formData.cost || !formData.startDate) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    const cost = parseFloat(formData.cost);
    if (isNaN(cost) || cost <= 0) {
      toast({
        title: 'Error',
        description: 'El costo debe ser un número mayor a 0',
        variant: 'destructive',
      });
      return;
    }

    const startDate = new Date(formData.startDate);
    const endDate = formData.endDate ? new Date(formData.endDate) : undefined;

    if (endDate && endDate < startDate) {
      toast({
        title: 'Error',
        description: 'La fecha de fin debe ser posterior a la fecha de inicio',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      if (expense) {
        // Editar gasto existente
        await mockApi.updateProjectExpense(expense.id, {
          category: formData.category as ExpenseCategory,
          description: formData.description,
          cost,
          startDate,
          endDate,
        });

        toast({
          title: 'Éxito',
          description: 'Gasto actualizado correctamente',
        });
      } else {
        // Crear nuevo gasto
        await mockApi.createProjectExpense({
          projectId: project.id,
          category: formData.category as ExpenseCategory,
          description: formData.description,
          cost,
          startDate,
          endDate,
        });

        toast({
          title: 'Éxito',
          description: 'Gasto añadido correctamente',
        });
      }

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar el gasto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<ExpenseCategory, string> = {
    [ExpenseCategory.SERVER]: 'Servidor',
    [ExpenseCategory.INFRASTRUCTURE]: 'Infraestructura',
    [ExpenseCategory.LICENSE]: 'Licencia',
    [ExpenseCategory.TOOL]: 'Herramienta',
    [ExpenseCategory.SERVICE]: 'Servicio',
    [ExpenseCategory.OTHER]: 'Otro',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{expense ? 'Editar Gasto' : 'Añadir Gasto'}</DialogTitle>
          <DialogDescription>
            {expense ? 'Modifica los datos del gasto' : 'Añade un nuevo gasto al proyecto'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ExpenseCategory).map((category) => (
                    <SelectItem key={category} value={category}>
                      {categoryLabels[category]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción *</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Ej: Servidor AWS EC2 t3.large"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cost">Costo Mensual (€) *</Label>
              <Input
                id="cost"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                placeholder="Ej: 150"
              />
              <p className="text-xs text-muted-foreground">
                Costo mensual del gasto
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Fecha de Inicio *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">Fecha de Fin (opcional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Deja vacío si el gasto es continuo
              </p>
            </div>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : expense ? 'Actualizar' : 'Añadir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

