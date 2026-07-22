import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { EmptyState } from '../ui/EmptyState';
import { VideoPlayer } from '../ui/VideoPlayer';
import { CommentSection } from '../ui/CommentSection';
import { contentsApi } from '../api/contents';

export default function Streaming() {
  const { contentId } = useParams();
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const loadContent = async () => {
      try {
        const response = await contentsApi.getById(contentId);
        setContent(response.data);
        const releaseDate = new Date(response.data.eventDate);
        setIsAvailable(new Date() >= releaseDate);
      } catch (error) {
        setContent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, [contentId]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-10">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState
          title="Conteúdo não encontrado"
          description="Não foi possível localizar o conteúdo solicitado."
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{content.title}</h1>
          <p className="text-sm text-muted mt-2">{content.description}</p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-text hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <Card className="space-y-6">
          <CardHeader>
            <CardTitle>Streaming do Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            {isAvailable ? (
              <VideoPlayer src={content.videoUrl || content.video || content.streamUrl} poster={content.coverUrl || content.poster || content.imageUrl} />
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-surface p-10 text-center">
                <p className="text-xl font-semibold">Streaming disponível em:</p>
                <p className="mt-2 text-lg text-muted">{new Date(content.eventDate).toLocaleString('pt-PT')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-6">
            <CardHeader>
              <CardTitle>Detalhes do Conteúdo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p><strong>Data:</strong> {new Date(content.eventDate).toLocaleString('pt-PT')}</p>
              <p><strong>Local:</strong> {content.eventLocation}</p>
              <p><strong>Categoria:</strong> {content.category}</p>
            </CardContent>
          </Card>

          <CommentSection contentId={contentId} />
        </div>
      </div>
    </div>
  );
}
