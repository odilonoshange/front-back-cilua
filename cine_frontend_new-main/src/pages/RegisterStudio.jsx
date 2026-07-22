import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function RegisterStudio() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { registerStudio } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      nif: '',
      phone: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerStudio(data);
      // Redirecionar para o painel de estúdio
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao registar estúdio.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4 py-12">
      <Card className="w-full max-w-lg border-primary/20">
        <CardHeader className="text-center">
          <span className="mb-2 mx-auto inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">Conta Estúdio</span>
          <CardTitle>Registo de Produtor/Estúdio</CardTitle>
          <p className="text-sm text-muted mt-2">Publique os seus conteúdos na plataforma.</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Nome da Empresa/Estúdio"
                placeholder="Angola Produções"
                className="col-span-2"
                error={errors.name?.message}
                {...register('name', { required: 'O nome é obrigatório' })}
              />
              <Input
                label="NIF"
                placeholder="000000000"
                error={errors.nif?.message}
                {...register('nif', { 
                  required: 'NIF é obrigatório',
                  minLength: { value: 9, message: 'NIF inválido' }
                })}
              />
              <Input
                label="Telefone"
                placeholder="+244 9XX XXX XXX"
                error={errors.phone?.message}
                {...register('phone', { required: 'Telefone é obrigatório' })}
              />
              <Input
                label="Email Profissional"
                type="email"
                placeholder="contacto@estudio.co.ao"
                className="col-span-2"
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
                className="col-span-2"
                error={errors.password?.message}
                {...register('password', { 
                  required: 'A palavra-passe é obrigatória',
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
                })}
              />
            </div>
            <Button type="submit" className="w-full mt-6" isLoading={isSubmitting}>
              Solicitar Registo
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-white/5 mt-2">
          <p className="text-sm text-muted">
            Já tem uma conta? <Link to="/entrar" className="text-primary hover:underline">Entrar</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
