// Hook generik untuk fetch data Firestore (one-time)
import { useEffect, useState, useCallback } from 'react';

export interface FirestoreDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useFirestoreData<T>(
  fetcher: () => Promise<T>,
  deps: React.DependencyList = []
): FirestoreDataState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetcher()
      .then((d) => {
        if (mounted) setData(d);
      })
      .catch((e: any) => {
        if (mounted) setError(e?.message ?? 'Terjadi kesalahan');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, refreshKey]);

  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { data, loading, error, refresh };
}