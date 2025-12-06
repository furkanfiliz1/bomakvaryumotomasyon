/**
 * E-Invoice Transfer History Filter Form Hook
 * Following OperationPricing useOperationPricingFilterForm pattern
 * Based on legacy EInvoiceTransferHistory.js filter logic
 * Uses proper Form system with fields from @components/common/Form
 */

import { fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import type { EInvoiceTransferHistoryFilters } from '../e-invoice-transfer-history.types';

interface UseEInvoiceTransferHistoryFilterFormProps {
  onFilterChange: (filters: Partial<EInvoiceTransferHistoryFilters>) => void;
  onTransfer?: (number: string) => void;
}

/**
 * Custom hook for managing E-Invoice Transfer History filter form
 * Following OperationPricing filter form pattern exactly with proper Form system
 */
export const useEInvoiceTransferHistoryFilterForm = ({
  onFilterChange,
  onTransfer,
}: UseEInvoiceTransferHistoryFilterFormProps) => {
  const notice = useNotice();

  /**
   * Form schema for E-Invoice Transfer History filters
   * Using proper fields from Form system
   */
  const schema = yup.object({
    number: fields.text.label('E-Fatura No').meta({
      col: 12,
      placeholder: 'Fatura numarası girin...',
    }),
  });

  type FormData = yup.InferType<typeof schema>;

  const form = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      number: '',
    },
  });

  const { handleSubmit, reset, getValues } = form;

  // Manual search - only triggered by button click
  const handleSearch = handleSubmit((data) => {
    // Trigger filter change only when search button is clicked
    onFilterChange(data);
  });

  const handleReset = () => {
    reset({
      number: '',
    });
  };

  const handleTransfer = () => {
    const currentNumber = getValues().number?.trim();

    if (!currentNumber) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen fatura numarası giriniz.',
      });
      return;
    }

    if (onTransfer) {
      onTransfer(currentNumber);
    }
  };

  const showTransferInvoiceModal = () => {
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Fatura bulunamadı!',
      message: 'Manuel olarak eklemek ister misiniz?',
      buttonTitle: 'Faturayı Aktar',
    }).then(() => {
      handleTransfer();
    });
  };

  const showFailedTransferModal = () => {
    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Tüm faturalar hatalı!',
      message: 'Manuel olarak tekrar aktarmak ister misiniz?',
      buttonTitle: 'Faturayı Aktar',
    }).then(() => {
      handleTransfer();
    });
  };

  const showRedirectToScoreModal = (companyId: string): Promise<string> => {
    return notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Uyarı',
      message:
        "E-fatura Figo veritabanında bulunamadı. Entegratör Fatura Çekim tarihini güncellemek için Tamam'a basarak ilgili sayfaya gidebilirsiniz.",
      buttonTitle: 'Tamam',
    }).then(() => {
      return Promise.resolve(companyId);
    });
  };

  return {
    form,
    schema,
    handleSearch,
    handleReset,
    handleTransfer,
    showTransferInvoiceModal,
    showFailedTransferModal,
    showRedirectToScoreModal,
    FormProvider,
  };
};
