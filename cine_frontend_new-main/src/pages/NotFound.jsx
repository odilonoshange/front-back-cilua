import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export default function NotFound() {
  return <div className="relative flex min-h-[70vh] flex-1 flex-col items-center justify-center overflow-hidden p-5 text-center"><div className="pointer-events-none absolute inset-0 opacity-[0.035] afro-grid text-accent" /><div className="relative"><p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-accent">Cine Teatro</p><h1 className="mb-2 font-display text-7xl font-black text-primary">404</h1><h2 className="mb-4 text-2xl font-black">Página não encontrada</h2><p className="mb-8 max-w-md text-muted">A página que tentou acessar não existe ou foi movida.</p><Link to="/"><Button>Voltar ao início</Button></Link></div></div>;
}
