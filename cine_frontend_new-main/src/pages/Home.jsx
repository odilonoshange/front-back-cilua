import { Link } from 'react-router-dom';
import { Play, Calendar, Star, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 cinematic-gradient" />
        </div>
        
        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-4 pb-24 md:pb-32">
          <span className="mb-4 inline-block rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary backdrop-blur-md">
            Em Destaque
          </span>
          <h1 className="mb-4 max-w-3xl text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
            A Magia do Cinema e Teatro Angolano
          </h1>
          <p className="mb-8 max-w-2xl text-lg text-white/80 md:text-xl">
            Descubra as melhores produções de Luanda. Assista a filmes e espetáculos de teatro e apoie a cultura nacional.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="gap-2">
              <Play size={20} fill="currentColor" /> Assistir Agora
            </Button>
            <Link to="/explorar">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Explorar Catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Conteúdos em destaque */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Conteúdos em Destaque</h2>
          <Link to="/explorar" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver todos <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group relative overflow-hidden rounded-lg bg-surface transition-transform hover:-translate-y-1">
              <div className="aspect-[2/3] w-full bg-surface/50 overflow-hidden">
                <img 
                  src={`https://images.unsplash.com/photo-1514306191717-452ec28c7814?q=80&w=400&h=600&auto=format&fit=crop&random=${i}`} 
                  alt="Cartaz" 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            </div>
          ))}
        </div>
      </section>

      {/* Streaming Disponível */}
      <section className="bg-surface/30 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-2xl font-bold md:text-3xl">Streaming Disponível</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer overflow-hidden rounded-lg">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-surface/50">
                  <img 
                    src={`https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=600&h=338&auto=format&fit=crop&random=${i}`} 
                    alt="Cena" 
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="rounded-full bg-primary p-3 text-white">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Produção Angolana {i}</h3>
                <div className="mt-2 flex items-center gap-4 text-sm text-muted">
                  <span className="flex items-center gap-1"><Star size={14} className="text-yellow-500" /> 4.8</span>
                  <span>Filme</span>
                  <span>1h 45m</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categorias */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-8 text-2xl font-bold md:text-3xl">Categorias</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {['Drama', 'Comédia', 'Ação', 'Documentário', 'Teatro Clássico', 'Stand-up'].map((cat, i) => (
            <Link key={i} to={`/explorar?categoria=${cat}`} className="flex h-24 items-center justify-center rounded-lg border border-white/10 bg-surface/50 px-4 text-center font-medium transition-colors hover:bg-white/10 hover:text-white text-muted">
              {cat}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
