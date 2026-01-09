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
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/database';
import { useState } from 'react';

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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const handleToggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "flex h-full flex-col border-r bg-background transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex h-16 items-center border-b justify-between px-4">
        {!isCollapsed && (
          <div className="text-xl font-bold text-primary">
            <img src={logo} alt="Excelia" className="h-12" />
          </div>
        )}
        <button
          onClick={handleToggleSidebar}
          className={cn(
            "flex items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors",
            isCollapsed && "mx-auto"
          )}
          aria-label={isCollapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
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
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
              title={isCollapsed ? t(item.title) : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span>{t(item.title)}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

