import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTechnologies } from '@/hooks/useTechnologies';
import { TechCategory } from '@/types/database';
import { mockEmployeeTechnologies } from '@/lib/mock-data';
import { Plus } from 'lucide-react';

export const TechnologiesPage = () => {
  const { technologies, loading } = useTechnologies();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTechs = technologies.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const employeeCountByTech = useMemo(() => {
    const count: Record<string, number> = {};
    mockEmployeeTechnologies.forEach((et) => {
      count[et.technologyId] = (count[et.technologyId] || 0) + 1;
    });
    return count;
  }, []);

  const techsByCategory = filteredTechs.reduce((acc, tech) => {
    if (!acc[tech.category]) {
      acc[tech.category] = [];
    }
    acc[tech.category].push(tech);
    return acc;
  }, {} as Record<TechCategory, typeof technologies>);

  if (loading) {
    return <div>Cargando tecnologías...</div>;
  }

  const categoriesEntries = Object.entries(techsByCategory);
  const defaultCategory = categoriesEntries[0]?.[0] ?? '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tecnologías</h1>
          <p className="text-muted-foreground mt-2">
            Explora las tecnologías utilizadas en la empresa
          </p>
        </div>
        <Button onClick={() => navigate('/technologies/new')}>
          <Plus className="mr-2 h-4 w-4" />
          Añadir Tecnología
        </Button>
      </div>

      <Input
        placeholder="Buscar tecnologías..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />
      
      {categoriesEntries.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No se han encontrado tecnologías con los filtros actuales.
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue={defaultCategory} className="space-y-4">
          <TabsList>
            {categoriesEntries.map(([category]) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categoriesEntries.map(([category, techs]) => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {techs.map((tech) => (
                  <Link key={tech.id} to={`/technologies/${tech.id}/edit`}>
                    <Card className="transition-shadow hover:shadow-md cursor-pointer">
                      <CardHeader>
                        <CardTitle className="text-lg">{tech.name}</CardTitle>
                        <CardDescription>
                          <Badge variant="outline">{tech.category}</Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {tech.color && (
                          <div
                            className="h-4 w-full rounded"
                            style={{ backgroundColor: tech.color }}
                          />
                        )}
                        <div className="text-sm text-muted-foreground">
                          {employeeCountByTech[tech.id] || 0}{' '}
                          {employeeCountByTech[tech.id] === 1 ? 'personaje' : 'personajes'} conoce
                          {employeeCountByTech[tech.id] !== 1 ? 'n' : ''} esta tecnología
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

