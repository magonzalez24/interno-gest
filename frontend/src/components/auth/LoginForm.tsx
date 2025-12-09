import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../lib/validations';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../ui/use-toast';
import { useTranslation } from 'react-i18next';

type LoginFormValues = {
  email: string;
  password: string;
};

const testUsers = [
  { email: 'director@excelia.com', password: 'password123', role: 'DIRECTOR' },
  { email: 'manager.es@excelia.com', password: 'password123', role: 'MANAGER' },
  { email: 'manager.latam@excelia.com', password: 'password123', role: 'MANAGER' },
  { email: 'juan.perez@excelia.com', password: 'password123', role: 'EMPLOYEE' },
];

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast({
        title: t('auth.loginSuccessTitle'),
        description: t('auth.loginSuccessDescription'),
      });
      navigate('/');
    } catch (error) {
      toast({
        title: t('auth.loginErrorTitle'),
        description:
          error instanceof Error
            ? error.message
            : t('auth.loginErrorDescription'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserClick = (email: string, password: string) => {
    onSubmit({ email, password });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="text-2xl font-bold text-primary">
              {t('app.name')}
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {t('auth.loginTitle')}
          </CardTitle>
          <CardDescription className="text-center">
            {t('auth.loginDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
              />
              {errors.email?.message && (
                <p className="text-sm text-destructive">
                  {String(errors.email.message)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
              />
              {errors.password?.message && (
                <p className="text-sm text-destructive">
                  {String(errors.password.message)}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? t('auth.loggingIn') : t('auth.login')}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              {t('auth.testUsers')}
            </p>
            <div className="space-y-2">
              {testUsers.map((user) => (
                <Button
                  key={user.email}
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => handleTestUserClick(user.email, user.password)}
                  disabled={isLoading}
                >
                  {user.email} ({user.role})
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

