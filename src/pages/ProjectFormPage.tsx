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
import { Badge } from '@/components/ui/badge';
import { mockApi } from '@/lib/mock-api';
import { useOffices } from '@/contexts/OfficeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { useTechnologies } from '@/hooks/useTechnologies';
import { useEmployees } from '@/hooks/useEmployees';
import type { Project, Technology, Employee } from '@/types/database';
import { EmployeeStatus } from '@/types/database';
import { ArrowLeft, X, Plus } from 'lucide-react';

interface TeamMember {
  employeeId: string;
  role: string;
  allocation: number;
}

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
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'PLANNING' as const,
      priority: 'MEDIUM' as const,
      startDate: new Date(),
      endDate: null,
      clientName: '',
      budget: null,
      officeId: '',
      isInternal: false,
    },
  });

  const selectedOfficeId = watch('officeId');
  
  // Cargar empleados cuando cambia la oficina
  useEffect(() => {
    if (selectedOfficeId) {
      const loadEmployees = async () => {
        try {
          const employees = await mockApi.getEmployees({ officeId: selectedOfficeId });
          const activeEmployees = employees.filter(e => e.status === EmployeeStatus.ACTIVE);
          setAvailableEmployees(activeEmployees);
        } catch (error) {
          console.error('Error loading employees:', error);
        }
      };
      loadEmployees();
    }
  }, [selectedOfficeId]);

  useEffect(() => {
    if (isEditing && id) {
      const loadProject = async () => {
        try {
          const project = await mockApi.getProjectById(id);
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
      let projectId: string;
      
      if (isEditing && id) {
        await mockApi.updateProject(id, {
          ...data,
          isInternal: data.isInternal || false,
        });
        projectId = id;
        toast({
          title: 'Proyecto actualizado',
          description: 'El proyecto se ha actualizado correctamente',
        });
      } else {
        const newProject = await mockApi.createProject({
          ...data,
          isInternal: data.isInternal || false,
        });
        projectId = newProject.id;
        toast({
          title: 'Proyecto creado',
          description: 'El proyecto se ha creado correctamente',
        });
      }

      // Añadir tecnologías al proyecto
      for (const techId of selectedTechnologies) {
        try {
          await mockApi.addTechnologyToProject({
            projectId,
            technologyId: techId,
          });
        } catch (error) {
          console.error('Error adding technology:', error);
        }
      }

      // Añadir empleados al proyecto
      for (const member of teamMembers) {
        try {
          await mockApi.assignEmployeeToProject({
            projectId,
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
    <div className="space-y-6">
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
                            {employee.name}
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

