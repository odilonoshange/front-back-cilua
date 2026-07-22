import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineBanner = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div role="status" aria-live="polite" className="border-b border-amber-400 bg-amber-500/95 px-4 py-2 text-center text-sm font-medium text-black">
      Você está offline. Alguns recursos podem não funcionar até reconectar.
    </div>
  );
};
