import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockApi } from '@/lib/mock-api';
import { useOffices } from '@/contexts/OfficeContext';
import { useDepartments } from '@/hooks/useDepartments';
import { useTechnologies } from '@/hooks/useTechnologies';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, X } from 'lucide-react';
import { SkillLevel } from '@/types/database';

export const EmployeeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { offices } = useOffices();
  const { technologies } = useTechnologies();
  const [loading, setLoading] = useState(false);
  const [employeeTechnologies, setEmployeeTechnologies] = useState<Array<{
    technologyId: string;
    level: SkillLevel;
    yearsOfExp: number;
  }>>([]);
  const [newTechForm, setNewTechForm] = useState<{
    technologyId: string;
    level: SkillLevel;
    yearsOfExp: number;
  }>({
    technologyId: '',
    level: SkillLevel.INTERMEDIATE,
    yearsOfExp: 1,
  });
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<{
    name: string;
    position: string;
    departmentId: string | null;
    phone: string;
    officeId: string;
    status: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED';
    hireDate: Date;
    salary: number | null;
  }>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      name: '',
      position: '',
      departmentId: null,
      phone: '',
      officeId: '',
      status: 'ACTIVE',
      hireDate: new Date(),
      salary: null,
    },
  });

  const selectedOfficeId = watch('officeId');
  const { departments } = useDepartments(selectedOfficeId);

  useEffect(() => {
    if (isEditing && id) {
      const loadEmployee = async () => {
        try {
          const employee = await mockApi.getEmployeeById(id);
          setValue('name', employee.name);
          setValue('position', employee.position);
          setValue('departmentId', employee.departmentId ?? null);
          setValue('phone', employee.phone || '');
          setValue('officeId', employee.officeId);
          setValue('status', employee.status as 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'TERMINATED');
          setValue('hireDate', employee.hireDate);
          setValue('salary', employee.salary ?? null);
          
          // Cargar tecnologías del empleado
          if (employee.technologies) {
            setEmployeeTechnologies(employee.technologies.map(et => ({
              technologyId: et.technologyId,
              level: et.level,
              yearsOfExp: et.yearsOfExp,
            })));
          }
        } catch (error) {
          console.error('Error loading employee:', error);
        }
      };
      loadEmployee();
    } else {
      if (offices.length > 0 && user?.role !== 'DIRECTOR') {
        const defaultOffice = offices[0];
        if (defaultOffice) {
          setValue('officeId', defaultOffice.id);
        }
      }
    }
  }, [id, isEditing, setValue, offices, user]);

  const handleAddTechnology = () => {
    if (!newTechForm.technologyId) {
      toast({
        title: 'Error',
        description: 'Por favor selecciona una tecnología',
        variant: 'destructive',
      });
      return;
    }

    if (employeeTechnologies.some(et => et.technologyId === newTechForm.technologyId)) {
      toast({
        title: 'Error',
        description: 'Esta tecnología ya está añadida',
        variant: 'destructive',
      });
      return;
    }

    setEmployeeTechnologies([...employeeTechnologies, { ...newTechForm }]);
    setNewTechForm({
      technologyId: '',
      level: SkillLevel.INTERMEDIATE,
      yearsOfExp: 1,
    });
  };

  const handleRemoveTechnology = (technologyId: string) => {
    setEmployeeTechnologies(employeeTechnologies.filter(et => et.technologyId !== technologyId));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      let employeeId: string;
      
      if (isEditing && id) {
        await mockApi.updateEmployee(id, data);
        employeeId = id;
        toast({
          title: 'Empleado actualizado',
          description: 'El empleado se ha actualizado correctamente',
        });
      } else {
        const newEmployee = await mockApi.createEmployee(data);
        employeeId = newEmployee.id;
        toast({
          title: 'Empleado creado',
          description: 'El empleado se ha creado correctamente',
        });
      }

      // Añadir tecnologías al empleado
      for (const tech of employeeTechnologies) {
        try {
          await mockApi.addTechnologyToEmployee({
            employeeId,
            technologyId: tech.technologyId,
            level: tech.level,
            yearsOfExp: tech.yearsOfExp,
          });
        } catch (error) {
          console.error('Error adding technology:', error);
        }
      }

      navigate('/employees');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar el empleado',
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
        <Button variant="ghost" size="icon" onClick={() => navigate('/employees')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">
          {isEditing ? 'Editar Empleado' : 'Nuevo Empleado'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información del Empleado</CardTitle>
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
              <Label htmlFor="position">Posición *</Label>
              <Input id="position" {...register('position')} />
              {errors.position && (
                <p className="text-sm text-destructive">{errors.position.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                <Label htmlFor="departmentId">Departamento</Label>
                <Select
                  value={watch('departmentId') || 'none'}
                  onValueChange={(value) => {
                    const deptId = value === 'none' ? null : value;
                    setValue('departmentId', deptId as string | null);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin departamento</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" {...register('phone')} />
              </div>

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
                    <SelectItem value="ACTIVE">Activo</SelectItem>
                    <SelectItem value="INACTIVE">Inactivo</SelectItem>
                    <SelectItem value="ON_LEAVE">En Licencia</SelectItem>
                    <SelectItem value="TERMINATED">Terminado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hireDate">Fecha de Ingreso *</Label>
                <Input
                  id="hireDate"
                  type="date"
                  {...register('hireDate', { valueAsDate: true })}
                />
                {errors.hireDate && (
                  <p className="text-sm text-destructive">{errors.hireDate.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Sueldo Anual (€)</Label>
                <Input
                  id="salary"
                  type="number"
                  min="0"
                  step="100"
                  placeholder="Ej: 50000"
                  {...register('salary', { 
                    valueAsNumber: true,
                    setValueAs: (v) => v === '' ? null : Number(v)
                  })}
                />
                {errors.salary && (
                  <p className="text-sm text-destructive">{errors.salary.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tecnologías</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newTech">Tecnología</Label>
                  <Select
                    value={newTechForm.technologyId}
                    onValueChange={(value) => setNewTechForm({ ...newTechForm, technologyId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tecnología" />
                    </SelectTrigger>
                    <SelectContent>
                      {technologies
                        .filter(tech => !employeeTechnologies.some(et => et.technologyId === tech.id))
                        .map((tech) => (
                          <SelectItem key={tech.id} value={tech.id}>
                            {tech.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newTechLevel">Nivel</Label>
                  <Select
                    value={newTechForm.level}
                    onValueChange={(value) => setNewTechForm({ ...newTechForm, level: value as SkillLevel })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={SkillLevel.BEGINNER}>Principiante</SelectItem>
                      <SelectItem value={SkillLevel.INTERMEDIATE}>Intermedio</SelectItem>
                      <SelectItem value={SkillLevel.ADVANCED}>Avanzado</SelectItem>
                      <SelectItem value={SkillLevel.EXPERT}>Experto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newTechYears">Años de Experiencia</Label>
                  <Input
                    id="newTechYears"
                    type="number"
                    min="0"
                    max="50"
                    value={newTechForm.yearsOfExp}
                    onChange={(e) => setNewTechForm({ ...newTechForm, yearsOfExp: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleAddTechnology}
                disabled={!newTechForm.technologyId}
              >
                Añadir Tecnología
              </Button>
            </div>

            {employeeTechnologies.length > 0 && (
              <div className="space-y-2">
                <Label>Tecnologías Añadidas</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {employeeTechnologies.map((et) => {
                    const tech = technologies.find(t => t.id === et.technologyId);
                    return (
                      <div
                        key={et.technologyId}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{tech?.name || 'Tecnología desconocida'}</p>
                          <p className="text-sm text-muted-foreground">
                            {et.level === SkillLevel.BEGINNER ? 'Principiante' :
                             et.level === SkillLevel.INTERMEDIATE ? 'Intermedio' :
                             et.level === SkillLevel.ADVANCED ? 'Avanzado' :
                             et.level === SkillLevel.EXPERT ? 'Experto' : et.level} - {et.yearsOfExp} {et.yearsOfExp === 1 ? 'año' : 'años'} de experiencia
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveTechnology(et.technologyId)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate('/employees')}>
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

