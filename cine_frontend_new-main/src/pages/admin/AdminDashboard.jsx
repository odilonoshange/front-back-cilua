import { useState, useEffect, useCallback, useRef } from 'react';
import { adminApi } from '../../api/admin';
import { Button } from '../../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../ui/Card';
import { Modal } from '../../ui/Modal';
import { EmptyState } from '../../ui/EmptyState';
import { ShieldCheck } from 'lucide-react';
import { CONTENT_STATUS } from '../../constants/enums';

// Intervalo do polling do painel de moderação. Não é WebSocket/SSE de
// verdade — foi a opção escolhida para manter a implementação simples.
const POLL_INTERVAL_MS = 5000;

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actioningId, setActioningId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const pollRef = useRef(null);

  // O backend devolve o motivo em texto simples (BusinessRoleException) ou
  // um objeto de validação; isto extrai algo legível em qualquer dos casos,
  // em vez de deixar o erro só na consola (era a causa dos "não funciona"
  // sem explicação nenhuma no ecrã).
  const extractErrorMessage = (err, fallback) => {
    const data = err.response?.data;
    if (typeof data === 'string' && data.trim()) return data;
    if (data?.message) return data.message;
    return fallback;
  };

  const loadAll = useCallback(async (showSpinner = false) => {
    if (showSpinner) setLoading(true);
    try {
      const [statsRes, usersRes, pendingRes] = await Promise.all([
        adminApi.getStats(),
        adminApi.getUsers(),
        adminApi.getContents(CONTENT_STATUS.PENDING),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setPending(pendingRes.data);
      setError('');
    } catch (err) {
      console.error('Não foi possível carregar dados de administração.', err);
      setError(
        err.response?.status === 403
          ? 'Acesso restrito ao administrador.'
          : 'Não foi possível carregar os dados.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll(true);
    // "Tempo real" via polling: o painel actualiza sozinho a cada poucos
    // segundos para reflectir novas publicações submetidas pelos estúdios.
    pollRef.current = setInterval(() => loadAll(false), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [loadAll]);

  const handleApprove = async (id) => {
    setActioningId(id);
    setActionError('');
    try {
      await adminApi.approve(id);
      await loadAll(false);
    } catch (err) {
      console.error('Erro ao aprovar publicação.', err);
      setActionError(extractErrorMessage(err, 'Não foi possível aprovar a publicação.'));
    } finally {
      setActioningId(null);
    }
  };

  const openReject = (id) => {
    setRejectingId(id);
    setRejectReason('');
    setActionError('');
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    setActioningId(rejectingId);
    try {
      await adminApi.reject(rejectingId, rejectReason.trim());
      setRejectingId(null);
      await loadAll(false);
    } catch (err) {
      console.error('Erro ao rejeitar publicação.', err);
      setActionError(extractErrorMessage(err, 'Não foi possível rejeitar a publicação.'));
    } finally {
      setActioningId(null);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Eliminar o utilizador "${user.name}"? Esta ação não pode ser desfeita.`)) return;
    setDeletingUserId(user.id);
    setActionError('');
    try {
      await adminApi.deleteUser(user.id);
      await loadAll(false);
    } catch (err) {
      console.error('Erro ao eliminar utilizador.', err);
      setActionError(extractErrorMessage(err, 'Não foi possível eliminar o utilizador.'));
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-sm text-muted">A carregar painel de administração...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <EmptyState icon={ShieldCheck} title="Não foi possível aceder" description={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Painel do Administrador</h1>
          <p className="text-sm text-muted mt-2">Utilizadores, publicações e validação de conteúdos.</p>
        </div>
      </div>

      {actionError && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {actionError}
        </div>
      )}

      {/* Estatísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total de inscritos</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalUsers ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Total de publicações</p>
            <p className="mt-2 text-3xl font-bold">{stats?.totalPublications ?? 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Pendentes</p>
            <p className="mt-2 text-3xl font-bold text-yellow-400">{pending.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Aprovadas</p>
            <p className="mt-2 text-3xl font-bold text-green-400">{stats?.publicationsByStatus?.APPROVED ?? 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Fila de validação */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Publicações pendentes de validação</h2>
        {pending.length === 0 ? (
          <EmptyState icon={ShieldCheck} title="Nada pendente" description="Não há publicações à espera de validação neste momento." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((content) => (
              <Card key={content.id}>
                <CardContent className="p-4 space-y-3">
                  <div className="h-32 w-full overflow-hidden rounded-md bg-white/5">
                    <img src={content.coverUrl} alt={content.title} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{content.title}</h3>
                    <p className="text-xs text-muted">Por {content.ownerName || 'Desconhecido'}</p>
                    <p className="text-xs text-muted">{content.eventDate}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApprove(content.id)} isLoading={actioningId === content.id}>
                      Aprovar
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => openReject(content.id)} disabled={actioningId === content.id}>
                      Rejeitar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Utilizadores */}
      <section>
        <h2 className="mb-4 text-xl font-semibold">Utilizadores inscritos ({users.length})</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted">
                  <th className="p-3">Nome</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Papel</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-white/5 last:border-0">
                    <td className="p-3">{u.name}</td>
                    <td className="p-3">{u.email}</td>
                    <td className="p-3">{u.role}</td>
                    <td className="p-3 text-right">
                      {u.role !== 'ADMIN' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteUser(u)}
                          isLoading={deletingUserId === u.id}
                        >
                          Eliminar
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Publicações por estúdio */}
      {stats?.publicationsByStudio?.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold">Publicações por estúdio/grupo</h2>
          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-left text-muted">
                    <th className="p-3">Estúdio/Grupo</th>
                    <th className="p-3">Publicações</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.publicationsByStudio.map((s) => (
                    <tr key={s.ownerId} className="border-b border-white/5 last:border-0">
                      <td className="p-3">{s.ownerName}</td>
                      <td className="p-3">{s.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>
      )}

      <Modal isOpen={rejectingId !== null} onClose={() => setRejectingId(null)} title="Motivo da rejeição">
        <div className="space-y-4">
          <p className="text-sm text-muted">Explique ao estúdio/grupo porque a publicação está a ser rejeitada.</p>
          <textarea
            className="min-h-[100px] w-full rounded-md border border-white/10 bg-surface px-3 py-2 text-sm text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            placeholder="Ex.: o vídeo não corresponde à sinopse enviada."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRejectingId(null)}>Cancelar</Button>
            <Button onClick={confirmReject} isLoading={actioningId === rejectingId} disabled={!rejectReason.trim()}>
              Confirmar rejeição
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
