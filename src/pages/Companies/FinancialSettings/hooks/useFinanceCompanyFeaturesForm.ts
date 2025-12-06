import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useGetProductTypesQuery } from '../../companies.api';
import type { FinancerDetailModel } from '../financial-settings.types';

interface FinanceCompanyFeaturesFormData {
  ProductTypes: number[];
  IsDirectApprove: boolean;
  IsEnableForTFS: boolean;
  IsEnableForKF: boolean;
  IsEnableForSpot: boolean;
  IsEnableForSpotWithoutInvoice: boolean;
  IsEnableForAF: boolean;
  IsEnableForRC: boolean;
  IsDigitalApproved: boolean;
  IsManualPaymentApproved: boolean;
  IsDigitalConfirmationTextRequired: boolean;
  IsInvoiceBasedCalculation: boolean;
  IsVatRateVisible: boolean;
}

interface UseFinanceCompanyFeaturesFormProps {
  initialData?: Partial<FinancerDetailModel>;
}

/**
 * Custom hook for Finance Company Features form management
 * Following OperationPricing patterns with Form component integration
 */
export const useFinanceCompanyFeaturesForm = ({ initialData }: UseFinanceCompanyFeaturesFormProps) => {
  // Fetch product types for dropdown
  const { data: productTypesData = [] } = useGetProductTypesQuery();

  // Transform product types data for select field
  const productTypeOptions = useMemo(() => {
    return productTypesData.map((type) => ({
      value: parseInt(type.Value),
      label: type.Description,
    }));
  }, [productTypesData]);

  // Initial form values
  const initialValues: FinanceCompanyFeaturesFormData = useMemo(
    () => ({
      ProductTypes: initialData?.ProductTypes || [],
      IsDirectApprove: initialData?.IsDirectApprove || false,
      IsEnableForTFS: initialData?.IsEnableForTFS || false,
      IsEnableForKF: initialData?.IsEnableForKF || false,
      IsEnableForSpot: initialData?.IsEnableForSpot || false,
      IsEnableForSpotWithoutInvoice: initialData?.IsEnableForSpotWithoutInvoice || false,
      IsEnableForAF: initialData?.IsEnableForAF || false,
      IsEnableForRC: initialData?.IsEnableForRC || false,
      IsDigitalApproved: initialData?.IsDigitalApproved || false,
      IsManualPaymentApproved: initialData?.IsManualPaymentApproved || false,
      IsDigitalConfirmationTextRequired: initialData?.IsDigitalConfirmationTextRequired || false,
      IsInvoiceBasedCalculation: initialData?.IsInvoiceBasedCalculation || false,
      IsVatRateVisible: initialData?.IsVatRateVisible || false,
    }),
    [initialData],
  );

  // Form schema with labels matching reference project
  const schema = useMemo(
    () =>
      yup.object({
        ProductTypes: fields
          .multipleSelect(productTypeOptions, 'number', ['value', 'label'])
          .label('Çalışılan Ürünler')
          .meta({ col: 12 }),

        IsDirectApprove: fields.switchField.label('Faiz oranı tanımlama otomatik onaylansın mı?').meta({ col: 6 }),

        IsEnableForTFS: fields.switchField.label('TFS Aktif mi?').meta({ col: 6 }),

        IsEnableForKF: fields.switchField.label('Fatura Finansmanı Aktif mi?').meta({ col: 6 }),

        IsEnableForSpot: fields.switchField.label('Faturalı Spot Kredi Aktif mi?').meta({ col: 6 }),

        IsEnableForSpotWithoutInvoice: fields.switchField.label('Faturasız Spot Kredi Aktif mi?').meta({ col: 6 }),

        IsEnableForAF: fields.switchField.label('Alacak Finansmanı Aktif mi?').meta({ col: 6 }),

        IsEnableForRC: fields.switchField.label('Rotatif Kredi Aktif mi?').meta({ col: 6 }),

        IsDigitalApproved: fields.switchField.label('ABF dijital onaylanır mı ?').meta({ col: 6 }),

        IsManualPaymentApproved: fields.switchField.label('Manuel Ödeme Alındı Aktif mi?').meta({ col: 6 }),

        IsDigitalConfirmationTextRequired: fields.switchField
          .label('Dijital Onay Metni Onaylanır mı?')
          .meta({ col: 6 }),

        IsInvoiceBasedCalculation: fields.switchField.label('Fatura bazlı hesaplama mı?').meta({ col: 6 }),

        IsVatRateVisible: fields.switchField.label('KDV Tutarı gösterilir mi?').meta({ col: 6 }),
      }),
    [productTypeOptions],
  );

  // Create form instance
  const form = useForm<FinanceCompanyFeaturesFormData>({
    defaultValues: initialValues,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
};
