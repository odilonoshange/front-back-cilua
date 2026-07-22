import { Link } from 'react-router-dom';
import { Film, User, Menu, Search, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../ui/Button';
import { USER_TYPE, isProducerRole } from '../constants/enums';

export const Navbar = ({ onMenuClick }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <button 
            className="block lg:hidden text-white/70 hover:text-white"
            onClick={onMenuClick}
          >
            <Menu size={24} />
          </button>
          
          <Link to="/" className="flex items-center gap-2 text-primary">
            <Film size={28} />
            <span className="font-display text-xl font-bold tracking-tight text-white hidden sm:block">
              Cine <span className="text-primary">Teatro</span>
            </span>
          </Link>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-white/70">
            <Link to="/" className="hover:text-white transition-colors">Início</Link>
            <Link to="/explorar" className="hover:text-white transition-colors">Explorar</Link>
            {isAuthenticated && isProducerRole(user?.role) && (
              <Link to="/painel/publicar" className="hover:text-white transition-colors">Publicar</Link>
            )}
            {isAuthenticated && isProducerRole(user?.role) && (
              <Link to="/painel/publicar-video" className="hover:text-white transition-colors">Upload</Link>
            )}
            {isAuthenticated && user?.role === USER_TYPE.ADMIN && (
              <Link to="/admin" className="hover:text-white transition-colors">Administração</Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="text-white/70 hover:text-white transition-colors">
            <Search size={20} />
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link to={isProducerRole(user?.role) ? '/painel' : '/perfil'} className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface border border-white/10">
                  <User size={16} />
                </div>
                <span className="hidden sm:block">{user?.name}</span>
              </Link>
              <button 
                onClick={logout}
                className="text-muted hover:text-red-500 transition-colors"
                title="Sair"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/entrar">
                <Button variant="ghost" size="sm">Entrar</Button>
              </Link>
              <Link to="/registar">
                <Button size="sm">Registar</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
