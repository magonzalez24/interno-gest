import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configuración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona la configuración de tu cuenta
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preferencias</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Las opciones de configuración estarán disponibles próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

