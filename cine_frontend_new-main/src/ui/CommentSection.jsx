import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { reviewsApi } from '../api/reviews';
import { useAuth } from '../hooks/useAuth';
import { Button } from './Button';

export const CommentSection = ({ contentId }) => {
  const { user, isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      rating: '5',
      comment: '',
    },
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const response = await reviewsApi.getByContentId(contentId);
        setReviews(response.data || []);
      } catch (error) {
        console.error('Não foi possível carregar avaliações.', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [contentId]);

  const onSubmit = async (data) => {
    if (!isAuthenticated || !user?.id || Number.isNaN(Number(user.id))) {
      console.error('É necessário iniciar sessão com uma conta real para comentar.');
      return;
    }

    setIsSubmitting(true);
    try {
      const reviewData = {
        userId: Number(user.id),
        rating: Number(data.rating),
        commentary: data.comment?.trim() || '',
      };

      const response = await reviewsApi.create(contentId, reviewData);
      setReviews((prev) => [response.data, ...prev]);
      reset({ rating: '5', comment: '' });
    } catch (error) {
      console.error('Erro ao enviar comentário.', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Comentários e Avaliações</h2>
        <span className="text-sm text-muted">{reviews.length} opiniões</span>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Avaliação</label>
            <select
              className={`h-11 rounded-md border border-white/10 bg-background px-3 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.rating ? 'border-red-500' : ''}`}
              {...register('rating', {
                required: 'Selecione uma avaliação.',
              })}
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} estrelas
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Comentário</label>
            <textarea
              className={`min-h-[84px] w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${errors.comment ? 'border-red-500' : ''}`}
              placeholder="Partilhe a sua opinião sobre o conteúdo"
              {...register('comment', {
                required: 'O comentário é obrigatório.',
                minLength: { value: 10, message: 'Escreva pelo menos 10 caracteres.' },
              })}
            />
            {errors.comment && <span className="text-xs text-red-500">{errors.comment.message}</span>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" isLoading={isSubmitting}>
            Enviar Avaliação
          </Button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {isLoading ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-background p-6 text-center text-sm text-muted">Carregando avaliações...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-background p-6 text-center text-sm text-muted">Seja o primeiro a avaliar este conteúdo.</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-3xl border border-white/10 bg-background p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-semibold">{review.userName || 'Anônimo'}</span>
                <span className="text-sm text-primary">{review.rating} estrelas</span>
              </div>
              <p className="mt-2 text-sm text-muted">{review.commentary}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
