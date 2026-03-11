import { useState, useEffect, useCallback } from 'react';

export function useDataFetch<T>(fetcher: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch {
      setError('Failed to load.');
    } finally {
      setIsLoading(false);
    }
  }, [fetcher]);

  useEffect(() => { load(); }, [load]);

  return { data, isLoading, error, refresh: load };
}
