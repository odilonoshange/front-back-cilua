import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Film, ArrowRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });
  const password = watch('password');

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    try {
      await registerUser({ name: data.name, email: data.email, password: data.password });
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao criar conta.', error);
      const message = error?.response?.data?.message || '';
      setSubmitError(message.includes('Duplicate entry') || message.includes('uk_users_email')
        ? 'Este e-mail já está registado. Por favor, utilize outro e-mail ou faça login.'
        : (message || 'Não foi possível criar a conta. Tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return <div className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-5 py-12 sm:px-8"><div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-[0.035] afro-grid text-accent" /><div className="relative w-full max-w-md"><div className="mb-8 text-center"><div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center bg-accent text-background"><Film size={27} /></div><p className="mb-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">Cine Teatro</p><h1 className="text-3xl font-black tracking-tight">Criar uma conta</h1><p className="mt-3 text-sm text-muted">Faça parte do espaço dedicado às histórias de Angola.</p></div><Card><CardHeader><CardTitle className="text-xl">Os seus dados</CardTitle></CardHeader><CardContent>{submitError && <div className="mb-5 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">{submitError}</div>}<form className="space-y-5" onSubmit={handleSubmit(onSubmit)}><Input label="Nome completo" placeholder="O seu nome" error={errors.name?.message} {...register('name', { required: 'O nome é obrigatório' })} /><Input label="Email" type="email" placeholder="nome@exemplo.com" error={errors.email?.message} {...register('email', { required: 'O email é obrigatório', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Endereço de email inválido' } })} /><Input label="Palavra-passe" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password', { required: 'A palavra-passe é obrigatória', minLength: { value: 6, message: 'Mínimo 6 caracteres' } })} /><Input label="Confirmar palavra-passe" type="password" placeholder="••••••••" error={errors.confirmPassword?.message} {...register('confirmPassword', { required: 'Confirmação obrigatória', validate: value => value === password || 'As palavras-passe não coincidem' })} /><Button type="submit" className="w-full gap-2" isLoading={isSubmitting}>Criar conta <ArrowRight size={17} /></Button></form></CardContent><CardFooter className="flex-col gap-4 border-t border-white/10"><p className="text-sm text-muted">Já tem uma conta? <Link to="/entrar" className="font-semibold text-accent hover:underline">Entrar</Link></p><Link to="/registar-estudio" className="text-xs font-semibold text-muted transition hover:text-accent">É um estúdio ou produtor? Registe-se aqui.</Link></CardFooter></Card></div></div>;
}