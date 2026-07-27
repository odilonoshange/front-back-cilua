import { Link } from 'react-router-dom';
import { Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../ui/Button';
import { USER_TYPE, isProducerRole } from '../constants/enums';

export const Navbar = ({ onMenuClick }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-7">
          <button
            className="rounded-sm p-2 text-white/70 transition hover:bg-white/5 hover:text-accent lg:hidden"
            onClick={onMenuClick}
            aria-label="Abrir menu"
          >
            <Menu size={22} strokeWidth={1.8} />
          </button>

          <Link to="/" className="group flex items-center">
            <span className="font-display text-[1.65rem] font-black leading-none tracking-[-0.075em] text-white sm:text-[1.9rem]">
              Cine <span className="text-accent">Teatro</span>
            </span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            <Link to="/" className="text-sm font-semibold text-white/70 transition hover:text-accent">Início</Link>
            <Link to="/explorar" className="text-sm font-semibold text-white/70 transition hover:text-accent">Explorar</Link>
            {isAuthenticated && isProducerRole(user?.role) && (
              <Link to="/painel/publicar" className="text-sm font-semibold text-white/70 transition hover:text-accent">Publicar</Link>
            )}
            {isAuthenticated && user?.role === USER_TYPE.ADMIN && (
              <Link to="/admin" className="text-sm font-semibold text-white/70 transition hover:text-accent">Administração</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link to="/explorar" className="rounded-sm p-2 text-white/60 transition hover:bg-white/5 hover:text-accent" aria-label="Pesquisar">
            <Search size={20} strokeWidth={1.8} />
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to={isProducerRole(user?.role) ? '/painel' : '/perfil'} className="group flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-accent/30 bg-surface text-xs font-bold uppercase text-accent transition group-hover:border-accent">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden max-w-32 truncate text-sm font-semibold text-white/80 transition group-hover:text-accent sm:block">{user?.name}</span>
              </Link>
              <button onClick={logout} className="rounded-sm p-2 text-white/40 transition hover:bg-white/5 hover:text-terracotta" title="Sair" aria-label="Sair">
                <LogOut size={19} strokeWidth={1.8} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/entrar"><Button variant="ghost" size="sm">Entrar</Button></Link>
              <Link to="/registar"><Button size="sm">Registar</Button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
