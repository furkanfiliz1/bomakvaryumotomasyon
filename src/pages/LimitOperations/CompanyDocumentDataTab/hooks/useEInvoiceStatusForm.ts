/**
 * E-Invoice Status Form Hook
 * Following OperationPricing pattern for form management with React Hook Form and Yup
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { InvoiceIntegrator, InvoiceIntegratorDetail } from '../company-document-data-tab.types';

// Form data interface matching the image structure
export interface EInvoiceStatusFormData {
  // Editable fields for Next Withdrawals (Sonraki Çekim Tarihleri)
  nextIncomingDate: string; // Gelen Fatura
  nextOutgoingDate: string; // Giden Fatura
  requestLimitDate: string; // Sonraki Çekim Zamanı

  // Editable field for Withdrawal Limit (Çekme Limiti)
  requestCurrentLimit: number; // Kalan Limit Güncelle
}

interface UseEInvoiceStatusFormProps {
  invoiceIntegratorDetail?: InvoiceIntegratorDetail;
  invoiceIntegrator?: InvoiceIntegrator;
  onSubmit: (data: EInvoiceStatusFormData) => void;
}

export function useEInvoiceStatusForm({
  invoiceIntegratorDetail,
  invoiceIntegrator,
  onSubmit,
}: UseEInvoiceStatusFormProps) {
  // Initialize form values with API data - populate with real values from API
  const initialValues: EInvoiceStatusFormData = useMemo(
    () => ({
      // Next withdrawal dates - populate with API data formatted for date inputs (YYYY-MM-DD)
      nextIncomingDate: invoiceIntegratorDetail?.nextIncomingDate
        ? invoiceIntegratorDetail.nextIncomingDate.split('T')[0]
        : '',
      nextOutgoingDate: invoiceIntegratorDetail?.nextOutgoingDate
        ? invoiceIntegratorDetail.nextOutgoingDate.split('T')[0]
        : '',
      requestLimitDate: invoiceIntegratorDetail?.requestLimitDate
        ? invoiceIntegratorDetail.requestLimitDate.split('T')[0]
        : '',

      // Withdrawal limit - populate with request limit from API (matching legacy)
      requestCurrentLimit: invoiceIntegratorDetail?.requestLimit || 30,
    }),
    [invoiceIntegratorDetail],
  );

  // Form schema with validation and placeholders - following forms.instructions.md patterns
  const schema = useMemo(() => {
    // Format dates for placeholders - matching legacy format DD.MM.YYYY
    const formatDateForPlaceholder = (dateStr?: string) => {
      if (!dateStr) return '';
      try {
        return new Date(dateStr).toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      } catch {
        return '';
      }
    };

    const nextIncomingPlaceholder = formatDateForPlaceholder(invoiceIntegratorDetail?.nextIncomingDate);
    const nextOutgoingPlaceholder = formatDateForPlaceholder(invoiceIntegratorDetail?.nextOutgoingDate);
    const requestLimitPlaceholder = formatDateForPlaceholder(invoiceIntegratorDetail?.requestLimitDate);

    return yup.object({
      // Next withdrawal dates - all required with date validation and placeholders
      nextIncomingDate: fields.date
        .required('Gelen fatura tarihi zorunludur')
        .label('Gelen Fatura')
        .meta({
          col: 4,
          placeholder: nextIncomingPlaceholder || 'Gelen fatura tarihini seçiniz',
        }),

      nextOutgoingDate: fields.date
        .required('Giden fatura tarihi zorunludur')
        .label('Giden Fatura')
        .meta({
          col: 4,
          placeholder: nextOutgoingPlaceholder || 'Giden fatura tarihini seçiniz',
        }),

      requestLimitDate: fields.date
        .required('Sonraki çekim zamanı zorunludur')
        .label('Sonraki Çekim Zamanı')
        .meta({
          col: 4,
          placeholder: requestLimitPlaceholder || 'Sonraki çekim zamanını seçiniz',
        }),

      // Withdrawal limit - number with validation (handled manually in component, not in Form)
      requestCurrentLimit: yup
        .number()
        .transform((_, originalValue) => {
          // Handle empty string and invalid inputs
          if (originalValue === '' || originalValue === null || originalValue === undefined) {
            return undefined;
          }
          // Handle NaN
          if (Number.isNaN(originalValue)) {
            return undefined;
          }
          return Number(originalValue);
        })
        .positive('Pozitif bir sayı giriniz')
        .integer('Tam sayı giriniz')
        .min(1, 'Minimum 1 olmalıdır')
        .max(999, 'Maksimum 999 olabilir')
        .required('Bu alan zorunludur')
        .typeError('Geçerli bir sayı giriniz'),
    });
  }, [invoiceIntegratorDetail]);

  // Initialize React Hook Form
  const form = useForm<EInvoiceStatusFormData>({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange', // Validate on every change
  });

  // Reset form when initialValues change (when API data arrives)
  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  // Helper functions for display data (read-only fields)
  // Matching legacy getInvoiceIntegrator() logic exactly:
  // if (response.data.Integrators.length > 0) -> entry: true
  // else -> entry: false (default state)
  const displayData = useMemo(() => {
    let integratorStatus = 'Eklenmedi'; // Default when entry: false
    let integratorName = ''; // Default name

    // Legacy logic: only set values if entry is true (integrator exists)
    if (invoiceIntegrator?.entry) {
      integratorStatus = invoiceIntegrator?.active ? 'Aktif' : 'Pasif';
      integratorName = invoiceIntegrator?.integratorName || '';
    }

    return {
      // Servisten gelen gerçek veriler - API response'dan direkt
      companySector: invoiceIntegratorDetail?.companySector || '',
      creationDate: invoiceIntegratorDetail?.createdDate
        ? new Date(invoiceIntegratorDetail.createdDate)
            .toLocaleString('tr-TR', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })
            .split('.')
            .join('-')
            .replace(',', ' ')
        : '',
      integratorName,
      integratorStatus,
      remainingTotal: `${invoiceIntegratorDetail?.requestCurrentLimit || 0} / ${invoiceIntegratorDetail?.requestLimit || 0}`,

      // Tarih alanları - Form placeholder'ları için (schema içindeki formatDateForPlaceholder fonksiyonunu kullan)
      nextIncomingDate: invoiceIntegratorDetail?.nextIncomingDate
        ? new Date(invoiceIntegratorDetail.nextIncomingDate).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '',
      nextOutgoingDate: invoiceIntegratorDetail?.nextOutgoingDate
        ? new Date(invoiceIntegratorDetail.nextOutgoingDate).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '',
      requestLimitDate: invoiceIntegratorDetail?.requestLimitDate
        ? new Date(invoiceIntegratorDetail.requestLimitDate).toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : '',
    };
  }, [invoiceIntegratorDetail, invoiceIntegrator]);

  // Handle form submission
  const handleSubmit = (data: EInvoiceStatusFormData) => {
    onSubmit(data);
  };

  // Reset form to initial values
  const resetForm = () => {
    form.reset(initialValues);
  };

  return {
    form,
    schema,
    displayData,
    handleSubmit,
    resetForm,
    // Form state helpers
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    errors: form.formState.errors,
  };
}
