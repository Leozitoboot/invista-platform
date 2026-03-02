import { useMemo } from 'react';
import FundsMockService from '../services/FundsMockService';
import type { FundFilters } from '../services/FundsMockService';

export function useFunds(filters?: FundFilters) {
  const search = filters?.search;
  const moeda = filters?.moeda;
  const status = filters?.status;
  const perfil = filters?.perfil;
  return useMemo(
    () => FundsMockService.list({ search, moeda, status, perfil }),
    [search, moeda, status, perfil]
  );
}

export function useFund(slug: string) {
  return useMemo(() => FundsMockService.getBySlug(slug), [slug]);
}
