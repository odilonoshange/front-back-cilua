import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock3, Film, MapPin, Play, Theater } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { VideoPlayer } from '../ui/VideoPlayer';
import { CommentSection } from '../ui/CommentSection';
import { contentsApi } from '../api/contents';

const formatDate = (value) => { if (!value) return 'Data não definida'; const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Data não definida' : date.toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' }); };

export default function Streaming() {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => { const loadContent = async () => { try { const response = await contentsApi.getById(contentId); const data = response.data; setContent(data); const releaseDate = data.eventDate ? new Date(data.eventDate) : null; setIsAvailable(releaseDate ? new Date() >= releaseDate : Boolean(data.videoUrl || data.video)); } catch { setContent(null); } finally { setIsLoading(false); } }; loadContent(); }, [contentId]);
  if (isLoading) return <div className="flex min-h-[70vh] items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-accent border-t-transparent" /></div>;
  if (!content) return <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12"><EmptyState title="Obra não encontrada" description="Não foi possível localizar a obra solicitada." /></div>;

  const type = String(content.typeContent || content.type_content || '').toUpperCase(); const isTheater = type === 'THEATER'; const videoUrl = content.videoUrl || content.video || content.streamUrl; const poster = content.coverUrl || content.poster || content.imageUrl;

  return <div className="relative min-h-screen overflow-hidden"><div className="pointer-events-none absolute right-0 top-0 h-[650px] w-[45%] opacity-[0.04] afro-grid text-accent" /><main className="relative mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
    <Link to="/explorar" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-accent"><ArrowLeft size={17} /> Voltar ao catálogo</Link>
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.55fr)] lg:items-start">
      <div className="relative overflow-hidden border border-white/10 bg-black"><div className="absolute left-5 top-5 z-10 flex gap-2"><span className="flex items-center gap-2 bg-accent px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-background">{isTheater ? <Theater size={13} /> : <Film size={13} />}{isTheater ? 'Teatro' : 'Cinema'}</span>{content.category && <span className="bg-background/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-white">{content.category}</span>}</div><img src={poster} alt={content.title} className="aspect-video w-full object-cover opacity-70" /><div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />{!isAvailable && <div className="absolute inset-0 flex items-center justify-center p-6 text-center"><div className="max-w-md"><Clock3 className="mx-auto mb-4 text-accent" size={32} /><p className="text-xl font-bold text-white sm:text-2xl">Disponível após a data de exibição</p><p className="mt-2 text-sm text-white/60">Esta obra estará disponível para exibição online a partir de {formatDate(content.eventDate)}.</p></div></div>}{isAvailable && videoUrl && <div className="absolute inset-x-5 bottom-5"><div className="flex items-center gap-3 text-sm font-semibold text-white"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-background"><Play size={15} fill="currentColor" /></span>Exibição disponível</div></div>}</div>
      <div className="lg:sticky lg:top-24"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">{isTheater ? 'Produção teatral' : 'Produção cinematográfica'}</p><h1 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl">{content.title}</h1><p className="mt-6 text-base leading-7 text-muted">{content.description || 'Sem descrição disponível para esta obra.'}</p><div className="mt-8 space-y-4 border-y border-white/10 py-6">{content.eventDate && <div className="flex items-start gap-3"><Calendar size={18} className="mt-0.5 shrink-0 text-accent" /><div><p className="text-xs uppercase tracking-wider text-muted">Data de exibição</p><p className="mt-1 text-sm font-semibold">{formatDate(content.eventDate)}</p></div></div>}{content.eventLocation && <div className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-accent" /><div><p className="text-xs uppercase tracking-wider text-muted">Local</p><p className="mt-1 text-sm font-semibold">{content.eventLocation}</p></div></div>}{content.category && <div className="flex items-start gap-3"><Film size={18} className="mt-0.5 shrink-0 text-accent" /><div><p className="text-xs uppercase tracking-wider text-muted">Categoria</p><p className="mt-1 text-sm font-semibold">{content.category}</p></div></div>}</div></div>
    </section>
    {isAvailable && videoUrl && <section className="mt-10"><div className="mb-5 flex items-center gap-3"><span className="h-px w-8 bg-accent" /><h2 className="text-xl font-bold">Exibição online</h2></div><Card className="bg-black"><CardContent className="p-0"><VideoPlayer src={videoUrl} poster={poster} /></CardContent></Card></section>}
    {content.details && <section className="mt-12 max-w-4xl border-t border-white/10 pt-10"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Sobre a obra</p><h2 className="text-2xl font-black">Detalhes da produção</h2><p className="mt-5 whitespace-pre-line text-base leading-8 text-muted">{content.details}</p></section>}
    <section className="mt-12 max-w-3xl border-t border-white/10 pt-10"><p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-accent">Comunidade</p><h2 className="mb-6 text-2xl font-black">Comentários</h2><CommentSection contentId={contentId} /></section>
  </main></div>;
}
