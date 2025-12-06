import { fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { initialFinancerFigoFinans } from './useFinancerData';

interface FormData {
  FinancerIdentifier: string;
  OperationChargeDefinitionType: string;
  IsDaily: boolean;
  amountType: number; // 1: Unit, 2: Percent
  PercentFee: number;
  TransactionFee: number;
}

interface UseTransactionFeeFormProps {
  initialData?: Partial<FormData>;
  financiers?: Array<{ value: string; label: string }>;
  integratorStatus?: Array<{ value: string; label: string }>;
}

// Amount type options for pricing type dropdown
const AMOUNT_TYPE_OPTIONS = [
  { value: 2, label: 'Yüzde' },
  { value: 1, label: 'Birim' },
];

export function useTransactionFeeForm({
  initialData,
  financiers = [],
  integratorStatus = [],
}: UseTransactionFeeFormProps) {
  const defaultValues: FormData = {
    FinancerIdentifier: initialFinancerFigoFinans.value, // Set Figo Finans as default
    OperationChargeDefinitionType: '',
    IsDaily: true,
    amountType: 2, // Default to percentage
    PercentFee: 0,
    TransactionFee: 0,
    ...initialData,
  };

  // Form schema using the custom fields system
  const schema = useMemo(() => {
    return yup.object({
      FinancerIdentifier: fields
        .select(financiers, 'string', ['value', 'label'])
        .required('Finansör seçimi zorunludur')
        .label('Finansör')
        .meta({ col: 6 }),

      OperationChargeDefinitionType: fields
        .select(integratorStatus, 'string', ['value', 'label'])
        .required('Entegratör durumu seçilmelidir')
        .label('Entegratör Durumu')
        .meta({ col: 6 }),

      amountType: fields
        .select(AMOUNT_TYPE_OPTIONS, 'number', ['value', 'label'])
        .required('Ücretlendirme tipi seçilmelidir')
        .label('Ücretlendirme Tipi')
        .meta({ col: 6 }),

      PercentFee: fields.currency
        .when('amountType', {
          is: 2,
          then: (schema) => schema.required('Yüzde ücret zorunludur').min(0.01, "Yüzde ücret 0'dan büyük olmalıdır"),
          otherwise: (schema) => schema.nullable(),
        })
        .label('İşlem Ücreti (Yüzde)')
        .meta({ col: 6, currency: '%', visible: false }),

      TransactionFee: fields.currency
        .when('amountType', {
          is: 1,
          then: (schema) => schema.required('Birim ücret zorunludur').min(0.01, "Birim ücret 0'dan büyük olmalıdır"),
          otherwise: (schema) => schema.nullable(),
        })
        .label('İşlem Ücreti (Birim)')
        .meta({ col: 6, currency: 'TRY', visible: false }),

      IsDaily: fields.switchField.label('Günlük Ücretlendirme').meta({ col: 6 }),
    });
  }, [financiers, integratorStatus]);

  const form = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Watch for changes to re-create schema with updated field visibility
  const amountType = form.watch('amountType');

  // Re-create schema with updated field visibility
  const updatedSchema = useMemo(() => {
    return yup.object({
      FinancerIdentifier: fields
        .select(financiers, 'string', ['value', 'label'])
        .required('Finansör seçimi zorunludur')
        .label('Finansör')
        .meta({ col: 6 }),

      OperationChargeDefinitionType: fields
        .select(integratorStatus, 'string', ['value', 'label'])
        .required('Entegratör durumu seçilmelidir')
        .label('Entegratör Durumu')
        .meta({ col: 6 }),

      amountType: fields
        .select(AMOUNT_TYPE_OPTIONS, 'number', ['value', 'label'])
        .required('Ücretlendirme tipi seçilmelidir')
        .label('Ücretlendirme Tipi')
        .meta({ col: 6 }),

      PercentFee: fields.currency
        .when('amountType', {
          is: 2,
          then: (schema) => schema.required('Yüzde ücret zorunludur').min(0.01, "Yüzde ücret 0'dan büyük olmalıdır"),
          otherwise: (schema) => schema.nullable(),
        })
        .label('İşlem Ücreti (Yüzde)')
        .meta({ col: 6, currency: '%', visible: amountType === 2 }),

      TransactionFee: fields.currency
        .when('amountType', {
          is: 1,
          then: (schema) => schema.required('Birim ücret zorunludur').min(0.01, "Birim ücret 0'dan büyük olmalıdır"),
          otherwise: (schema) => schema.nullable(),
        })
        .label('İşlem Ücreti (Birim)')
        .meta({ col: 6, currency: 'TRY', visible: amountType === 1 }),

      IsDaily: fields.switchField.label('Günlük Ücretlendirme').meta({ col: 6 }),
    });
  }, [financiers, integratorStatus, amountType]);

  return { form, schema: updatedSchema };
}
