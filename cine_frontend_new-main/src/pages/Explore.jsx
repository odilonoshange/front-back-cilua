import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { EmptyState } from '../ui/EmptyState';
import { Button } from '../ui/Button';
import { Compass, Calendar, MapPin, Search, Film, Theater, ArrowRight, Play } from 'lucide-react';
import { contentsApi } from '../api/contents';
import { useAuth } from '../hooks/useAuth';
import { isProducerRole } from '../constants/enums';

const CATEGORY_OPTIONS = ['Todos', 'Drama', 'Comédia', 'Ação', 'Documentário', 'Teatro Clássico', 'Stand-up'];
const TYPE_OPTIONS = ['Todos', 'FILM', 'THEATER'];

const formatDate = (value) => {
  if (!value) return 'Data não definida';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Data não definida' : date.toLocaleDateString('pt-PT');
};

export default function Explore() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const selectedCategory = searchParams.get('categoria') || 'Todos';
  const selectedType = searchParams.get('tipo') || 'Todos';

  useEffect(() => {
    const loadContents = async () => {
      setLoading(true);
      try {
        const response = await contentsApi.getAll();
        setContents(response.data?.contents ?? response.data ?? []);
      } catch (error) {
        setContents([]);
      } finally {
        setLoading(false);
      }
    };

    loadContents();
  }, []);

  const filteredContents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return contents.filter((content) => {
      const category = String(content.category || '').trim();
      const type = String(content.typeContent || content.type_content || '').toUpperCase();
      const searchable = `${content.title || ''} ${content.description || ''} ${category}`.toLowerCase();

      return (
        (selectedCategory === 'Todos' || category.toLowerCase() === selectedCategory.toLowerCase()) &&
        (selectedType === 'Todos' || type === selectedType) &&
        (!normalizedQuery || searchable.includes(normalizedQuery))
      );
    });
  }, [contents, query, selectedCategory, selectedType]);

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'Todos') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[45%] opacity-[0.045] afro-grid" />

      <main className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <header className="mb-10 border-b border-white/10 pb-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">
                <span className="h-px w-8 bg-accent" />
                Arquivo audiovisual
              </div>
              <h1 className="max-w-3xl text-4xl font-black leading-none tracking-[-0.04em] sm:text-6xl">
                Cinema e teatro<br /><span className="text-accent">para descobrir.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-muted">
                Explore produções, espetáculos e histórias angolanas reunidas num só espaço.
              </p>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={19} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquisar por título, género..."
                className="h-14 w-full border border-white/10 bg-surface pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-muted focus:border-accent/60"
              />
            </div>
          </div>
        </header>

        <section className="mb-10 space-y-5">
          <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  onClick={() => updateFilter('tipo', type)}
                  className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] transition ${selectedType === type ? 'bg-accent text-background' : 'border border-white/10 bg-surface text-muted hover:border-accent/40 hover:text-white'}`}
                >
                  {type === 'FILM' && <Film size={14} />}
                  {type === 'THEATER' && <Theater size={14} />}
                  {type === 'Todos' ? 'Tudo' : type === 'FILM' ? 'Cinema' : 'Teatro'}
                </button>
              ))}
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-muted">
              {filteredContents.length} {filteredContents.length === 1 ? 'obra' : 'obras'} encontradas
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORY_OPTIONS.map((category) => (
              <button
                key={category}
                onClick={() => updateFilter('categoria', category)}
                className={`whitespace-nowrap border px-4 py-2 text-sm transition ${selectedCategory === category ? 'border-accent bg-accent/10 text-accent' : 'border-white/10 text-muted hover:border-white/25 hover:text-white'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {isProducerRole(user?.role) && (
          <div className="mb-10 flex items-center justify-between border border-accent/20 bg-accent/[0.04] p-5">
            <div>
              <p className="text-sm font-bold">Tem uma produção para apresentar?</p>
              <p className="mt-1 text-xs text-muted">Adicione uma nova obra ao catálogo.</p>
            </div>
            <Link to="/painel/publicar"><Button variant="secondary" size="sm">Publicar <ArrowRight size={15} /></Button></Link>
          </div>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => <div key={item} className="aspect-[3/4] animate-pulse bg-surface" />)}
          </div>
        ) : filteredContents.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nenhuma obra encontrada"
            description={query || selectedCategory !== 'Todos' || selectedType !== 'Todos' ? 'Tente alterar a pesquisa ou os filtros selecionados.' : 'Ainda não há conteúdos disponíveis no catálogo.'}
          />
        ) : (
          <div className="grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredContents.map((content) => {
              const id = content.id || content._id || content.contentId;
              const eventDate = content.eventDate || content.event_date;
              const isAvailable = eventDate ? new Date() >= new Date(eventDate) : Boolean(content.videoUrl || content.video_url);
              const type = String(content.typeContent || content.type_content || '').toUpperCase();

              return (
                <article key={id} className="group min-w-0">
                  <Link to={`/streaming/${id}`} className="relative block aspect-[3/4] overflow-hidden bg-surface">
                    <img
                      src={content.coverUrl || content.cover?.url || `https://via.placeholder.com/600x800?text=${encodeURIComponent(content.title || 'Conteúdo')}`}
                      alt={content.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80" />
                    <div className="absolute left-4 top-4 flex gap-2">
                      <span className="bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                        {type === 'THEATER' ? 'Teatro' : 'Cinema'}
                      </span>
                    </div>
                    {isAvailable && (
                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-background opacity-0 transition group-hover:opacity-100">
                        <Play size={16} fill="currentColor" />
                      </span>
                    )}
                  </Link>

                  <div className="pt-4">
                    <div className="mb-2 flex items-center justify-between gap-3 text-[10px] font-bold uppercase tracking-[0.15em] text-accent">
                      <span>{content.category || 'Sem categoria'}</span>
                      {eventDate && <span className="flex items-center gap-1 text-muted"><Calendar size={11} /> {formatDate(eventDate)}</span>}
                    </div>
                    <Link to={`/streaming/${id}`}>
                      <h2 className="line-clamp-1 text-lg font-bold text-white transition group-hover:text-accent">{content.title}</h2>
                    </Link>
                    {content.eventLocation && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted"><MapPin size={12} /> {content.eventLocation}</p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Link to={`/streaming/${id}`} className="flex-1"><Button size="sm" className="w-full">{isAvailable ? 'Assistir' : 'Ver detalhes'}</Button></Link>
                      {isProducerRole(user?.role) && <Link to={`/painel/publicar/${id}`}><Button variant="outline" size="sm">Editar</Button></Link>}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
