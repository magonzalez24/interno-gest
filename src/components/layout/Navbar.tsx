import { Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { OfficeSwitcher } from './OfficeSwitcher';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

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

  const handleChangeLanguage = (lng: 'es' | 'en' | 'pt') => {
    if (i18n.language === lng) {
      return;
    }
    void i18n.changeLanguage(lng);
  };

  return (
    <div className="flex h-16 items-center justify-end border-b bg-background px-6">
      
      <div className="flex items-center gap-4">
        <Select
          value={
            i18n.language.startsWith('es')
              ? 'es'
              : i18n.language.startsWith('en')
              ? 'en'
              : 'pt'
          }
          onValueChange={(value) => handleChangeLanguage(value as 'es' | 'en' | 'pt')}
        >
          <SelectTrigger
            className="w-[130px]"
            aria-label="Selector de idioma"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">ES</SelectItem>
            <SelectItem value="en">EN</SelectItem>
            <SelectItem value="pt">PT</SelectItem>
          </SelectContent>
        </Select>

        <OfficeSwitcher />
        
        <button className="relative rounded-full p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full hover:bg-accent p-2">
              <Avatar>
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.employee?.name || user?.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user?.role}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
                <User className="mr-2 h-4 w-4" />
                {t('navbar.profile')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
                <User className="mr-2 h-4 w-4" />
                {t('navbar.settings')}
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              {t('navbar.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

