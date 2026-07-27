import { EmptyState } from '../ui/EmptyState';
import { User } from 'lucide-react';

export default function Profile() {
  return <div className="relative min-h-screen overflow-hidden"><div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[40%] opacity-[0.035] afro-pattern text-accent" /><main className="relative mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14"><div className="mb-10 border-b border-white/10 pb-8"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Conta pessoal</p><h1 className="text-4xl font-black tracking-[-0.04em]">O meu perfil</h1><p className="mt-3 text-sm text-muted">Consulte e gira as informações da sua conta.</p></div><EmptyState icon={User} title="Área pessoal" description="A gestão dos seus dados de perfil estará disponível aqui." /></main></div>;
}
