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
import type { Employee, Project } from '@/types/database';
import { EmployeeStatus } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';

interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess: () => void;
}

export const AddTeamMemberModal = ({ open, onOpenChange, project, onSuccess }: AddTeamMemberModalProps) => {
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: '',
    role: '',
    allocation: '50',
  });

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        // Obtener todos los empleados de la misma oficina que el proyecto
        const allEmployees = await mockApi.getEmployees({ officeId: project.officeId });
        
        // Filtrar solo empleados activos que no estén ya asignados al proyecto
        const assignedEmployeeIds = new Set(project.employees?.map(pe => pe.employeeId) || []);
        const availableEmployees = allEmployees.filter(
          emp => emp.status === EmployeeStatus.ACTIVE && !assignedEmployeeIds.has(emp.id)
        );
        
        setEmployees(availableEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
        toast({
          title: 'Error',
          description: 'Error al cargar los empleados',
          variant: 'destructive',
        });
      }
    };
    
    if (open) {
      loadEmployees();
      // Reset form
      setFormData({
        employeeId: '',
        role: '',
        allocation: '50',
      });
    }
  }, [open, project, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.role || !formData.allocation) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos requeridos',
        variant: 'destructive',
      });
      return;
    }

    const allocation = parseInt(formData.allocation);
    if (isNaN(allocation) || allocation < 0 || allocation > 100) {
      toast({
        title: 'Error',
        description: 'La asignación debe ser un número entre 0 y 100',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      await mockApi.assignEmployeeToProject({
        projectId: project.id,
        employeeId: formData.employeeId,
        role: formData.role,
        allocation,
        startDate: project.startDate,
        endDate: project.endDate,
      });

      toast({
        title: 'Éxito',
        description: 'Empleado añadido al equipo correctamente',
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al añadir el empleado',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = ['Desarrollador', 'Tech Lead', 'QA', 'Diseñador', 'PM', 'Scrum Master', 'Business Analyst'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Añadir Compañero al Equipo</DialogTitle>
          <DialogDescription>
            Selecciona un empleado para añadir al proyecto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Empleado *</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
              >
                <SelectTrigger id="employee">
                  <SelectValue placeholder="Selecciona un empleado" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.name} - {employee.position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {employees.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No hay empleados disponibles para asignar
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Selecciona un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="allocation">Asignación (%) *</Label>
              <Input
                id="allocation"
                type="number"
                min="0"
                max="100"
                value={formData.allocation}
                onChange={(e) => setFormData({ ...formData, allocation: e.target.value })}
                placeholder="Ej: 50"
              />
              <p className="text-xs text-muted-foreground">
                Porcentaje de tiempo dedicado al proyecto (0-100)
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
            <Button type="submit" disabled={loading || employees.length === 0}>
              {loading ? 'Añadiendo...' : 'Añadir'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

