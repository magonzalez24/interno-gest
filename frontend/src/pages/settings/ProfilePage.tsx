import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { ATLASSIAN_LINK } from '@/const/Links/Atlassian';
import { useNavigate } from 'react-router-dom';

export const ProfilePage = () => {
  const { user } = useAuth();


  const navigate = useNavigate();

  const getInitials = () => {
    if (user?.employee?.name) {
      return user.employee.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email[0].toUpperCase() || 'U';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona tu información personal
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{user?.employee?.name || user?.email}</CardTitle>
              <p className="text-muted-foreground">{user?.employee?.position || user?.role}</p>
            </div>
          </div>
            <div>
              <Button variant="outline" onClick={() => window.open(ATLASSIAN_LINK, '_blank')}>
                <Pencil className="h-4 w-4" />
                Vincular Jira
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-1">{user?.email}</p>
          </div>
          {user?.employee && (
            <>
              <div>
                <p className="text-sm text-muted-foreground">Sede</p>
                <p className="mt-1">{user.employee.office?.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Departamento</p>
                <p className="mt-1">{user.employee.department?.name || 'Sin departamento'}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

