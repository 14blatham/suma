import { useState } from 'react';

export function useFilters<T extends Record<string, unknown>>(initial: Partial<Record<keyof T, string>> = {}) {
  const [filters, setFilters] = useState<Partial<Record<keyof T, string>>>(initial);

  const setFilter = (key: keyof T, value: string) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  const clearFilters = () => setFilters(initial);

  const apply = (rows: T[]): T[] =>
    rows.filter((row) =>
      (Object.entries(filters) as [keyof T, string][]).every(
        ([key, val]) => !val || String(row[key]).toLowerCase().includes(val.toLowerCase())
      )
    );

  return { filters, setFilter, clearFilters, apply };
}
