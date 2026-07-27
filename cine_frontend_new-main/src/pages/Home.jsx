import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star } from 'lucide-react';
import { Button } from '../ui/Button';

const featured = [
  { title: 'Histórias que ficam', type: 'FILME', category: 'Drama', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1200&auto=format&fit=crop' },
  { title: 'No palco de Luanda', type: 'TEATRO', category: 'Teatro', image: 'https://images.unsplash.com/photo-1503095396549-807759245b35?q=80&w=800&auto=format&fit=crop' },
  { title: 'Vozes de Angola', type: 'DOCUMENTÁRIO', category: 'Documentário', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop' },
  { title: 'Entre cenas', type: 'FILME', category: 'Comédia', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=800&auto=format&fit=crop' },
];

const categories = ['Drama', 'Comédia', 'Ação', 'Documentário', 'Teatro Clássico', 'Stand-up'];

export default function Home() {
  return (
    <div className="min-h-screen overflow-hidden">
      <section className="relative min-h-[78vh] border-b border-white/10">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=85&w=2200&auto=format&fit=crop" alt="Sala de cinema" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
          <div className="absolute inset-0 opacity-[0.08] afro-grid text-accent" />
        </div>
        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-5 pb-20 pt-32 sm:px-8 lg:px-12">
          <div className="max-w-3xl">
            <div className="mb-7 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-accent"><span className="h-px w-10 bg-accent" /> Cinema · Teatro · Angola</div>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-8xl">Histórias nossas.<br /><span className="text-accent">Palcos nossos.</span></h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">Um espaço dedicado ao cinema e ao teatro angolano. Descubra obras, conheça quem as cria e acompanhe as histórias que ganham vida dentro e fora do palco.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/explorar"><Button size="lg" className="w-full gap-2 sm:w-auto">Explorar catálogo <ArrowRight size={18} /></Button></Link>
              <Link to="/explorar"><Button variant="secondary" size="lg" className="w-full sm:w-auto">Ver em exibição</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Agora em destaque</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Obras para descobrir</h2></div><Link to="/explorar" className="hidden items-center gap-2 text-sm font-semibold text-muted transition-colors hover:text-accent sm:flex">Ver catálogo <ArrowRight size={16} /></Link></div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {featured.map((item) => (
            <Link to="/explorar" key={item.title} className="group relative overflow-hidden border border-white/10 bg-surface">
              <div className="aspect-[2/3] overflow-hidden"><img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5"><span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">{item.type}</span><h3 className="mt-1 text-lg font-bold text-white sm:text-xl">{item.title}</h3><p className="mt-1 text-xs text-white/60">{item.category}</p></div>
            </Link>
          ))}
        </div>
      </section>

      <section className="relative border-y border-white/10 bg-surface/40 py-20">
        <div className="absolute inset-y-0 right-0 w-1/3 opacity-[0.06] afro-pattern text-accent" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mb-10 max-w-2xl"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Exibição online</p><h2 className="text-3xl font-black tracking-tight sm:text-4xl">Quando a cortina sobe, a história continua.</h2><p className="mt-4 text-muted">Acompanhe as obras disponíveis para exibição online depois da sua estreia ou apresentação.</p></div>
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Link to="/explorar" key={i} className="group"><div className="relative aspect-video overflow-hidden border border-white/10 bg-surface"><img src={`https://images.unsplash.com/photo-${i === 1 ? '1485846234645-a62644f84728' : i === 2 ? '1503095396549-807759245b35' : '1517604931442-7e0c8ed2963c'}?q=80&w=900&auto=format&fit=crop`} alt="Produção audiovisual" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent text-black"><Play size={22} fill="currentColor" /></span></div></div><div className="mt-4 flex items-start justify-between gap-4"><div><h3 className="font-bold">Produção Angolana {i}</h3><p className="mt-1 text-sm text-muted">Filme · Angola</p></div><span className="flex items-center gap-1 text-sm text-muted"><Star size={14} /> 4.8</span></div></Link>
            ))}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12">
        <div className="absolute left-0 top-0 h-full w-1/2 opacity-[0.04] afro-grid text-accent" />
        <div className="relative"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Explore por linguagem</p><h2 className="mb-10 text-3xl font-black tracking-tight sm:text-4xl">Encontre a sua próxima história</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">{categories.map((category) => <Link key={category} to={`/explorar?categoria=${encodeURIComponent(category)}`} className="group relative flex min-h-28 items-end overflow-hidden border border-white/10 bg-surface p-4 transition hover:border-accent/60 hover:bg-accent hover:text-black"><span className="text-sm font-bold transition-transform group-hover:-translate-y-1">{category}</span></Link>)}</div></div>
      </section>
    </div>
  );
}
