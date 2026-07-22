import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
      await registerUser(payload);
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao criar conta.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Criar Conta</CardTitle>
          <p className="text-sm text-muted mt-2">Junte-se à maior comunidade cultural de Angola.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Nome Completo"
              placeholder="João Silva"
              error={errors.name?.message}
              {...register('name', { required: 'O nome é obrigatório' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email', { 
                required: 'O email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Endereço de email inválido'
                }
              })}
            />
            <Input
              label="Palavra-passe"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password', { 
                required: 'A palavra-passe é obrigatória',
                minLength: { value: 6, message: 'Mínimo 6 caracteres' }
              })}
            />
            <Input
              label="Confirmar Palavra-passe"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Confirmação obrigatória',
                validate: value => value === password || 'As palavras-passe não coincidem'
              })}
            />
            <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
              Registar
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-4 border-t border-white/5 mt-2">
          <p className="text-sm text-muted text-center">
            Já tem uma conta? <Link to="/entrar" className="text-primary hover:underline">Entrar</Link>
          </p>
          <Link to="/registar-estudio" className="text-sm text-muted hover:text-white transition-colors">
            É um estúdio ou produtor? Registe-se aqui.
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
