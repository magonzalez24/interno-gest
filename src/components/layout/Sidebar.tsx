import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Users, 
  Building2, 
  Code, 
  Settings,
  Home,
  BarChart3,
  UserCog,
  Clock,
  Receipt,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';

import logo from '@/assets/images/excelia.jpg';
import { useTranslation } from 'react-i18next';

interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { title: 'sidebar.home', href: '/', icon: Home },
  { title: 'sidebar.dashboard', href: '/dashboard', icon: LayoutDashboard, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'sidebar.projects', href: '/projects', icon: FolderKanban },
  { title: 'sidebar.timeEntries', href: '/time-entries', icon: Clock },
  { title: 'sidebar.billing', href: '/billing', icon: Receipt },
  { title: 'sidebar.employees', href: '/employees', icon: Users, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'sidebar.departments', href: '/departments', icon: Building2, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'sidebar.technologies', href: '/technologies', icon: Code },
  { title: 'sidebar.reports', href: '/reports', icon: BarChart3, roles: [UserRole.MANAGER, UserRole.DIRECTOR] },
  { title: 'sidebar.offices', href: '/offices', icon: Building2, roles: [UserRole.DIRECTOR] },
  { title: 'sidebar.users', href: '/users', icon: UserCog, roles: [UserRole.DIRECTOR] },
  { title: 'sidebar.settings', href: '/settings', icon: Settings },
];

export const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useTranslation();

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="flex h-16 items-center border-b justify-center px-6">
        <div className="text-xl font-bold text-primary"><img src={logo} alt="Excelia" className="h-12" /></div>
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
              {t(item.title)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

