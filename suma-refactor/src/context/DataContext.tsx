import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { fetchRows, type Row } from '../services/api';

type FilterMap = Record<string, string>;

interface DataContextValue {
  dataset: Row[] | null;
  filtered: Row[];
  filters: FilterMap;
  isLoading: boolean;
  error: string | null;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  refresh: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataContextProvider({ children }: { children: ReactNode }) {
  const [dataset, setDataset] = useState<Row[] | null>(null);
  const [filters, setFilters] = useState<FilterMap>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await fetchRows();
      setDataset(rows);
    } catch {
      setError('Failed to load data.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = (dataset ?? []).filter((row) =>
    Object.entries(filters).every(([key, val]) =>
      !val || String(row[key as keyof Row]).toLowerCase().includes(val.toLowerCase())
    )
  );

  const setFilter = (key: string, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters({});

  return (
    <DataContext.Provider value={{ dataset, filtered, filters, isLoading, error, setFilter, clearFilters, refresh: load }}>
      {children}
    </DataContext.Provider>
  );
}

export function useDataContext(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useDataContext must be used within DataContextProvider');
  return ctx;
}
