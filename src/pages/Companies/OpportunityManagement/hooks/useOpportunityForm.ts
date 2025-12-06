/**
 * Opportunity Form Hook
 * Following LeadManagement pattern for create/edit forms
 *
 * Key Features:
 * - Schema-based field definitions with Yup validation
 * - Support for both create and edit modes
 * - Pre-population of form data for edit mode
 * - Two sections: Genel Bilgiler and Teklif Bilgileri
 * - Conditional field visibility (isReceiverInPortal)
 * - Auto-calculated fields
 *
 * Reference Implementation: pages/Companies/LeadManagement/hooks/useLeadAddManuelForm.ts
 * Documentation: .github/instructions/forms.instructions.md
 */

import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useOpportunityDropdownData } from './useOpportunityDropdownData';

/** Form values type - matches defaultValues structure */
export interface OpportunityFormValues {
  // Genel Bilgiler
  subject: string;
  isReceiverInPortal: string;
  receiverId: number | null;
  receiverName: string;
  customerManagerId: number | string; // Required field - not nullable
  description: string;
  salesScenario: string | null;
  statusDescription: string; // Required field - not nullable
  winningStatus: string | null;
  closedDate: string;
  lastMeetingDate: string;
  productType: number | string; // Required field - not nullable
  currency: string;
  estimatedLimit: number | null;
  estimatedMonthlyVolume: number | null;
  supplierCount: number | null;
  takeRate: number | null;
  estimatedMonthlyRevenue: number | null;
  estimatedClosingDate: string;
  // Teklif Bilgileri
  offerDate: string;
  offerQuantity: number | null;
  offerUnitPrice: number | null;
  offerTotalAmount: number | null;
}

/**
 * Custom hook for managing opportunity form state and validation
 * Used for both create and edit operations
 */
function useOpportunityForm() {
  // Fetch dropdown data for form fields
  const {
    customerManagerList,
    productTypeList,
    receiverList,
    statusOptions,
    salesScenarioOptions,
    winningStatusOptions,
  } = useOpportunityDropdownData();

  // Currency options for dropdown
  const currencyOptions = useMemo(
    () => [
      { Value: 'TRY', Description: 'TRY' },
      { Value: 'USD', Description: 'USD' },
      { Value: 'EUR', Description: 'EUR' },
    ],
    [],
  );

  // Default form values
  const defaultValues: OpportunityFormValues = {
    // Genel Bilgiler
    subject: '',
    isReceiverInPortal: '',
    receiverId: null,
    receiverName: '',
    customerManagerId: '', // Required - empty string for initial state
    description: '',
    salesScenario: null,
    statusDescription: '', // Required - empty string for initial state
    winningStatus: null,
    closedDate: '',
    lastMeetingDate: '',
    productType: '', // Required - empty string for initial state
    currency: 'TRY',
    estimatedLimit: null,
    estimatedMonthlyVolume: null,
    supplierCount: null,
    takeRate: null,
    estimatedMonthlyRevenue: null,
    estimatedClosingDate: '',
    // Teklif Bilgileri
    offerDate: '',
    offerQuantity: null,
    offerUnitPrice: null,
    offerTotalAmount: null,
  };

  /**
   * Genel Bilgiler Schema Factory
   * Creates schema with conditional visibility based on isReceiverInPortal value
   */
  const createGeneralInfoSchema = useCallback(
    (isReceiverInPortalValue: string) => {
      // Both fields hidden when no selection made (empty string)
      const showReceiverDropdown = isReceiverInPortalValue === 'true';
      const showReceiverInput = isReceiverInPortalValue === 'false';

      return yup.object({
        // Konu - Required
        subject: fields.text.required('Konu zorunludur').label('Konu').meta({
          col: 6,
        }),

        // Alıcı Bilgisi Portalde Var mı? - Required (radio-like selection)
        isReceiverInPortal: fields
          .select(
            [
              { Value: 'true', Description: 'Evet' },
              { Value: 'false', Description: 'Hayır' },
            ],
            'string',
            ['Value', 'Description'],
          )
          .required('Bu alan zorunludur')
          .label('Alıcı Bilgisi Portalde Var mı?')
          .meta({
            col: 6,
            showSelectOption: true,
          }),

        // Alıcı Dropdown (visible only when isReceiverInPortal = 'true')
        receiverId: fields.select(receiverList, 'number', ['Id', 'CompanyName']).nullable().label('Alıcı').meta({
          col: 6,
          showSelectOption: true,
          visible: showReceiverDropdown,
        }),

        // Alıcı Adı Input (visible only when isReceiverInPortal = 'false')
        receiverName: fields.text.label('Alıcı Adı').meta({
          col: 6,
          visible: showReceiverInput,
        }),

        // Müşteri Temsilcisi - Required
        customerManagerId: fields
          .select(customerManagerList, 'number', ['Id', 'FullName'])
          .label('Müşteri Temsilcisi')
          .required('Müşteri temsilcisi zorunludur')
          .meta({
            col: 6,
            showSelectOption: true,
          }),

        // Açıklama
        description: fields.text.optional().label('Açıklama').meta({
          col: 6,
        }),

        // Satış Senaryosu
        salesScenario: fields
          .select(salesScenarioOptions, 'string', ['Value', 'Description'])
          .optional()
          .nullable()
          .label('Satış Senaryosu')
          .meta({
            col: 6,
            showSelectOption: true,
          }),

        // Durum Açıklaması - Required
        statusDescription: fields
          .select(statusOptions, 'string', ['Value', 'Description'])
          .label('Durum Açıklaması')
          .required('Durum açıklaması zorunludur')
          .meta({
            col: 6,
            showSelectOption: true,
          }),

        // Statü (Kazanıldı/Kaybedildi) - Disabled, only display
        winningStatus: fields
          .select(winningStatusOptions, 'string', ['Value', 'Description'])
          .optional()
          .nullable()
          .label('Statü')
          .meta({
            col: 6,
            disabled: true,
          }),

        // Kapanış Tarihi - Disabled, auto-set when status changes
        closedDate: fields.date.optional().nullable().label('Kapanış Tarihi').meta({
          col: 6,
          disabled: true,
        }),

        // Son Toplantı Tarihi
        lastMeetingDate: fields.date.optional().nullable().label('Son Toplantı Tarihi').meta({
          col: 6,
        }),

        // İlgilendiği Ürün - Required
        productType: fields
          .select(productTypeList, 'number', ['Value', 'Description'])
          .label('İlgilendiği Ürün')
          .required('İlgilendiği ürün zorunludur')
          .meta({
            col: 6,
            showSelectOption: true,
          }),

        // Para Birimi
        currency: fields
          .select(currencyOptions, 'string', ['Value', 'Description'])
          .optional()
          .label('Para Birimi')
          .meta({
            col: 6,
          }),

        // Tahmini Limit
        estimatedLimit: fields.currency.optional().nullable().label('Tahmini Limit').meta({
          col: 6,
        }),

        // Tahmini Aylık İşlem Hacmi
        estimatedMonthlyVolume: fields.currency.optional().nullable().label('Tahmini Aylık İşlem Hacmi').meta({
          col: 6,
        }),

        // Tedarikçi Sayısı
        supplierCount: fields.number.optional().nullable().label('Tedarikçi Sayısı').meta({
          col: 6,
        }),

        // Take Rate (%)
        takeRate: fields.number.optional().nullable().label('Take Rate (%)').max(100).min(0).meta({
          col: 6,
          inputType: 'number',
        }),

        // Tahmini Aylık Gelir - Auto-calculated (disabled)
        estimatedMonthlyRevenue: fields.currency.optional().nullable().label('Tahmini Aylık Gelir').meta({
          col: 6,
          readonly: true,
          helperText: 'Tahmini Aylık İşlem Hacmi × Take Rate',
        }),

        // Tahmini Kapanış Tarihi
        estimatedClosingDate: fields.date.optional().nullable().label('Tahmini Kapanış Tarihi').meta({
          col: 6,
        }),
      });
    },
    [
      customerManagerList,
      productTypeList,
      receiverList,
      statusOptions,
      salesScenarioOptions,
      winningStatusOptions,
      currencyOptions,
    ],
  );

  // Initial schema with default visibility (no selection made yet)
  const generalInfoSchema = useMemo(() => createGeneralInfoSchema(''), [createGeneralInfoSchema]);

  /**
   * Teklif Bilgileri Schema
   */
  const offerInfoSchema = useMemo(() => {
    return yup.object({
      // Teklif Tarihi
      offerDate: fields.date.optional().nullable().label('Teklif Tarihi').meta({
        col: 6,
      }),

      // Adet
      offerQuantity: fields.number.optional().nullable().label('Adet').meta({
        col: 6,
      }),

      // Birim Fiyat
      offerUnitPrice: fields.currency.optional().nullable().label('Birim Fiyat').meta({
        col: 6,
      }),

      // Toplam Tutar - Auto-calculated (disabled)
      offerTotalAmount: fields.currency.optional().nullable().label('Toplam Tutar').meta({
        col: 6,
        readonly: true,
        helperText: 'Adet × Birim Fiyat',
      }),
    });
  }, []);

  // Combined schema for form validation
  const schema = useMemo(() => {
    return generalInfoSchema.concat(offerInfoSchema);
  }, [generalInfoSchema, offerInfoSchema]);

  // Initialize form with React Hook Form and Yup resolver
  const form = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Watch fields for auto-calculation and conditional visibility
  const estimatedMonthlyVolume = useWatch({ control: form.control, name: 'estimatedMonthlyVolume' });
  const takeRate = useWatch({ control: form.control, name: 'takeRate' });
  const offerQuantity = useWatch({ control: form.control, name: 'offerQuantity' });
  const offerUnitPrice = useWatch({ control: form.control, name: 'offerUnitPrice' });
  const isReceiverInPortal = useWatch({ control: form.control, name: 'isReceiverInPortal' });

  // Dynamic schema with conditional visibility for receiver fields
  const dynamicGeneralInfoSchema = useMemo(
    () => createGeneralInfoSchema(String(isReceiverInPortal)),
    [createGeneralInfoSchema, isReceiverInPortal],
  );

  // Combined dynamic schema for rendering (includes visibility)
  const dynamicSchema = useMemo(() => {
    return dynamicGeneralInfoSchema.concat(offerInfoSchema);
  }, [dynamicGeneralInfoSchema, offerInfoSchema]);

  // Auto-calculate Tahmini Aylık Gelir = Tahmini Aylık İşlem Hacmi * Take Rate
  useEffect(() => {
    if (estimatedMonthlyVolume && takeRate) {
      const revenue = estimatedMonthlyVolume * takeRate;
      form.setValue('estimatedMonthlyRevenue', revenue);
    } else {
      form.setValue('estimatedMonthlyRevenue', null);
    }
  }, [estimatedMonthlyVolume, takeRate, form]);

  // Auto-calculate Toplam Tutar = Adet * Birim Fiyat
  useEffect(() => {
    if (offerQuantity && offerUnitPrice) {
      const total = offerQuantity * offerUnitPrice;
      form.setValue('offerTotalAmount', total);
    } else {
      form.setValue('offerTotalAmount', null);
    }
  }, [offerQuantity, offerUnitPrice, form]);

  // Clear receiver fields when isReceiverInPortal changes
  useEffect(() => {
    if (isReceiverInPortal === 'true') {
      form.setValue('receiverName', '');
    } else {
      form.setValue('receiverId', null);
    }
  }, [isReceiverInPortal, form]);

  // Get conditional visibility state
  const getConditionalState = useCallback(() => {
    return {
      showReceiverDropdown: isReceiverInPortal === 'true',
      showReceiverInput: isReceiverInPortal === 'false',
    };
  }, [isReceiverInPortal]);

  return {
    form,
    schema,
    generalInfoSchema: dynamicGeneralInfoSchema, // Dynamic schema with visibility
    offerInfoSchema,
    dynamicSchema, // Combined dynamic schema for Form component
    getConditionalState,
    isReceiverInPortal,
  };
}

export default useOpportunityForm;
