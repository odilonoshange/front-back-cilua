import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Film, ArrowRight } from 'lucide-react';
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
  const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: { email: '', password: '' } });
  const from = location.state?.from?.pathname || null;

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await login(data);
      if (from) return navigate(from, { replace: true });
      navigate(isProducerRole(response?.user?.role) ? '/painel' : '/perfil', { replace: true });
    } catch (error) {
      console.error('Erro ao iniciar sessão.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-12 sm:px-8">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-1/2 opacity-[0.04] afro-grid" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-accent text-background"><Film size={27} /></div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">Cine Teatro</p>
          <h1 className="text-3xl font-black tracking-tight">Entrar na plataforma</h1>
          <p className="mt-3 text-sm text-muted">Aceda ao seu espaço e continue a descobrir histórias.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-xl">A sua conta</CardTitle></CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <Input label="Email" type="email" placeholder="nome@exemplo.com" error={errors.email?.message} {...register('email', { required: 'O email é obrigatório', validate: (value) => identifierPattern.test(value) || 'Endereço de email inválido' })} />
              <Input label="Palavra-passe" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'A palavra-passe é obrigatória' })} />
              <div className="text-right"><a href="#" className="text-xs font-semibold text-accent hover:underline">Esqueceu a palavra-passe?</a></div>
              <Button type="submit" className="w-full gap-2" isLoading={isSubmitting}>Entrar <ArrowRight size={17} /></Button>
            </form>
          </CardContent>
          <CardFooter className="justify-center border-t border-white/10">
            <p className="text-sm text-muted">Ainda não tem uma conta? <Link to="/registar" className="font-semibold text-accent hover:underline">Registe-se</Link></p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
