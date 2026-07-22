import { Link } from 'react-router-dom';
import { X, Home, Compass, User, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../ui/Button';
import { USER_TYPE, isProducerRole } from '../constants/enums';

export const Sidebar = ({ isOpen, onClose }) => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform border-r border-white/10 bg-surface transition-transform duration-300 ease-in-out lg:hidden flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Cine <span className="text-primary">Teatro</span>
          </span>
          <button onClick={onClose} className="text-muted hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-2">
            <Link to="/" onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
              <Home size={20} /> Início
            </Link>
            <Link to="/explorar" onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
              <Compass size={20} /> Explorar
            </Link>
            
            {isAuthenticated && (
              <>
                <div className="my-4 border-t border-white/10" />
                <Link to={isProducerRole(user?.role) ? '/painel' : '/perfil'} onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
                  {isProducerRole(user?.role) ? <LayoutDashboard size={20} /> : <User size={20} />}
                  {isProducerRole(user?.role) ? 'Painel' : 'Perfil'}
                </Link>
                {isProducerRole(user?.role) && (
                  <>
                    <Link to="/painel/publicar" onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
                      <LayoutDashboard size={20} /> Publicar Conteúdo
                    </Link>
                    <Link to="/painel/publicar-video" onClick={onClose} className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/5 hover:text-white">
                      <LayoutDashboard size={20} /> Upload de Vídeo
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>
        </div>
        
        {isAuthenticated ? (
          <div className="border-t border-white/10 p-4">
            <button 
              onClick={() => { logout(); onClose(); }}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-500 hover:bg-white/5"
            >
              <LogOut size={20} /> Sair
            </button>
          </div>
        ) : (
          <div className="border-t border-white/10 p-4 flex flex-col gap-2">
            <Link to="/entrar" onClick={onClose} className="flex w-full items-center justify-center rounded-md border border-white/10 px-4 py-2 text-sm font-medium hover:bg-white/5">
              Entrar
            </Link>
            <Link to="/registar" onClick={onClose} className="flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
              Registar
            </Link>
          </div>
        )}
      </div>
    </>
  );
};
