import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { InvoiceScoreRatiosFilters } from '../invoice-score-ratios.types';

export const useInvoiceScoreRatiosQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: InvoiceScoreRatiosFilters = useMemo(() => {
    const metricTypeParam = searchParams.get('metricType');
    return {
      metricType: metricTypeParam ? Number(metricTypeParam) : null,
    };
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<InvoiceScoreRatiosFilters>) => {
    const updatedParams = new URLSearchParams(searchParams);

    // Update or remove metricType param
    if (newFilters.metricType !== undefined) {
      if (newFilters.metricType !== null && newFilters.metricType !== 0) {
        updatedParams.set('metricType', String(newFilters.metricType));
      } else {
        updatedParams.delete('metricType');
      }
    }

    setSearchParams(updatedParams);
  };

  return { filters, updateFilters };
};
