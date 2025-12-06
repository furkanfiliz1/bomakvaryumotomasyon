/**
 * Company Limit Infos Form Hook
 * Custom hook for managing company limit information form
 * Matches legacy CompanyLimitInfos.js form behavior exactly
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import dayjs from 'dayjs';
import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import type { CompanyLimitInfo } from '../company-limit-tab.types';
import { useCompanyLimitDropdownData } from './useCompanyLimitDropdownData';

/**
 * Custom hook for Company Limit Infos form management
 * Provides form state, validation schema, and form methods
 */
export const useCompanyLimitInfosForm = (companyLimitInfos?: CompanyLimitInfo) => {
  // Get dropdown data for form fields
  const { loanDecisionTypes, limitRejectReasonTypes, fibabankaGuaranteeRates } = useCompanyLimitDropdownData();

  // Initial form values with useMemo for performance
  const initialValues = useMemo(
    () => ({
      creationDate: companyLimitInfos?.InsertedDate
        ? dayjs(companyLimitInfos.InsertedDate).format('DD/MM/YYYY HH:mm')
        : '',
      MaxInvoiceAmount: companyLimitInfos?.MaxInvoiceAmount || 0,
      InvoiceScore: companyLimitInfos?.InvoiceScore || 0,
      FinancialScore: companyLimitInfos?.FinancialScore || 0,
      FibabankaGuaranteeRate: companyLimitInfos?.FibabankaGuaranteeRate || undefined,
      CreditRiskLoanDecision:
        loanDecisionTypes?.find(
          (decision) => Number(decision.Value) === Number(companyLimitInfos?.CreditRiskLoanDecision),
        )?.Description || '-',
      FigoScoreLoanDecision:
        loanDecisionTypes?.find(
          (decision) => Number(decision.Value) === Number(companyLimitInfos?.FigoScoreLoanDecision),
        )?.Description || '-',
      CreditDeskLoanDecision: companyLimitInfos?.CreditDeskLoanDecision || null,
      FinalLoanDecision: companyLimitInfos?.FinalLoanDecision || null,
      IsRisk: companyLimitInfos?.IsRisk || false,
      IsActive: companyLimitInfos?.IsActive || false,
      IsVDMK: companyLimitInfos?.IsVDMK || false,
      LimitRejectReasonType: companyLimitInfos?.LimitRejectReasonType || null,
      CreditTerms: companyLimitInfos?.CreditTerms || '',
    }),
    [companyLimitInfos, loanDecisionTypes],
  );

  // Form validation schema
  const schema = yup.object({
    // Creation Date (Read-only display field)
    creationDate: fields.text.label('Oluşturma Tarihi').meta({
      col: 12,
      disabled: true,
    }),

    // Max Invoice Amount (Currency field)
    MaxInvoiceAmount: fields.currency.required('Maks Fatura Tutarı zorunludur').label('Maks Fatura Tutarı').meta({
      col: 6,
      currency: 'TRY',
    }),

    // Invoice Score
    InvoiceScore: fields.number
      .required('Fatura Skoru zorunludur')
      .min(0, "Fatura Skoru 0'dan küçük olamaz")
      .max(100, "Fatura Skoru 100'den büyük olamaz")
      .label('Fatura Skoru')
      .meta({ col: 6 }),

    // Financial Score
    FinancialScore: fields.number
      .required('Finansal Skor zorunludur')
      .min(0, "Finansal Skor 0'dan küçük olamaz")
      .max(100, "Finansal Skor 100'den büyük olamaz")
      .label('Finansal Skor')
      .meta({ col: 6 }),

    // Fibabanka Guarantee Rate
    FibabankaGuaranteeRate: fields
      .select(fibabankaGuaranteeRates || [], 'number', ['Value', 'Description'])
      .required('Figopara Garantörlük Oranı zorunludur')
      .label('Figopara Garantörlük Oranı (Fibabanka)')
      .nullable()
      .optional()
      .meta({ col: 6, showSelectOption: true }),

    // Credit Risk Loan Decision (Read-only)
    CreditRiskLoanDecision: fields.text.label('Kredi & Risk Sonuç').meta({
      col: 6,
      disabled: true,
    }),

    // Figo Score Loan Decision (Read-only)
    FigoScoreLoanDecision: fields.text.label('Figo Skor Sonuç').meta({
      col: 6,
      disabled: true,
    }),

    // Credit Desk Loan Decision
    CreditDeskLoanDecision: fields
      .select(loanDecisionTypes || [], 'number', ['Value', 'Description'])
      .nullable()
      .label('Credit-Desk Kararı')
      .meta({ col: 6 }),

    // Final Loan Decision
    FinalLoanDecision: fields
      .select(loanDecisionTypes || [], 'number', ['Value', 'Description'])
      .nullable()
      .label('Nihai Karar')
      .meta({ col: 6 }),

    // Risk Switch
    IsRisk: fields.switchField
      .label('Şirket Riskli mi?')
      .meta({ col: 4, mt: 3, mb: 3, labelPlacement: 'start', spaceBetween: false, display: 'start' }),

    // Active Switch
    IsActive: fields.switchField
      .label('Limit Aktif mi?')
      .meta({ col: 4, mt: 3, mb: 3, spaceBetween: false, labelPlacement: 'start' }),

    // VDMK Switch
    IsVDMK: fields.switchField
      .label('VDMK mi?')
      .meta({ col: 4, mt: 3, mb: 3, spaceBetween: false, labelPlacement: 'start' }),

    // Limit Reject Reason
    LimitRejectReasonType: fields
      .select(limitRejectReasonTypes || [], 'number', ['Value', 'Description'])
      .nullable()
      .label('Red / Olumsuz nedeni')
      .meta({ col: 6 }),

    // Credit Terms
    CreditTerms: fields.text.nullable().label('Kredi Koşulları').meta({
      col: 6,
    }),
  });

  // Create form with validation
  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Update form values when data changes
  useEffect(() => {
    if (companyLimitInfos || loanDecisionTypes) {
      form.reset(initialValues);
    }
  }, [companyLimitInfos, loanDecisionTypes, initialValues, form]);

  return {
    form,
    schema,
  };
};
