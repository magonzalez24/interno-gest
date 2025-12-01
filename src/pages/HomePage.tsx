import { Link } from 'react-router-dom';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderKanban, Users, LayoutDashboard, Code } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';
import { useTranslation } from 'react-i18next';

export const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

  const quickLinks = [
    {
      title: t('home.myProjects.title'),
      description: t('home.myProjects.description'),
      href: '/projects',
      icon: FolderKanban,
      roles: [UserRole.EMPLOYEE],
    },
    {
      title: t('home.dashboard.title'),
      description: t('home.dashboard.description'),
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: [UserRole.MANAGER, UserRole.DIRECTOR],
    },
    {
      title: t('home.myTeam.title'),
      description: t('home.myTeam.description'),
      href: '/employees',
      icon: Users,
      roles: [UserRole.MANAGER, UserRole.DIRECTOR],
    },
    {
      title: t('home.technologies.title'),
      description: t('home.technologies.description'),
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
        <h1 className="text-3xl font-bold">{t('home.title')}</h1>
        <p className="text-muted-foreground mt-2">
          {t('home.subtitle')}
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

