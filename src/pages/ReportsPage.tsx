import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const ReportsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reportes</h1>
        <p className="text-muted-foreground mt-2">
          Genera y visualiza reportes del sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Los reportes estarán disponibles próximamente
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

