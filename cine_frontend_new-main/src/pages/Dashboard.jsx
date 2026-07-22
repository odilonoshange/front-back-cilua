import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState } from '../ui/EmptyState';
import { LayoutDashboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { contentsApi } from '../api/contents';
import { useAuth } from '../hooks/useAuth';
import { USER_TYPE, isProducerRole, CONTENT_STATUS, CONTENT_STATUS_LABELS } from '../constants/enums';

export default function Dashboard() {
  const { user } = useAuth();

  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState('');

  useEffect(() => {
    loadContents();
  }, [user?.id]);

  const loadContents = async () => {
    setLoading(true);
    try {
      // O estúdio vê as suas próprias publicações em qualquer estado
      // (pendente/aprovado/rejeitado); o espectador só vê o catálogo
      // já aprovado (é o que o backend devolve em /contents).
      const response = isProducerRole(user?.role) && user?.id
        ? await contentsApi.getMine(user.id)
        : await contentsApi.getAll();
      setContents(response.data?.contents ?? response.data ?? []);
    } catch (error) {
      console.error('Não foi possível carregar conteúdos.', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem a certeza que pretende eliminar esta publicação?')) return;
    setDeleting(id);
    try {
      await contentsApi.delete(id);
      setContents((prev) => prev.filter((e) => e.id !== id && e._id !== id));
    } catch (error) {
      console.error('Erro ao excluir a publicação.', error);
    } finally {
      setDeleting('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel do Estúdio</h1>
          <p className="text-sm text-muted mt-2">Gerencie seus conteúdos e uploads de streaming a partir daqui.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {isProducerRole(user?.role) && (
            <>
              <Link to="/painel/publicar">
                <Button variant="primary">Publicar Conteúdo</Button>
              </Link>
              <Link to="/painel/publicar-video">
                <Button variant="secondary">Upload de Vídeo</Button>
              </Link>
            </>
          )}
        </div>
      </div>
      {isProducerRole(user?.role) ? (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">As suas publicações</h2>
          {loading ? (
            <div className="text-sm text-muted">A carregar conteúdos...</div>
          ) : contents.length === 0 ? (
            <EmptyState
              icon={LayoutDashboard}
              title="Sem publicações"
              description="Ainda não publicou conteúdos. Utilize o botão de Publicar para criar o primeiro."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contents.map((content) => {
                const id = content.id || content._id || content.contentId;
                return (
                  <div key={id} className="rounded-lg border border-white/5 bg-surface p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="h-20 w-32 overflow-hidden rounded-md bg-white/5">
                        <img
                          src={content.coverUrl || content.poster?.url || `https://via.placeholder.com/320x200?text=${encodeURIComponent(content.title || 'Sem+imagem')}`}
                          alt={content.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{content.title}</h3>
                        <p className="text-sm text-muted">{content.eventDate ? new Date(content.eventDate).toLocaleString() : 'Data não definida'}</p>
                        {content.status && (
                          <span
                            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                              content.status === CONTENT_STATUS.APPROVED
                                ? 'bg-green-500/15 text-green-400'
                                : content.status === CONTENT_STATUS.REJECTED
                                ? 'bg-red-500/15 text-red-400'
                                : 'bg-yellow-500/15 text-yellow-400'
                            }`}
                          >
                            {CONTENT_STATUS_LABELS[content.status] || content.status}
                          </span>
                        )}
                        {content.status === CONTENT_STATUS.REJECTED && content.rejectionReason && (
                          <p className="mt-1 text-xs text-red-400">Motivo: {content.rejectionReason}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link to={`/painel/publicar/${id}`}>
                        <Button size="sm">Editar</Button>
                      </Link>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(id)} disabled={deleting === id}>
                        {deleting === id ? 'A eliminar...' : 'Excluir'}
                      </Button>
                      <Link to={`/painel/publicar-video/${id}`} className="ml-auto">
                        <Button size="sm" variant="ghost">Upload Vídeo</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold">Conteúdos disponíveis</h2>
          <p className="mb-6 text-sm text-muted">Veja abaixo os conteúdos publicados na plataforma. Pode aceder ao streaming sempre que estiver disponível.</p>
          {loading ? (
            <div className="text-sm text-muted">A carregar conteúdos...</div>
          ) : contents.length === 0 ? (
            <EmptyState
              icon={LayoutDashboard}
              title="Nenhum conteúdo disponível"
              description="Ainda não há conteúdos publicados. Verifique novamente mais tarde."
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contents.map((content) => {
                const id = content.id || content._id || content.contentId;
                const isAvailable = new Date() >= new Date(content.eventDate);
                return (
                  <div key={id} className="rounded-lg border border-white/5 bg-surface p-4">
                    <div className="mb-3 flex items-start gap-3">
                      <div className="h-20 w-32 overflow-hidden rounded-md bg-white/5">
                        <img
                          src={content.coverUrl || content.poster?.url || `https://via.placeholder.com/320x200?text=${encodeURIComponent(content.title || 'Sem+imagem')}`}
                          alt={content.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold">{content.title}</h3>
                        <p className="text-sm text-muted">{content.eventDate ? new Date(content.eventDate).toLocaleString() : 'Data não definida'}</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>{content.category}</span>
                      </div>
                      <Link to={`/streaming/${id}`}>
                        <Button className="w-full">{isAvailable ? 'Assistir' : 'Ver detalhes'}</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
