import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { contentsApi } from '../api/contents';
import { uploadsApi } from '../api/uploads';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { CONTENT_TYPE, CONTENT_TYPE_LABELS, DEFAULT_CONTENT_TYPE } from '../constants/enums';

const categories = [
  { value: 'drama', label: 'Drama' },
  { value: 'comedia', label: 'Comédia' },
  { value: 'acao', label: 'Ação' },
  { value: 'aventura', label: 'Aventura' },
  { value: 'documentario', label: 'Documentário' },
  { value: 'animacao', label: 'Animação' },
  { value: 'musical', label: 'Musical' },
  { value: 'experimental', label: 'Experimental' },
];

const defaultValues = {
  title: '',
  typeContent: DEFAULT_CONTENT_TYPE,
  description: '',
  details: '',
  eventDate: '',
  eventLocation: '',
  category: '',
};

export default function Publicar() {
  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingContent, setPendingContent] = useState(null);
  const [loadedContent, setLoadedContent] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();
  const { contentId: paramContentId } = useParams();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const watchTitle = watch('title');
  const watchDescription = watch('description');
  const watchDetails = watch('details');
  const watchEventDate = watch('eventDate');
  const watchEventLocation = watch('eventLocation');
  const watchCategory = watch('category');

  useEffect(() => {
    return () => {
      if (posterPreview && posterPreview.startsWith('blob:')) {
        URL.revokeObjectURL(posterPreview);
      }
    };
  }, [posterPreview]);

  useEffect(() => {
    if (paramContentId) {
      loadContent(paramContentId);
    }
  }, [paramContentId]);

  const handlePosterChange = (event) => {
    const file = event.target.files?.[0] ?? null;

    if (posterPreview && posterPreview.startsWith('blob:')) {
      URL.revokeObjectURL(posterPreview);
    }

    setPosterFile(file);
    if (file) {
      setPosterPreview(URL.createObjectURL(file));
      clearErrors('poster');
    } else {
      setPosterPreview(null);
      if (!loadedContent) {
        setError('poster', { type: 'required', message: 'O cartaz é obrigatório.' });
      }
    }
  };

  const loadContent = async (id) => {
    if (!id) return;

    try {
      const response = await contentsApi.getById(id);
      const content = response.data;
      const coverUrl = content.coverUrl || content.poster?.url || '';

      setLoadedContent(content);
      reset({
        title: content.title || '',
        typeContent: content.typeContent || DEFAULT_CONTENT_TYPE,
        description: content.description || '',
        details: content.details || '',
        eventDate: content.eventDate ? content.eventDate.split('T')[0] : '',
        eventLocation: content.eventLocation || '',
        category: content.category || '',
      });
      setPosterFile(null);
      setPosterPreview(coverUrl || null);
    } catch (error) {
      console.error('Não foi possível carregar o conteúdo.', error);
    }
  };

  const clearLoadedContent = () => {
    setLoadedContent(null);
    setPosterFile(null);
    setPosterPreview(null);
    setSubmitError('');
    reset(defaultValues);
    navigate('/painel/publicar');
  };

  const onSubmit = (data) => {
    if (!posterFile && !loadedContent) {
      setError('poster', { type: 'required', message: 'O cartaz é obrigatório.' });
      return;
    }

    setPendingContent(data);
    setIsConfirmationOpen(true);
  };

  const handlePublish = async () => {
    if (!pendingContent) return;

    setIsSubmitting(true);
    setUploadProgress(0);
    setSubmitError('');

    try {
      let coverUrl = null;

      if (posterFile) {
        const imageForm = new FormData();
        imageForm.append('file', posterFile);

        const imageResp = await uploadsApi.uploadImage(imageForm, {
          onUploadProgress: (evt) => {
            const percent = Math.round((evt.loaded * 100) / (evt.total || 1));
            setUploadProgress(percent);
          },
        });

        coverUrl = imageResp.data?.url;
      }

      const contentData = {
        title: pendingContent.title,
        typeContent: pendingContent.typeContent,
        description: pendingContent.description,
        details: pendingContent.details,
        eventDate: pendingContent.eventDate,
        eventLocation: pendingContent.eventLocation,
        category: pendingContent.category,
      };

      if (coverUrl) {
        contentData.coverUrl = coverUrl;
      } else if (loadedContent) {
        contentData.coverUrl = loadedContent.coverUrl;
      }

      if (loadedContent) {
        await contentsApi.update(loadedContent.id, contentData);
      } else {
        await contentsApi.create({ ...contentData, ownerId: user?.id });
      }

      navigate('/painel');
    } catch (error) {
      console.error('Erro ao salvar conteúdo.', error);
      const data = error.response?.data;
      const message =
        (typeof data === 'string' && data.trim()) ||
        data?.message ||
        'Não foi possível salvar o conteúdo. Tente novamente.';
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
      setIsConfirmationOpen(false);
    }
  };

  const handleDelete = async () => {
    if (!loadedContent) return;

    setIsSubmitting(true);

    try {
      await contentsApi.delete(loadedContent.id);
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao excluir conteúdo.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryLabel = categories.find((item) => item.value === watchCategory)?.label || 'Categoria';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{loadedContent ? 'Editar Conteúdo' : 'Publicar Conteúdo'}</h1>
        <p className="text-sm text-muted mt-2 max-w-xl">
          {loadedContent
            ? 'Atualize os detalhes do conteúdo e confirme para salvar as alterações.'
            : 'Crie um conteúdo, confirme os detalhes e publique-o para que toda a comunidade possa descobrir.'}
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.5fr_1fr]">
        <Card className="space-y-6">
          <CardHeader className="space-y-3">
            <CardTitle>{loadedContent ? 'Editar Conteúdo' : 'Formulário de Conteúdo'}</CardTitle>
            <p className="text-sm text-muted">Preencha todos os campos obrigatórios antes de enviar.</p>
          </CardHeader>

          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="grid gap-4">
                <Input
                  label="Título"
                  placeholder="Nome do conteúdo"
                  error={errors.title?.message}
                  {...register('title', {
                    required: 'O título é obrigatório.',
                    minLength: { value: 5, message: 'Use pelo menos 5 caracteres.' },
                  })}
                />

                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Sinopse</label>
                    <textarea
                      className={`min-h-[84px] w-full rounded-md border px-3 py-2 text-sm text-text transition-colors bg-surface border-white/10 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      placeholder="Uma breve descrição do conteúdo"
                      {...register('description', {
                        required: 'A sinopse é obrigatória.',
                        minLength: { value: 10, message: 'Use pelo menos 10 caracteres.' },
                      })}
                    />
                    {errors.description && <span className="text-xs text-red-500">{errors.description.message}</span>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium">Descrição</label>
                    <textarea
                      className={`min-h-[84px] w-full rounded-md border px-3 py-2 text-sm text-text transition-colors bg-surface border-white/10 placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.details ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                      placeholder="Detalhes completos do conteúdo"
                      {...register('details', {
                        required: 'A descrição é obrigatória.',
                        minLength: { value: 20, message: 'Use pelo menos 20 caracteres.' },
                      })}
                    />
                    {errors.details && <span className="text-xs text-red-500">{errors.details.message}</span>}
                  </div>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Input
                    label="Data"
                    type="date"
                    error={errors.eventDate?.message}
                    {...register('eventDate', {
                      required: 'A data é obrigatória.',
                    })}
                  />

                  <Input
                    label="Local"
                    placeholder="Rua, bairro, cidade"
                    error={errors.eventLocation?.message}
                    {...register('eventLocation', {
                      required: 'O local é obrigatório.',
                      minLength: { value: 5, message: 'Insira um local válido.' },
                    })}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Tipo de Conteúdo</label>
                  <select
                    className={`h-11 rounded-md border border-white/10 bg-surface px-3 text-sm text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.typeContent ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    {...register('typeContent', {
                      required: 'O tipo de conteúdo é obrigatório.',
                    })}
                  >
                    {Object.values(CONTENT_TYPE).map((value) => (
                      <option key={value} value={value}>
                        {CONTENT_TYPE_LABELS[value]}
                      </option>
                    ))}
                  </select>
                  {errors.typeContent && <span className="text-xs text-red-500">{errors.typeContent.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Categoria</label>
                  <select
                    className={`h-11 rounded-md border border-white/10 bg-surface px-3 text-sm text-text transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.category ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                    {...register('category', {
                      required: 'A categoria é obrigatória.',
                    })}
                  >
                    <option value="">Escolha a categoria</option>
                    {categories.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && <span className="text-xs text-red-500">{errors.category.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Cartaz</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePosterChange}
                    className={`h-11 rounded-md border border-white/10 bg-surface px-3 text-sm text-text transition-colors file:border-0 file:bg-background file:px-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.poster ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.poster && <span className="text-xs text-red-500">{errors.poster.message}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {loadedContent && (
                  <>
                    <Button variant="secondary" type="button" onClick={clearLoadedContent} disabled={isSubmitting}>
                      Nova publicação
                    </Button>
                    <Button variant="outline" type="button" onClick={handleDelete} isLoading={isSubmitting}>
                      Excluir Publicação
                    </Button>
                  </>
                )}
                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  {loadedContent ? 'Salvar Alterações' : 'Verificar e Publicar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="space-y-6">
          <CardHeader className="space-y-3">
            <CardTitle>Pré-visualização</CardTitle>
            <p className="text-sm text-muted">Confira o visual do conteúdo antes de publicar.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-background p-4">
              <div className="mb-4 overflow-hidden rounded-3xl border border-white/10 bg-surface">
                {posterPreview ? (
                  <img
                    src={posterPreview}
                    alt="Pré-visualização do cartaz"
                    className="h-64 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center rounded-3xl bg-white/5 text-sm text-muted">
                    Cartaz do conteúdo
                  </div>
                )}
              </div>

              <div className="space-y-3 px-1">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary">{selectedCategoryLabel}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{watchTitle || 'Título do conteúdo'}</h2>
                  <p className="text-sm text-muted mt-1">{watchDescription || 'Sinopse breve do conteúdo aparecerá aqui.'}</p>
                </div>
                <div className="grid gap-2 text-sm text-muted">
                  <p><strong className="text-text">Data:</strong> {watchEventDate || 'dd/mm/aaaa'}</p>
                  <p><strong className="text-text">Local:</strong> {watchEventLocation || 'Endereço do conteúdo'}</p>
                </div>
                <div>
                  <h3 className="text-base font-semibold">Descrição</h3>
                  <p className="text-sm text-muted">{watchDetails || 'A descrição completa do conteúdo aparecerá aqui para dar mais contexto aos interessados.'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)} title="Confirmar publicação">
        <div className="space-y-4 text-sm text-text">
          <p>Reveja os detalhes do conteúdo antes de enviar. Quando confirmar, o conteúdo será publicado imediatamente.</p>

          <div className="space-y-3 rounded-2xl border border-white/10 bg-surface p-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Título</p>
              <p className="mt-1 text-base font-semibold">{pendingContent?.title}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Categoria</p>
              <p className="mt-1 text-base">{categories.find((item) => item.value === pendingContent?.category)?.label || '-'}</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Data</p>
                <p className="mt-1">{pendingContent?.eventDate}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted">Local</p>
                <p className="mt-1">{pendingContent?.eventLocation}</p>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Sinopse</p>
              <p className="mt-1 text-sm text-muted">{pendingContent?.description}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted">Descrição</p>
              <p className="mt-1 text-sm text-muted">{pendingContent?.details}</p>
            </div>
          </div>
        </div>

        {submitError && (
          <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {submitError}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <Button variant="secondary" onClick={() => setIsConfirmationOpen(false)} disabled={isSubmitting}>
            Voltar
          </Button>
          <Button onClick={handlePublish} isLoading={isSubmitting}>
            Confirmar Publicação
          </Button>
        </div>
      </Modal>
    </div>
  );
}
