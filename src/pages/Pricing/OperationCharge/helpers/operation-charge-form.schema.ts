import { fields } from '@components';
import yup from '@validation';
import { AnyObject } from 'yup';
import { ProductTypesList } from '../constants';
import type { OperationChargeFormData } from '../operation-charge.types';

/**
 * Operation Charge Form Schema using built-in Form component patterns
 * Following OperationPricing schema structure and project form standards
 */
export const createOperationChargeFormSchema = (
  productTypes: Array<{ label: string; value: string }> = [],
  integratorStatus: Array<{ label: string; value: string }> = [],
  transactionTypes: Array<{ label: string; value: string }> = [],
  sellersCompanySearchResults: Array<{ label: string; value: string }> = [],
  buyersCompanySearchResults: Array<{ label: string; value: string }> = [],
  financierCompanies: Array<{ label: string; value: string }> = [], // Changed from search results to direct list
  searchSellersByCompanyNameOrIdentifier?: (searchValue: string) => Promise<void>,
  searchBuyersByCompanyNameOrIdentifier?: (searchValue: string) => Promise<void>,
  isSellersSearchLoading?: boolean,
  isBuyersSearchLoading?: boolean,
  currentProductType?: string, // Current ProductType value for conditional disabling
  isEditMode?: boolean, // Edit mode flag - when true, main form fields are disabled (matching old project)
) => {
  // Conditional disabling logic based on ProductType (matching old project)
  // When ProductType is SUPPLIER_FINANCING (2) OR RECEIVER_FINANCING (7), certain fields should be disabled
  // Note: ReceiverIdentifier is now only required when ProductType is SUPPLIER_FINANCING
  const isFinancingProduct =
    String(currentProductType) === String(ProductTypesList.SUPPLIER_FINANCING) ||
    String(currentProductType) === String(ProductTypesList.RECEIVER_FINANCING);

  // Edit mode disabling logic (matching old project inputDisabled pattern)
  // In edit mode, core form fields should be disabled to prevent changes to key identifiers
  const isEditModeDisabled = Boolean(isEditMode);

  return yup.object({
    // Product Type - Required dropdown (disabled in edit mode - matching old project inputDisabled)
    ProductType: fields
      .select(productTypes, 'string', ['value', 'label'])
      .label('Ürün Tipi')
      .meta({ col: 3, disabled: isEditModeDisabled }),

    // Sender Identifier - AsyncAutoComplete for company search (Changed from "Tedarikçi" to "Satıcı")
    // In edit mode, show as disabled text field; otherwise AsyncAutoComplete
    // Always required regardless of ProductType
    SenderIdentifier: isEditModeDisabled
      ? fields.text.label('Satıcı VKN/Ünvan').meta({ col: 3, disabled: true })
      : fields
          .asyncAutoComplete(
            sellersCompanySearchResults,
            'string',
            ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
            searchSellersByCompanyNameOrIdentifier,
            isSellersSearchLoading,
            3,
          )
          .label('Satıcı VKN/Ünvan')
          .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' }),

    // Receiver Identifier - AsyncAutoComplete for company search
    // In edit mode, show as disabled text field; otherwise AsyncAutoComplete with conditional disabling
    // Required only when ProductType is SUPPLIER_FINANCING (Tedarikçi Finansmanı)
    ReceiverIdentifier: isEditModeDisabled
      ? fields.text.label('Alıcı VKN/Ünvan').meta({ col: 3, disabled: true })
      : String(currentProductType) === String(ProductTypesList.SUPPLIER_FINANCING)
        ? fields
            .asyncAutoComplete(
              buyersCompanySearchResults,
              'string',
              ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
              searchBuyersByCompanyNameOrIdentifier,
              isBuyersSearchLoading,
              3,
            )
            .label('Alıcı VKN/Ünvan')
            .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...' })
        : fields
            .asyncAutoComplete(
              buyersCompanySearchResults,
              'string',
              ['Identifier', (option: AnyObject) => `${option.Identifier} - ${option.CompanyName}`],
              searchBuyersByCompanyNameOrIdentifier,
              isBuyersSearchLoading,
              3,
            )
            .label('Alıcı VKN/Ünvan')
            .meta({ col: 3, placeholder: 'VKN/Ünvan arayın...', disabled: !isFinancingProduct }),

    // Financer Identifier - MultipleSelect for company selection
    // In edit mode, show as disabled text field; otherwise MultipleSelect with conditional disabling
    FinancerIdentifier: isEditModeDisabled
      ? fields.text.label('Finansör VKN/Ünvan').meta({ col: 3, disabled: true })
      : fields
          .multipleSelect(financierCompanies, 'string', ['value', 'label'])
          .label('Finansör VKN/Ünvan')
          .meta({ col: 3, placeholder: 'Finansör seçiniz...', disabled: isFinancingProduct }),

    // Transaction Type - Required dropdown (disabled in edit mode - matching old project inputDisabled)
    TransactionType: fields
      .select(transactionTypes, 'string', ['value', 'label'])
      .label('İşlem Tipi')
      .meta({ col: 4, disabled: isEditModeDisabled }),

    // Operation Charge Definition Type - Always required dropdown
    // Always required regardless of ProductType, but disabled when in edit mode OR when financing products
    OperationChargeDefinitionType: fields
      .select(integratorStatus, 'string', ['value', 'label'])
      .label('Entegratör Durumu')
      .meta({ col: 4, disabled: isEditModeDisabled || isFinancingProduct }),

    // IsDaily - Boolean checkbox (disabled in edit mode - matching old project inputDisabled)
    IsDaily: fields.checkbox.label('Günlük Ücretlendirme').meta({ col: 4, disabled: isEditModeDisabled }),

    // Hidden fields - using number fields with default values
    ChargeCompanyType: fields.number.default(1).meta({ col: 0, visible: false }),

    PaymentType: fields.number.default(1).meta({ col: 0, visible: false }),

    // Note: Validation Rules Summary:
    // - SenderIdentifier (Satıcı VKN/Ünvan): Always required
    // - OperationChargeDefinitionType (Entegratör Durumu): Always required
    // - ReceiverIdentifier (Alıcı VKN/Ünvan): Required only when ProductType is SUPPLIER_FINANCING (Tedarikçi Finansmanı)
    //
    // Additional conditional rules from old project implemented elsewhere:
    // - MinScore/MaxScore: Disabled when financing products (handled in OperationChargeAmountsTable)
    // - ProrationDays: Disabled when TransactionType = 2 (handled in OperationChargeAmountsTable)
    // - Fee amount fields: Disabled based on amountType selection (handled in OperationChargeAmountsTable)
  }) as yup.ObjectSchema<OperationChargeFormData>;
};

export type OperationChargeFormSchema = ReturnType<typeof createOperationChargeFormSchema>;
