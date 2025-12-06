/**
 * Buyer Limits Search Hook
 * Following OperationPricing filter form pattern exactly
 */

import { fields } from '@components';
import yup from '@validation';
import { useForm } from 'react-hook-form';
import type { BuyerLimitsSearchFormData, SearchBuyerLimitsParams } from '../company-buyer-limits-tab.types';

interface UseBuyerLimitsSearchProps {
  /** Company ID for the search */
  companyId: number;

  /** Callback when search is performed */
  onSearch?: (params: SearchBuyerLimitsParams) => void;

  /** Callback when search is reset */
  onReset?: () => void;
}

/**
 * Hook for managing buyer limits search form
 * Matches legacy renderBuyerSearch functionality exactly
 */
export const useBuyerLimitsSearch = ({ companyId, onSearch, onReset }: UseBuyerLimitsSearchProps) => {
  // Form schema matching legacy search fields exactly
  const schema = yup.object({
    receiverIdentifier: fields.text.label('VKN').meta({
      col: 12,
      placeholder: 'VKN giriniz...',
    }),
  });

  const form = useForm<BuyerLimitsSearchFormData>({
    defaultValues: {
      receiverIdentifier: '',
    },
    mode: 'onChange',
  });

  // Handle search submission
  const handleSearch = form.handleSubmit((formData) => {
    const searchParams: SearchBuyerLimitsParams = {
      companyId,
    };

    // Only add ReceiverIdentifier parameter if it has value
    if (formData.receiverIdentifier.trim()) {
      searchParams.ReceiverIdentifier = formData.receiverIdentifier.trim();
    }

    onSearch?.(searchParams);
  });

  // Handle form reset
  const handleReset = () => {
    form.reset();
    onReset?.(); // Clear search results
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
  };
};
