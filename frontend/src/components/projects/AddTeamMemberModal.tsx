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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import type { Employee, Project, Office } from '@/types/database';
import { EmployeeStatus } from '@/types/database';
import { useToast } from '@/components/ui/use-toast';
import { useTechnologies } from '@/hooks/useTechnologies';
import { ChevronDown, Filter, X } from 'lucide-react';

interface AddTeamMemberModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
  onSuccess: () => void;
}

interface SelectedEmployee {
  employee: Employee;
  role: string;
  allocation: string;
}

export const AddTeamMemberModal = ({ open, onOpenChange, project, onSuccess }: AddTeamMemberModalProps) => {
  const { toast } = useToast();
  const { technologies } = useTechnologies();
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOffices, setSelectedOffices] = useState<string[]>([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [selectedEmployees, setSelectedEmployees] = useState<SelectedEmployee[]>([]);

  // Obtener todas las sedes asociadas al proyecto
  const projectOffices = useMemo(() => {
    const officesList: Office[] = [];
    if (project.office) {
      officesList.push(project.office);
    }
    if (project.additionalOffices) {
      project.additionalOffices.forEach(po => {
        if (po.office && !officesList.find(o => o.id === po.officeId)) {
          officesList.push(po.office);
        }
      });
    }
    return officesList;
  }, [project]);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const employeesList: Employee[] = [];
        
        // Obtener empleados de la sede principal
        const mainOfficeEmployees = await api.getEmployees({ officeId: project.officeId });
        employeesList.push(...mainOfficeEmployees);
        
        // Obtener empleados de las sedes adicionales
        if (project.additionalOffices) {
          for (const po of project.additionalOffices) {
            const additionalOfficeEmployees = await api.getEmployees({ officeId: po.officeId });
            employeesList.push(...additionalOfficeEmployees);
          }
        }
        
        // Filtrar duplicados y solo activos
        const assignedEmployeeIds = new Set(project.employees?.map(pe => pe.employeeId) || []);
        const uniqueEmployees = employeesList.filter(
          (emp, index, self) => 
            index === self.findIndex(e => e.id === emp.id) &&
            emp.status === EmployeeStatus.ACTIVE && 
            !assignedEmployeeIds.has(emp.id)
        );
        
        setAllEmployees(uniqueEmployees);
        setOffices(projectOffices);
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
      // Reset filtros y seleccionados
      setSelectedOffices([]);
      setSelectedTechnologies([]);
      setSelectedEmployees([]);
    }
  }, [open, project, toast, projectOffices]);

  // Filtrar empleados según los filtros seleccionados y excluir los ya seleccionados
  const filteredEmployees = useMemo(() => {
    let filtered = allEmployees;
    const selectedEmployeeIds = new Set(selectedEmployees.map(se => se.employee.id));

    // Excluir empleados ya seleccionados
    filtered = filtered.filter(emp => !selectedEmployeeIds.has(emp.id));

    // Filtrar por sedes
    if (selectedOffices.length > 0) {
      filtered = filtered.filter(emp => 
        selectedOffices.includes(emp.officeId)
      );
    }

    // Filtrar por tecnologías
    if (selectedTechnologies.length > 0) {
      filtered = filtered.filter(emp => {
        const employeeTechIds = emp.technologies?.map(et => et.technologyId) || [];
        return selectedTechnologies.some(techId => employeeTechIds.includes(techId));
      });
    }

    return filtered;
  }, [allEmployees, selectedOffices, selectedTechnologies, selectedEmployees]);

  const handleToggleOffice = (officeId: string) => {
    setSelectedOffices(prev => 
      prev.includes(officeId)
        ? prev.filter(id => id !== officeId)
        : [...prev, officeId]
    );
  };

  const handleToggleTechnology = (techId: string) => {
    setSelectedTechnologies(prev => 
      prev.includes(techId)
        ? prev.filter(id => id !== techId)
        : [...prev, techId]
    );
  };

  const handleAddEmployee = (employee: Employee) => {
    // Verificar que el empleado no esté ya seleccionado
    if (selectedEmployees.find(se => se.employee.id === employee.id)) {
      return;
    }

    setSelectedEmployees(prev => [...prev, {
      employee,
      role: '',
      allocation: '50',
    }]);
  };

  const handleRemoveEmployee = (employeeId: string) => {
    setSelectedEmployees(prev => prev.filter(se => se.employee.id !== employeeId));
  };

  const handleUpdateSelectedEmployee = (employeeId: string, field: 'role' | 'allocation', value: string) => {
    setSelectedEmployees(prev => 
      prev.map(se => 
        se.employee.id === employeeId 
          ? { ...se, [field]: value }
          : se
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedEmployees.length === 0) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona al menos un empleado',
        variant: 'destructive',
      });
      return;
    }

    // Validar que todos los empleados seleccionados tengan rol y asignación
    const invalidEmployees = selectedEmployees.filter(se => !se.role || !se.allocation);
    if (invalidEmployees.length > 0) {
      toast({
        title: 'Error',
        description: 'Por favor completa el rol y asignación para todos los empleados seleccionados',
        variant: 'destructive',
      });
      return;
    }

    // Validar asignaciones
    const invalidAllocations = selectedEmployees.filter(se => {
      const allocation = parseInt(se.allocation);
      return isNaN(allocation) || allocation < 0 || allocation > 100;
    });
    if (invalidAllocations.length > 0) {
      toast({
        title: 'Error',
        description: 'La asignación debe ser un número entre 0 y 100 para todos los empleados',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Asignar todos los empleados seleccionados
      await Promise.all(
        selectedEmployees.map(se => 
          api.assignEmployeeToProject({
            projectId: project.id,
            employeeId: se.employee.id,
            role: se.role,
            allocation: parseInt(se.allocation),
            startDate: project.startDate,
            endDate: project.endDate,
          })
        )
      );

      toast({
        title: 'Éxito',
        description: `${selectedEmployees.length} empleado(s) añadido(s) al equipo correctamente`,
      });

      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al añadir los empleados',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const roles = ['Desarrollador', 'Tech Lead', 'QA', 'Diseñador', 'PM', 'Scrum Master', 'Business Analyst'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Añadir Compañero al Equipo</DialogTitle>
          <DialogDescription>
            Selecciona un empleado para añadir al proyecto
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Filtros */}
            <div className="flex gap-4 pb-4 border-b">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-between">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Sedes
                      {selectedOffices.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedOffices.length}
                        </Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
                  <DropdownMenuLabel>Sedes</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {offices.map((office) => (
                    <DropdownMenuCheckboxItem
                      key={office.id}
                      checked={selectedOffices.includes(office.id)}
                      onCheckedChange={() => handleToggleOffice(office.id)}
                    >
                      {office.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-between">
                    <span className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Tecnologías
                      {selectedTechnologies.length > 0 && (
                        <Badge variant="secondary" className="ml-1">
                          {selectedTechnologies.length}
                        </Badge>
                      )}
                    </span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[200px] max-h-[300px] overflow-y-auto">
                  <DropdownMenuLabel>Tecnologías</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {technologies.map((tech) => (
                    <DropdownMenuCheckboxItem
                      key={tech.id}
                      checked={selectedTechnologies.includes(tech.id)}
                      onCheckedChange={() => handleToggleTechnology(tech.id)}
                    >
                      {tech.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tabla de empleados disponibles */}
            <div className="space-y-2">
              <Label>Empleados Disponibles</Label>
              <div className="border rounded-lg overflow-hidden">
                <div className="overflow-x-auto max-h-[300px]">
                  <table className="w-full">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium w-12"></th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Sede</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Departamento</th>
                        <th className="px-4 py-3 text-left text-sm font-medium">Tecnologías</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            {allEmployees.length === 0
                              ? 'No hay empleados disponibles para asignar'
                              : selectedEmployees.length > 0 && filteredEmployees.length === 0
                              ? 'Todos los empleados disponibles ya están seleccionados'
                              : 'No hay empleados que coincidan con los filtros seleccionados'}
                          </td>
                        </tr>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <tr
                            key={employee.id}
                            className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                            onClick={() => handleAddEmployee(employee)}
                          >
                            <td className="px-4 py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddEmployee(employee);
                                }}
                              >
                                Añadir
                              </Button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{employee.name}</div>
                              <div className="text-sm text-muted-foreground">{employee.position}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {employee.office?.name || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {employee.department?.name || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {employee.technologies && employee.technologies.length > 0 ? (
                                  employee.technologies.slice(0, 3).map((et) => (
                                    <Badge key={et.id} variant="outline" className="text-xs">
                                      {et.technology?.name || '-'}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                                {employee.technologies && employee.technologies.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{employee.technologies.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tabla de empleados seleccionados */}
            {selectedEmployees.length > 0 && (
              <div className="space-y-2">
                <Label>Empleados Seleccionados</Label>
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto max-h-[300px]">
                    <table className="w-full">
                      <thead className="bg-muted sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium w-12"></th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Nombre</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Sede</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Departamento</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Tecnologías</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Rol *</th>
                          <th className="px-4 py-3 text-left text-sm font-medium">Asignación (%) *</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployees.map((selectedEmployee) => (
                          <tr
                            key={selectedEmployee.employee.id}
                            className="border-b hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-4 py-3">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveEmployee(selectedEmployee.employee.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </td>
                            <td className="px-4 py-3">
                              <div className="font-medium">{selectedEmployee.employee.name}</div>
                              <div className="text-sm text-muted-foreground">{selectedEmployee.employee.position}</div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {selectedEmployee.employee.office?.name || '-'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {selectedEmployee.employee.department?.name || '-'}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1">
                                {selectedEmployee.employee.technologies && selectedEmployee.employee.technologies.length > 0 ? (
                                  selectedEmployee.employee.technologies.slice(0, 3).map((et) => (
                                    <Badge key={et.id} variant="outline" className="text-xs">
                                      {et.technology?.name || '-'}
                                    </Badge>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">-</span>
                                )}
                                {selectedEmployee.employee.technologies && selectedEmployee.employee.technologies.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{selectedEmployee.employee.technologies.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Select
                                value={selectedEmployee.role}
                                onValueChange={(value) => handleUpdateSelectedEmployee(selectedEmployee.employee.id, 'role', value)}
                              >
                                <SelectTrigger className="w-[150px]">
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
                            </td>
                            <td className="px-4 py-3">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={selectedEmployee.allocation}
                                onChange={(e) => handleUpdateSelectedEmployee(selectedEmployee.employee.id, 'allocation', e.target.value)}
                                placeholder="Ej: 50"
                                className="w-[100px]"
                              />
                            </td>
                          </tr>
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
            <Button type="submit" disabled={loading || selectedEmployees.length === 0}>
              {loading ? 'Añadiendo...' : `Añadir ${selectedEmployees.length > 0 ? `(${selectedEmployees.length})` : ''}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

