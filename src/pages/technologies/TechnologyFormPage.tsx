import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { technologySchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockApi } from '@/lib/mock-api';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { TechCategory, SkillLevel } from '@/types/database';
import { mockEmployeeTechnologies, mockProjectTechnologies, populateRelations } from '@/lib/mock-data';

export const TechnologyFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [technology, setTechnology] = useState<any>(null);
  const isEditing = !!id;

  // Obtener empleados y proyectos relacionados con esta tecnología
  const relatedEmployees = useMemo(() => {
    if (!id) return [];
    populateRelations(); // Asegurar que las relaciones estén populadas
    const employeeTechs = mockEmployeeTechnologies.filter(et => et.technologyId === id);
    return employeeTechs.map(et => ({
      ...et,
      employee: et.employee,
    }));
  }, [id]);

  const relatedProjects = useMemo(() => {
    if (!id) return [];
    populateRelations(); // Asegurar que las relaciones estén populadas
    const projectTechs = mockProjectTechnologies.filter(pt => pt.technologyId === id);
    return projectTechs.map(pt => ({
      ...pt,
      project: pt.project,
    }));
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<{
    name: string;
    category: TechCategory;
    color: string;
  }>({
    resolver: zodResolver(technologySchema),
    defaultValues: {
      name: '',
      category: TechCategory.OTHER,
      color: '',
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const loadTechnology = async () => {
        try {
          populateRelations(); // Asegurar que las relaciones estén populadas
          const tech = await mockApi.getTechnologyById(id);
          setTechnology(tech);
          setValue('name', tech.name);
          setValue('category', tech.category);
          setValue('color', tech.color || '');
        } catch (error) {
          console.error('Error loading technology:', error);
          toast({
            title: 'Error',
            description: 'Error al cargar la tecnología',
            variant: 'destructive',
          });
        }
      };
      loadTechnology();
    }
  }, [id, isEditing, setValue, toast]);

  const getLevelColor = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.EXPERT: return 'bg-purple-100 text-purple-800';
      case SkillLevel.ADVANCED: return 'bg-blue-100 text-blue-800';
      case SkillLevel.INTERMEDIATE: return 'bg-green-100 text-green-800';
      case SkillLevel.BEGINNER: return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelLabel = (level: SkillLevel) => {
    switch (level) {
      case SkillLevel.EXPERT: return 'Experto';
      case SkillLevel.ADVANCED: return 'Avanzado';
      case SkillLevel.INTERMEDIATE: return 'Intermedio';
      case SkillLevel.BEGINNER: return 'Principiante';
      default: return level;
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await mockApi.updateTechnology(id, data);
        toast({
          title: 'Tecnología actualizada',
          description: 'La tecnología se ha actualizado correctamente',
        });
      } else {
        await mockApi.createTechnology(data);
        toast({
          title: 'Tecnología creada',
          description: 'La tecnología se ha creado correctamente',
        });
      }
      navigate('/technologies');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar la tecnología',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const categoryLabels: Record<TechCategory, string> = {
    [TechCategory.FRONTEND]: 'Frontend',
    [TechCategory.BACKEND]: 'Backend',
    [TechCategory.DATABASE]: 'Base de Datos',
    [TechCategory.DEVOPS]: 'DevOps',
    [TechCategory.MOBILE]: 'Mobile',
    [TechCategory.DESIGN]: 'Diseño',
    [TechCategory.TESTING]: 'Testing',
    [TechCategory.OTHER]: 'Otro',
  };

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/technologies')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{technology?.name || 'Cargando...'}</h1>
            {technology && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline">
                  {categoryLabels[technology.category as TechCategory] || technology.category}
                </Badge>
                {technology.color && (
                  <div
                    className="h-4 w-4 rounded"
                    style={{ backgroundColor: technology.color }}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="info" className="space-y-4">
          <TabsList>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="employees">
              Empleados ({relatedEmployees.length})
            </TabsTrigger>
            <TabsTrigger value="projects">
              Proyectos ({relatedProjects.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Card>
                <CardHeader>
                  <CardTitle>Información de la Tecnología</CardTitle>
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
                    <Label htmlFor="category">Categoría *</Label>
                    <Select
                      value={watch('category')}
                      onValueChange={(value) => setValue('category', value as TechCategory)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(categoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color (hex)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="color-picker"
                        type="color"
                        className="w-20 h-10"
                        value={watch('color') || '#000000'}
                        onChange={(e) => setValue('color', e.target.value)}
                      />
                      <Input
                        id="color"
                        type="text"
                        placeholder="#000000"
                        {...register('color')}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Selecciona un color para identificar esta tecnología
                    </p>
                    {errors.color && (
                      <p className="text-sm text-destructive">{errors.color.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => navigate('/technologies')}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Guardando...' : 'Guardar'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="employees" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Empleados que conocen esta tecnología</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedEmployees.length === 0 ? (
                  <p className="text-muted-foreground">No hay empleados asignados a esta tecnología</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedEmployees.map((et) => (
                      <Link key={et.id} to={`/employees/${et.employeeId}`}>
                        <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors">
                          <div>
                            <p className="font-medium">{et.employee?.name || 'Empleado desconocido'}</p>
                            <p className="text-sm text-muted-foreground">
                              {et.yearsOfExp} {et.yearsOfExp === 1 ? 'año' : 'años'} de experiencia
                            </p>
                          </div>
                          <Badge className={getLevelColor(et.level)}>
                            {getLevelLabel(et.level)}
                          </Badge>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Proyectos que usan esta tecnología</CardTitle>
              </CardHeader>
              <CardContent>
                {relatedProjects.length === 0 ? (
                  <p className="text-muted-foreground">No hay proyectos usando esta tecnología</p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {relatedProjects.map((pt) => (
                      <Link key={pt.id} to={`/projects/${pt.projectId}`}>
                        <div className="p-3 border rounded-lg hover:bg-accent transition-colors">
                          <p className="font-medium">{pt.project?.name || 'Proyecto desconocido'}</p>
                          {pt.project?.status && (
                            <Badge variant="outline" className="mt-2">
                              {pt.project.status}
                            </Badge>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/technologies')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Nueva Tecnología</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información de la Tecnología</CardTitle>
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
              <Label htmlFor="category">Categoría *</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value as TechCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color (hex)</Label>
              <div className="flex gap-2">
                <Input
                  id="color-picker"
                  type="color"
                  className="w-20 h-10"
                  value={watch('color') || '#000000'}
                  onChange={(e) => setValue('color', e.target.value)}
                />
                <Input
                  id="color"
                  type="text"
                  placeholder="#000000"
                  {...register('color')}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Selecciona un color para identificar esta tecnología
              </p>
              {errors.color && (
                <p className="text-sm text-destructive">{errors.color.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => navigate('/technologies')}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

