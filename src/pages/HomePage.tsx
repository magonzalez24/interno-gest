import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users, LayoutDashboard, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';

export const HomePage = () => {
  const { user } = useAuth();

  const quickLinks = [
    {
      title: 'Mis Proyectos',
      description: 'Ver proyectos asignados',
      href: '/projects',
      icon: FolderKanban,
      roles: [UserRole.EMPLOYEE],
    },
    {
      title: 'Dashboard',
      description: 'Ver métricas y estadísticas',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: [UserRole.MANAGER, UserRole.DIRECTOR],
    },
    {
      title: 'Mi Equipo',
      description: 'Ver miembros del equipo',
      href: '/employees',
      icon: Users,
      roles: [UserRole.MANAGER, UserRole.DIRECTOR],
    },
    {
      title: 'Tecnologías',
      description: 'Explorar tecnologías',
      href: '/technologies',
      icon: Code,
    },
  ];

  const filteredLinks = quickLinks.filter(link => {
    if (!link.roles) return true;
    return user && link.roles.includes(user.role);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bienvenido a Excelia</h1>
        <p className="text-muted-foreground mt-2">
          Sistema de gestión de proyectos y trabajadores
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link key={link.href} to={link.href}>
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <CardTitle>{link.title}</CardTitle>
                  </div>
                  <CardDescription>{link.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

