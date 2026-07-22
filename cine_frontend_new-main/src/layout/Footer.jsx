import { Film, Instagram, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-surface/50 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-primary mb-4">
              <Film size={28} />
              <span className="font-display text-xl font-bold tracking-tight text-white">
                Cine <span className="text-primary">Teatro</span>
              </span>
            </Link>
            <p className="text-sm text-muted max-w-sm mb-6">
              A principal plataforma para exibição e divulgação de conteúdos cinematográficos e teatrais angolanos em Luanda.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-muted hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-muted hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link to="/explorar" className="hover:text-white transition-colors">Explorar Catálogo</Link></li>
              <li><Link to="/registar-estudio" className="hover:text-white transition-colors">Para Estúdios</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contactos</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted">
          <p>&copy; {new Date().getFullYear()} Cine Teatro. Todos os direitos reservados.</p>
          <p className="mt-2 md:mt-0">Feito com ❤️ em Luanda</p>
        </div>
      </div>
    </footer>
  );
};
