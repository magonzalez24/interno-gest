import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useTechnologies } from '@/hooks/useTechnologies';
import { TechCategory } from '@/types/database';
import { mockEmployeeTechnologies } from '@/lib/mock-data';

export const TechnologiesPage = () => {
  const { technologies, loading } = useTechnologies();
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tecnologías</h1>
        <p className="text-muted-foreground mt-2">
          Explora las tecnologías utilizadas en la empresa
        </p>
      </div>

      <Input
        placeholder="Buscar tecnologías..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      {Object.entries(techsByCategory).map(([category, techs]) => (
        <div key={category} className="space-y-4">
          <h2 className="text-xl font-semibold">{category}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {techs.map((tech) => (
              <Card key={tech.id} className="hover:shadow-md transition-shadow">
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
                    {employeeCountByTech[tech.id] || 0} {employeeCountByTech[tech.id] === 1 ? 'personaje' : 'personajes'} conoce{employeeCountByTech[tech.id] !== 1 ? 'n' : ''} esta tecnología
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

