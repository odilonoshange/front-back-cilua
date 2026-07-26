import { Film, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-white/10 bg-surface">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-[0.05] afro-grid" />
      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Link to="/" className="group mb-5 flex w-fit items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center bg-accent text-background transition group-hover:rotate-45">
                <Film size={21} className="transition group-hover:-rotate-45" />
              </span>
              <span className="font-display text-xl font-black tracking-[-0.04em] text-white">
                Cine <span className="text-accent">Teatro</span>
              </span>
            </Link>
            <p className="max-w-md text-sm leading-6 text-muted">
              Um espaço dedicado ao cinema e ao teatro angolano. Descubra obras, conheça os seus criadores e acompanhe histórias que nascem em Angola.
            </p>
            <div className="mt-6 flex gap-2">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="flex h-9 w-9 items-center justify-center border border-white/10 text-muted transition hover:border-accent/50 hover:bg-accent hover:text-background" aria-label="Rede social">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent">Explorar</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><Link to="/explorar" className="transition hover:text-white">Catálogo</Link></li>
              <li><Link to="/registar-estudio" className="transition hover:text-white">Para produtores</Link></li>
              <li><a href="#" className="transition hover:text-white">Sobre o projeto</a></li>
              <li><a href="#" className="transition hover:text-white">Contactos</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-accent">Informação</h4>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#" className="transition hover:text-white">Termos de uso</a></li>
              <li><a href="#" className="transition hover:text-white">Privacidade</a></li>
              <li><a href="#" className="transition hover:text-white">Cookies</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Cine Teatro. Todos os direitos reservados.</p>
          <p>Luanda · Angola</p>
        </div>
      </div>
    </footer>
  );
};
