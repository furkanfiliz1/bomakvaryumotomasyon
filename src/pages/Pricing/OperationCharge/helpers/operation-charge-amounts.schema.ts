import { fields } from '@components';
import yup from '@validation';
import { OPERATION_CHARGE_DEFINITION_TYPE_OPTIONS } from '../constants';
import type { NewOperationChargeAmountFormData } from '../operation-charge.types';

/**
 * Operation Charge Amounts Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 */
export const createOperationChargeAmountsSchema = (
  isAmountType: boolean,
  isScoreFieldsDisabled: boolean,
  transactionType?: string,
  currentAmountType?: number,
) => {
  // Conditional disabling logic for ProrationDays based on TransactionType (matching old project)
  // When TransactionType = 2, ProrationDays should be disabled
  const isProrationDisabled = String(transactionType) === '2';

  // Determine which fee fields to show based on amountType
  // 1 = Birim (Unit) -> Show TransactionFee (Birim)
  // 2 = Yüzde (Percentage) -> Show PercentFee (%)
  const showTransactionFee = currentAmountType === 1; // Birim
  const showPercentFee = currentAmountType === 2; // Yüzde
  const baseSchema = {
    // Score Fields - disabled when score fields are disabled
    MinScore: isScoreFieldsDisabled
      ? fields.number.meta({ col: 1, visible: false })
      : fields.number
          .label('Min. Skor')
          .required('Min. Skor girilmesi zorunludur')
          .meta({
            col: 1,
            inputProps: { max: 99 },
          })
          .test('max-score', 'Maksimum 99 olabilir', (value) => !value || value < 100),

    MaxScore: isScoreFieldsDisabled
      ? fields.number.meta({ col: 1, visible: false })
      : fields.number
          .label('Max. Skor')
          .required('Max. Skor girilmesi zorunludur')
          .meta({
            col: 1,
            inputProps: { max: 100 },
          })
          .test('max-score', 'Maksimum 100 olabilir', (value) => !value || value <= 100),

    // Fee Fields - Ücretlendirme Tipi (Birim/Yüzde)
    amountType: fields
      .select(OPERATION_CHARGE_DEFINITION_TYPE_OPTIONS, 'number', ['value', 'label'])
      .label('Ücretlendirme Tipi')
      .meta({
        col: 2,
      }),

    // Conditionally show PercentFee only when Yüzde (2) is selected
    ...(showPercentFee && {
      PercentFee: fields.number.label('İşlem Ücreti (%)').meta({
        col: 2,
        inputProps: {
          type: 'number',
          step: '0.01',
        },
        InputProps: {
          endAdornment: '%',
        },
      }),
    }),

    // Conditionally show TransactionFee only when Birim (1) is selected
    ...(showTransactionFee && {
      TransactionFee: fields.currency.label('İşlem Ücreti (Birim)').meta({ col: 2, currency: 'TRY' }),
    }),

    // Proration Days - disabled when TransactionType = 2 (matching old project logic)
    ProrationDays: fields.number
      .nullable()
      .label('Bölünecek Gün Sayısı')
      .meta({
        col: 1,
        inputProps: { type: 'number' },
        disabled: isProrationDisabled,
      }),

    // amountType - Ücretlendirme Tipi (Birim/Yüzde)
  };

  // Add amount-type specific fields
  if (isAmountType) {
    return yup.object({
      // Amount Fields
      MinAmount: fields.currency
        .label('Min. Tutar')
        .required('Min. Tutar girilmesi zorunludur')
        .min(0, 'Min. Tutar 0 veya daha büyük olmalıdır')
        .meta({ col: 2, currency: 'TRY' })
        .test('min-max-amount', "Max. Tutar, Min. Tutar'dan büyük veya eşit olmalıdır", function (value) {
          const maxAmount = this.parent.MaxAmount;
          return !value || !maxAmount || maxAmount >= value;
        }),

      MaxAmount: fields.currency
        .label('Max. Tutar')
        .required('Max. Tutar girilmesi zorunludur')
        .min(0, 'Max. Tutar 0 veya daha büyük olmalıdır')
        .meta({ col: 2, currency: 'TRY' }),

      ...baseSchema,
    }) as yup.ObjectSchema<NewOperationChargeAmountFormData>;
  } else {
    return yup.object({
      // Due Day Fields
      MinDueDay: fields.number
        .label('Min. Vade Günü')
        .required('Min. Vade Günü girilmesi zorunludur')
        .min(0, 'Min. Vade Günü 0 veya pozitif olmalıdır')
        .meta({
          col: 2,
          inputProps: { type: 'number', min: 0 },
        })
        .test('min-max-day', "Max. Vade Günü, Min. Vade Günü'nden büyük olmalıdır", function (value) {
          const maxDueDay = this.parent.MaxDueDay;
          return !value || !maxDueDay || maxDueDay >= value;
        }),

      MaxDueDay: fields.number
        .label('Max. Vade Günü')
        .required('Max. Vade Günü girilmesi zorunludur')
        .min(0, 'Max. Vade Günü 0 veya pozitif olmalıdır')
        .meta({
          col: 2,
          inputProps: { type: 'number', min: 0 },
        }),

      ...baseSchema,
    }) as yup.ObjectSchema<NewOperationChargeAmountFormData>;
  }
};

export type OperationChargeAmountsSchema = ReturnType<typeof createOperationChargeAmountsSchema>;
