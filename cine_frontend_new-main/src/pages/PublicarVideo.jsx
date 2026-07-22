import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Upload } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { contentsApi } from '../api/contents';
import { uploadsApi } from '../api/uploads';

function formatDateLabel(value) {
  if (!value) return 'Data não definida';
  return new Date(value).toLocaleDateString('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export default function PublicarVideo() {
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [pendingData, setPendingData] = useState(null);
  const [submitError, setSubmitError] = useState('');
  const [contentTitle, setContentTitle] = useState('');

  const navigate = useNavigate();
  const { contentId: routeContentId } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      contentId: routeContentId || '',
      eventDate: '',
    },
  });

  const watchEventDate = watch('eventDate');
  const isStreamAvailable = useMemo(() => {
    if (!watchEventDate) return false;
    return new Date() >= new Date(watchEventDate);
  }, [watchEventDate]);

  useEffect(() => {
    return () => {
      if (posterPreview) URL.revokeObjectURL(posterPreview);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
    };
  }, [posterPreview, videoPreview]);

  useEffect(() => {
    // Quando se chega aqui a partir de "Upload Vídeo" num card do painel,
    // o ID já vem preenchido — buscamos a data real gravada no conteúdo
    // para evitar que o utilizador reescreva à mão e engane a pré-visualização.
    if (!routeContentId) return;
    contentsApi
      .getById(routeContentId)
      .then((response) => {
        setContentTitle(response.data?.title || '');
        if (response.data?.eventDate) {
          reset({ contentId: routeContentId, eventDate: response.data.eventDate.split('T')[0] });
        }
      })
      .catch((err) => {
        console.error('Não foi possível carregar o conteúdo.', err);
        setSubmitError('Não foi encontrado nenhum conteúdo com esse ID.');
      });
  }, [routeContentId, reset]);

  const handlePosterChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (posterPreview) URL.revokeObjectURL(posterPreview);

    if (file && file.type !== 'image/png') {
      setPosterFile(null);
      setPosterPreview(null);
      setError('poster', { type: 'type', message: 'Cartaz precisa ser PNG.' });
      return;
    }

    clearErrors('poster');
    setPosterFile(file);
    setPosterPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleVideoChange = (event) => {
    const file = event.target.files?.[0] ?? null;
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    if (file && file.type !== 'video/mp4') {
      setVideoFile(null);
      setVideoPreview(null);
      setError('video', { type: 'type', message: 'O vídeo precisa ser MP4.' });
      return;
    }

    clearErrors('video');
    setVideoFile(file);
    setVideoPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = (data) => {
    if (!posterFile) {
      setError('poster', { type: 'required', message: 'Cartaz em PNG obrigatório.' });
      return;
    }

    if (!videoFile) {
      setError('video', { type: 'required', message: 'Vídeo em MP4 obrigatório.' });
      return;
    }

    setPendingData(data);
    setIsConfirmationOpen(true);
  };

  const handleUpload = async () => {
    // New flow: upload image and video to external service, obtain URLs,
    // then update the Content via contentsApi.update with URLs only.
    if (!pendingData) return;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate external upload calls using uploadsApi (which still uses multipart)
      // In real flow, integrate Cloudinary / external provider here and obtain URLs.
      const imageForm = new FormData();
      imageForm.append('file', posterFile);
      const imageResp = await uploadsApi.uploadImage(imageForm, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percent / 2);
        },
      });
      const imageUrl = imageResp.data?.url;

      const videoForm = new FormData();
      videoForm.append('file', videoFile);
      const videoResp = await uploadsApi.uploadVideo(videoForm, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(50 + (percent / 2));
        },
      });
      const videoUrl = videoResp.data?.url;

      // Update content with obtained URLs only
      await contentsApi.updateVideo(pendingData.contentId, videoUrl, imageUrl);

      setIsConfirmationOpen(false);
      navigate('/painel');
    } catch (error) {
      console.error('Erro ao carregar mídia.', error);
      // Antes este erro só ia para a consola — o botão parecia simplesmente
      // "não funcionar". Agora mostramos o motivo real (ex.: a data do
      // conteúdo ainda não chegou, ID inválido, etc.).
      const data = error.response?.data;
      const message =
        (typeof data === 'string' && data.trim()) ||
        data?.message ||
        (error.response?.status === 404
          ? 'Não foi encontrado nenhum conteúdo com esse ID.'
          : 'Não foi possível concluir o upload. Tente novamente.');
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Upload de Vídeo do Conteúdo</h1>
          <p className="text-sm text-muted mt-2 max-w-2xl">Faça upload do cartaz PNG e do vídeo MP4 via Cloudinary e atualize o conteúdo existente.</p>
        </div>
        <Link to="/painel/publicar" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm text-text hover:bg-white/5 transition-colors">
          <ArrowLeft size={16} /> Voltar ao formulário de conteúdo
        </Link>
      </div>

      <div className="grid gap-8 xl:grid-cols-[1.4fr_1fr]">
        <Card className="space-y-6">
          <CardHeader className="space-y-3">
            <CardTitle>Dados de Upload</CardTitle>
            <p className="text-sm text-muted">
              {contentTitle ? `Conteúdo: ${contentTitle}` : 'Informe o ID do conteúdo e selecione os ficheiros válidos.'}
            </p>
          </CardHeader>

          <CardContent>
            {submitError && !isConfirmationOpen && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {submitError}
              </div>
            )}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <Input
                label="ID do Conteúdo"
                placeholder="123456"
                error={errors.contentId?.message}
                {...register('contentId', {
                  required: 'O ID do conteúdo é obrigatório.',
                })}
              />

              <Input
                label="Data do Conteúdo"
                type="date"
                error={errors.eventDate?.message}
                {...register('eventDate', {
                  required: 'A data do conteúdo é obrigatória.',
                })}
              />

              <div className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Cartaz PNG</label>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={handlePosterChange}
                    className={`h-11 rounded-md border border-white/10 bg-surface px-3 text-sm text-text transition-colors file:border-0 file:bg-background file:px-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.poster ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.poster && <span className="text-xs text-red-500">{errors.poster.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium">Vídeo MP4</label>
                  <input
                    type="file"
                    accept="video/mp4"
                    onChange={handleVideoChange}
                    className={`h-11 rounded-md border border-white/10 bg-surface px-3 text-sm text-text transition-colors file:border-0 file:bg-background file:px-0 file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.video ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                  />
                  {errors.video && <span className="text-xs text-red-500">{errors.video.message}</span>}
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Verificar e Enviar
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="space-y-6">
          <CardHeader className="space-y-3">
            <CardTitle>Pré-visualização de Upload</CardTitle>
            <p className="text-sm text-muted">Veja o estado dos ficheiros e o desbloqueio do streaming.</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3 rounded-3xl border border-white/10 bg-background p-4">
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface px-4 py-3">
                <div>
                  <p className="text-sm text-muted">Data do conteúdo</p>
                  <p className="text-base font-semibold">{formatDateLabel(watchEventDate)}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isStreamAvailable ? 'bg-emerald-500/15 text-emerald-400' : 'bg-amber-500/15 text-amber-300'}`}>
                  {isStreamAvailable ? 'Streaming disponível' : 'Streaming bloqueado'}
                </span>
              </div>

              <div className="grid gap-4">
                <div className="rounded-2xl border border-white/10 bg-surface p-4">
                  <p className="text-sm text-muted">Cartaz selecionado</p>
                  {posterPreview ? (
                    <img src={posterPreview} alt="Cartaz preview" className="mt-3 h-48 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="mt-3 flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-background text-sm text-muted">
                      Ainda não foi selecionado
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-white/10 bg-surface p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm text-muted">Vídeo selecionado</p>
                      <p className="mt-1 text-sm text-text">{videoFile?.name ?? 'Nenhum ficheiro selecionado'}</p>
                    </div>
                    <Upload size={18} />
                  </div>

                  {videoPreview && (
                    <div className="mt-3">
                      {isStreamAvailable ? (
                        <video controls className="w-full rounded-2xl bg-black" src={videoPreview} />
                      ) : (
                        <div className="mt-3 flex h-48 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-background px-4 text-center text-sm text-muted">
                          Streaming ficará disponível somente após <strong>{formatDateLabel(watchEventDate)}</strong>.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-muted">
                    <span>Progresso de upload</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal isOpen={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)} title="Confirmar upload">
        <div className="space-y-4 text-sm text-text">
          <p>Confirme o upload dos ficheiros para o conteúdo especificado. Esta ação enviará o PNG e o MP4 via Cloudinary para o backend.</p>

          <div className="rounded-2xl border border-white/10 bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-muted">Conteúdo</p>
            <p className="mt-1 text-base font-semibold">{pendingData?.contentId}</p>
            <p className="mt-1 text-sm text-muted">Data do conteúdo: {formatDateLabel(pendingData?.eventDate)}</p>
            <p className="mt-2 text-sm">Cartaz: {posterFile?.name ?? 'Nenhum'}</p>
            <p className="text-sm">Vídeo: {videoFile?.name ?? 'Nenhum'}</p>
          </div>

          {submitError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {submitError}
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 justify-end">
          <Button variant="secondary" onClick={() => setIsConfirmationOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} isLoading={isSubmitting}>
            Confirmar Upload
          </Button>
        </div>
      </Modal>
    </div>
  );
}
