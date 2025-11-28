import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Building2, 
  Code, 
  Settings, 
  FileText,
  Home,
  BarChart3,
  UserCog,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'Inicio', href: '/', icon: Home },
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'Proyectos', href: '/projects', icon: FolderKanban },
  { title: 'Imputación', href: '/time-entries', icon: Clock },
  { title: 'Empleados', href: '/employees', icon: Users, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'Departamentos', href: '/departments', icon: Building2, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'Tecnologías', href: '/technologies', icon: Code },
  { title: 'Reportes', href: '/reports', icon: BarChart3, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'Sedes', href: '/offices', icon: Building2, roles: [UserRole.DIRECTOR] },
  { title: 'Usuarios', href: '/users', icon: UserCog, roles: [UserRole.DIRECTOR] },
  { title: 'Configuración', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b px-6">
        <div className="text-xl font-bold text-primary">Excelia</div>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href || 
            (item.href !== '/' && location.pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

