import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/lib/api';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTechnologies } from '@/hooks/useTechnologies';
import type { Employee } from '@/types/database';
import { EmployeeStatus } from '@/types/database';
import { ArrowLeft, X, Plus } from 'lucide-react';

interface TeamMember {
  employeeId: string;
  role: string;
  allocation: number;
}

type ProjectFormValues = import('zod').infer<typeof projectSchema>;

export const ProjectFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { offices } = useOffices();
  const { technologies } = useTechnologies();
  const [loading, setLoading] = useState(false);
  const [selectedTechnologies, setSelectedTechnologies] = useState<string[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [availableEmployees, setAvailableEmployees] = useState<Employee[]>([]);
  const [additionalOffices, setAdditionalOffices] = useState<string[]>([]);
  const [newMemberForm, setNewMemberForm] = useState<TeamMember>({
    employeeId: '',
    role: '',
    allocation: 50,
  });
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
      startDate: new Date(),
      endDate: null,
      clientName: '',
      budget: null,
      officeId: '',
      isInternal: false,
    },
  });

  const selectedOfficeId = watch('officeId');
  
  // Cargar empleados de la sede principal y sedes adicionales
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const allEmployees: Employee[] = [];
        
        // Cargar empleados de la sede principal
        if (selectedOfficeId) {
          const mainOfficeEmployees = await api.getEmployees({ officeId: selectedOfficeId });
          allEmployees.push(...mainOfficeEmployees);
        }
        
        // Cargar empleados de las sedes adicionales
        for (const officeId of additionalOffices) {
          const additionalOfficeEmployees = await api.getEmployees({ officeId });
          allEmployees.push(...additionalOfficeEmployees);
        }
        
        // Filtrar duplicados y solo activos
        const uniqueActiveEmployees = allEmployees
          .filter((e, index, self) => 
            index === self.findIndex(emp => emp.id === e.id) && e.status === EmployeeStatus.ACTIVE
          );
        
        setAvailableEmployees(uniqueActiveEmployees);
      } catch (error) {
        console.error('Error loading employees:', error);
      }
    };
    
    if (selectedOfficeId || additionalOffices.length > 0) {
      loadEmployees();
    }
  }, [selectedOfficeId, additionalOffices]);

  useEffect(() => {
    if (isEditing && id) {
      const loadProject = async () => {
        try {
          const project = await api.getProjectById(id);
          setValue('name', project.name);
          setValue('description', project.description || '');
          setValue('status', project.status);
          setValue('priority', project.priority);
          setValue('startDate', project.startDate);
          setValue('endDate', project.endDate || null);
          setValue('clientName', project.clientName || '');
          setValue('budget', project.budget || null);
          setValue('officeId', project.officeId);
          setValue('isInternal', project.isInternal || false);
          
          // Cargar tecnologías del proyecto
          if (project.technologies) {
            setSelectedTechnologies(project.technologies.map(pt => pt.technologyId));
          }
          
          // Cargar equipo del proyecto
          if (project.employees) {
            setTeamMembers(project.employees.map(pe => ({
              employeeId: pe.employeeId,
              role: pe.role,
              allocation: pe.allocation,
            })));
          }
          
          // Cargar sedes adicionales del proyecto
          if (project.additionalOffices) {
            setAdditionalOffices(project.additionalOffices.map(po => po.officeId));
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      };
      loadProject();
    } else {
      // Set default office for new projects
      if (offices.length > 0 && user?.role !== 'DIRECTOR') {
        const defaultOffice = offices[0];
        if (defaultOffice) {
          setValue('officeId', defaultOffice.id);
        }
      }
    }
  }, [id, isEditing, setValue, offices, user]);

  const handleAddTeamMember = () => {
    if (!newMemberForm.employeeId || !newMemberForm.role) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }
    
    if (teamMembers.some(tm => tm.employeeId === newMemberForm.employeeId)) {
      toast({
        title: 'Error',
        description: 'Este empleado ya está en el equipo',
        variant: 'destructive',
      });
      return;
    }
    
    setTeamMembers([...teamMembers, newMemberForm]);
    setNewMemberForm({ employeeId: '', role: '', allocation: 50 });
  };

  const handleRemoveTeamMember = (employeeId: string) => {
    setTeamMembers(teamMembers.filter(tm => tm.employeeId !== employeeId));
  };

  const handleTechnologyToggle = (technologyId: string) => {
    if (selectedTechnologies.includes(technologyId)) {
      setSelectedTechnologies(selectedTechnologies.filter(id => id !== technologyId));
    } else {
      setSelectedTechnologies([...selectedTechnologies, technologyId]);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await api.updateProject(id, {
          ...data,
          isInternal: data.isInternal || false,
        });
        toast({
          title: 'Proyecto actualizado',
          description: 'El proyecto se ha actualizado correctamente',
        });
        
        // Para edición, mantener las llamadas separadas por ahora
        // Añadir tecnologías al proyecto
        for (const techId of selectedTechnologies) {
          try {
            await api.addTechnologyToProject({
              projectId: id,
              technologyId: techId,
            });
          } catch (error) {
            console.error('Error adding technology:', error);
          }
        }

        // Añadir empleados al proyecto
        for (const member of teamMembers) {
          try {
            await api.assignEmployeeToProject({
              projectId: id,
              employeeId: member.employeeId,
              role: member.role,
              allocation: member.allocation,
              startDate: data.startDate,
              endDate: data.endDate,
            });
          } catch (error) {
            console.error('Error adding employee:', error);
          }
        }
      } else {
        // Para creación, enviar todo en una sola petición
        await api.createProject({
          ...data,
          isInternal: data.isInternal || false,
          technologies: selectedTechnologies,
          team: teamMembers,
          additionalOffices: additionalOffices,
        });
        toast({
          title: 'Proyecto creado',
          description: 'El proyecto se ha creado correctamente',
        });
      }

      navigate('/projects');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar el proyecto',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const availableOffices = user?.role === 'DIRECTOR' 
    ? offices 
    : offices.filter(o => o.id === watch('officeId'));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input id="name" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" {...register('description')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select
                  value={watch('status')}
                  onValueChange={(value) => setValue('status', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">Planificación</SelectItem>
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="ON_HOLD">En Pausa</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={watch('priority')}
                  onValueChange={(value) => setValue('priority', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baja</SelectItem>
                    <SelectItem value="MEDIUM">Media</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                    <SelectItem value="URGENT">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeId">Sede *</Label>
              <Select
                value={watch('officeId')}
                onValueChange={(value) => setValue('officeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sede" />
                </SelectTrigger>
                <SelectContent>
                  {availableOffices.map((office) => (
                    <SelectItem key={office.id} value={office.id}>
                      {office.name} ({office.country})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.officeId && (
                <p className="text-sm text-destructive">{errors.officeId.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">Cliente</Label>
              <Input id="clientName" {...register('clientName')} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Fecha de Inicio *</Label>
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate', { valueAsDate: true })}
                />
                {errors.startDate && (
                  <p className="text-sm text-destructive">{errors.startDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">Fecha de Fin</Label>
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate', { valueAsDate: true, setValueAs: (v) => v || null })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Presupuesto</Label>
              <Input
                id="budget"
                type="number"
                step="0.01"
                {...register('budget', { valueAsNumber: true, setValueAs: (v) => v || null })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isInternal"
                  checked={watch('isInternal')}
                  onCheckedChange={(checked) => setValue('isInternal', checked as boolean)}
                />
                <Label htmlFor="isInternal" className="cursor-pointer">
                  Proyecto interno
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Marca esta opción si el proyecto es para uso interno de la empresa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Sedes Adicionales */}
        <Card>
          <CardHeader>
            <CardTitle>Sedes Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Selecciona sedes adicionales para permitir que trabajadores de otras sedes participen en este proyecto.
            </p>
            
            {selectedOfficeId && (
              <div className="space-y-2">
                <Label>Sedes disponibles</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {offices
                    .filter(office => office.id !== selectedOfficeId)
                    .map((office) => (
                      <div key={office.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`office-${office.id}`}
                          checked={additionalOffices.includes(office.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setAdditionalOffices([...additionalOffices, office.id]);
                            } else {
                              setAdditionalOffices(additionalOffices.filter(id => id !== office.id));
                            }
                          }}
                        />
                        <Label htmlFor={`office-${office.id}`} className="cursor-pointer flex-1">
                          {office.name} ({office.country})
                        </Label>
                      </div>
                    ))}
                </div>
                {offices.filter(office => office.id !== selectedOfficeId).length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay otras sedes disponibles
                  </p>
                )}
              </div>
            )}
            
            {additionalOffices.length > 0 && (
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium mb-2">Sedes adicionales seleccionadas:</p>
                <div className="flex flex-wrap gap-2">
                  {additionalOffices.map((officeId) => {
                    const office = offices.find(o => o.id === officeId);
                    return office ? (
                      <div key={officeId} className="flex items-center gap-2 px-2 py-1 bg-background rounded border">
                        <span className="text-sm">{office.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4"
                          onClick={() => {
                            setAdditionalOffices(additionalOffices.filter(id => id !== officeId));
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tecnologías */}
        <Card>
          <CardHeader>
            <CardTitle>Tecnologías</CardTitle>
          </CardHeader>
          <CardContent>
            {technologies.length === 0 ? (
              <p className="text-sm text-muted-foreground">Cargando tecnologías...</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {technologies.map((tech) => (
                  <div key={tech.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tech-${tech.id}`}
                      checked={selectedTechnologies.includes(tech.id)}
                      onCheckedChange={() => handleTechnologyToggle(tech.id)}
                    />
                    <Label htmlFor={`tech-${tech.id}`} className="cursor-pointer flex-1">
                      {tech.name}
                    </Label>
                    {tech.color && (
                      <div
                        className="h-4 w-4 rounded"
                        style={{ backgroundColor: tech.color }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Equipo */}
        <Card>
          <CardHeader>
            <CardTitle>Equipo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Lista de miembros del equipo */}
            {teamMembers.length > 0 && (
              <div className="space-y-2">
                {teamMembers.map((member) => {
                  const employee = availableEmployees.find(e => e.id === member.employeeId);
                  return (
                    <div key={member.employeeId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{employee?.name || 'Empleado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {member.role} - {member.allocation}%
                          {employee?.office && (
                            <span className="ml-2 text-xs">• {employee.office.name}</span>
                          )}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveTeamMember(member.employeeId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Formulario para añadir nuevo miembro */}
            {selectedOfficeId && (
              <div className="space-y-3 p-4 border rounded-lg">
                <h4 className="font-medium">Añadir miembro al equipo</h4>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={newMemberForm.employeeId}
                    onValueChange={(value) => setNewMemberForm({ ...newMemberForm, employeeId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Empleado" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEmployees
                        .filter(emp => !teamMembers.some(tm => tm.employeeId === emp.id))
                        .map((employee) => (
                          <SelectItem key={employee.id} value={employee.id}>
                            <div className="flex flex-col">
                              <span>{employee.name}</span>
                              {employee.office && (
                                <span className="text-xs text-muted-foreground">
                                  {employee.office.name}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={newMemberForm.role}
                    onValueChange={(value) => setNewMemberForm({ ...newMemberForm, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Desarrollador">Desarrollador</SelectItem>
                      <SelectItem value="Tech Lead">Tech Lead</SelectItem>
                      <SelectItem value="QA">QA</SelectItem>
                      <SelectItem value="Diseñador">Diseñador</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                      <SelectItem value="Scrum Master">Scrum Master</SelectItem>
                      <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      placeholder="%"
                      value={newMemberForm.allocation}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, allocation: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <Button
                      type="button"
                      size="icon"
                      onClick={handleAddTeamMember}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/projects')}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

