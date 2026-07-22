import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../hooks/useAuth';
import { isProducerRole } from '../constants/enums';

export default function Login() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const identifierPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const from = location.state?.from?.pathname || null;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await login(data);
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      const role = response?.user?.role;
      navigate(isProducerRole(role) ? '/painel' : '/perfil', { replace: true });
    } catch (error) {
      console.error('Erro ao iniciar sessão.', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Entrar no Cine Teatro</CardTitle>
          <p className="text-sm text-muted mt-2">Bem-vindo de volta! Insira os seus dados.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Email ou Nome de Utilizador"
              type="text"
              placeholder="admin ou root"
              error={errors.email?.message}
              {...register('email', { 
                required: 'O email ou utilizador é obrigatório',
                validate: (value) => {
                  const normalized = value?.toLowerCase?.();
                  if (normalized === 'admin' || normalized === 'root') {
                    return true;
                  }
                  return identifierPattern.test(value) || 'Endereço de email inválido';
                },
              })}
            />
            <Input
              label="Palavra-passe"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { 
                required: 'A palavra-passe é obrigatória' 
              })}
            />
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">Esqueceu a palavra-passe?</a>
            </div>
            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/5 mt-2">
          <p className="text-sm text-muted">
            Não tem uma conta? <Link to="/registar" className="text-primary hover:underline">Registe-se</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
