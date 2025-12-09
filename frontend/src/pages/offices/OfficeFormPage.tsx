import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { officeSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';

const timezones = [
  'UTC',
  'Europe/Madrid',
  'Europe/Lisbon',
  'America/Santiago',
  'America/Mexico_City',
  'America/Bogota',
  'America/New_York',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
];

export const OfficeFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<{
    name: string;
    country: string;
    address: string;
    timezone: string;
  }>({
    resolver: zodResolver(officeSchema),
    defaultValues: {
      name: '',
      country: '',
      address: '',
      timezone: 'UTC',
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      const loadOffice = async () => {
        try {
          const office = await api.getOfficeById(id);
          setValue('name', office.name);
          setValue('country', office.country);
          setValue('address', office.address || '');
          setValue('timezone', office.timezone);
        } catch (error) {
          console.error('Error loading office:', error);
          toast({
            title: 'Error',
            description: 'Error al cargar la sede',
            variant: 'destructive',
          });
        }
      };
      loadOffice();
    }
  }, [id, isEditing, setValue, toast]);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      if (isEditing && id) {
        await api.updateOffice(id, data);
        toast({
          title: 'Sede actualizada',
          description: 'La sede se ha actualizado correctamente',
        });
      } else {
        await api.createOffice(data);
        toast({
          title: 'Sede creada',
          description: 'La sede se ha creado correctamente',
        });
      }
      navigate('/offices');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error al guardar la sede',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/offices')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">
            {isEditing ? 'Editar Sede' : 'Crear Sede'}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? 'Modifica los datos de la sede' : 'Completa los datos para crear una nueva sede'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Información de la Sede</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ej: Madrid"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">País *</Label>
              <Input
                id="country"
                {...register('country')}
                placeholder="Ej: España"
                disabled={loading}
              />
              {errors.country && (
                <p className="text-sm text-red-500">{errors.country.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Dirección</Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Ej: Calle Gran Vía 123, 28013 Madrid"
                disabled={loading}
              />
              {errors.address && (
                <p className="text-sm text-red-500">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria *</Label>
              <select
                id="timezone"
                {...register('timezone')}
                disabled={loading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
              {errors.timezone && (
                <p className="text-sm text-red-500">{errors.timezone.message}</p>
              )}
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/offices')}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

