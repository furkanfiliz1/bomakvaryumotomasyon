import { Form } from '@components';
import { Card, CardContent, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductTypesList } from '../constants';
import { extractIdentifierFromFormValue } from '../helpers/operation-charge-form.helpers';
import { createOperationChargeFormSchema } from '../helpers/operation-charge-form.schema';
import { useOperationChargeDropdownData } from '../hooks';
import type { OperationChargeAmount, OperationChargeFormData } from '../operation-charge.types';
import { OperationChargeAmountsTable } from './OperationChargeAmountsTable';

interface OperationChargeFormProps {
  form: UseFormReturn<OperationChargeFormData>;
  disabled?: boolean;
  isEditMode?: boolean; // Edit mode flag - when true, main form fields are disabled (matching old project)
}

interface OperationChargeFormWithAmountsProps extends OperationChargeFormProps {
  onSubmit?: () => void;
  amounts?: OperationChargeAmount[];
  onAmountsChange?: (amounts: OperationChargeAmount[]) => void;
  onSave?: (data: unknown) => void;
  onDeleteSuccess?: () => void;
  operationChargeId?: number;
}

/**
 * Operation Charge Form Component using built-in Form component
 * Follows OperationPricing patterns and project form standards
 */
export const OperationChargeForm: React.FC<OperationChargeFormProps> = ({
  form,
  disabled = false,
  isEditMode = false,
}) => {
  // Note: disabled prop is used in the WithAmounts version to pass to OperationChargeAmountsTable
  void disabled; // Suppress unused variable warning - used by parent component
  const {
    productTypes,
    integratorStatus,
    transactionTypes,
    sellersCompanySearchResults,
    buyersCompanySearchResults,
    financierCompanies, // Changed from search results to direct list
    searchSellersByCompanyNameOrIdentifier,
    searchBuyersByCompanyNameOrIdentifier,
    isSellersSearchLoading,
    isBuyersSearchLoading,
  } = useOperationChargeDropdownData();

  // Watch ProductType for conditional disabling logic
  const currentProductType = form.watch('ProductType');

  // Clear disabled fields when ProductType changes (matching old project behavior)
  useEffect(() => {
    const isFinancingProduct =
      String(currentProductType) === String(ProductTypesList.SUPPLIER_FINANCING) ||
      String(currentProductType) === String(ProductTypesList.RECEIVER_FINANCING);

    if (isFinancingProduct) {
      // Clear financer fields when financing product is selected
      form.setValue('FinancerIdentifier', []); // Changed to empty array for multiple select
      form.setValue('OperationChargeDefinitionType', '');
    } else {
      // Clear receiver field when non-financing product is selected
      form.setValue('ReceiverIdentifier', '');
    }
  }, [currentProductType, form]);

  // Schema is now handled by useOperationChargeForm hook
  // No need to create schema here as it conflicts with hook's schema

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Genel Bilgiler
        </Typography>

        {/* Form needs its own schema for rendering fields */}
        {/* Hook's schema is for validation, this is for field rendering */}
        <Form
          form={form}
          schema={createOperationChargeFormSchema(
            productTypes,
            integratorStatus.map((item) => ({ value: String(item.value), label: item.label })),
            transactionTypes,
            sellersCompanySearchResults,
            buyersCompanySearchResults,
            financierCompanies, // Changed from search results to direct list
            searchSellersByCompanyNameOrIdentifier,
            searchBuyersByCompanyNameOrIdentifier,
            isSellersSearchLoading,
            isBuyersSearchLoading,
            currentProductType,
            isEditMode,
          )}
          space={2}
        />

        {/* Hidden fields to maintain compatibility */}
        <input type="hidden" {...form.register('PaymentType')} value={1} />
        <input type="hidden" {...form.register('ChargeCompanyType')} value={1} />
      </CardContent>
    </Card>
  );
};

// Create a separate component for the full form with amounts
export const OperationChargeFormWithAmounts: React.FC<OperationChargeFormWithAmountsProps> = (props) => {
  return (
    <>
      <OperationChargeForm {...props} />
      {props.onAmountsChange && (
        <OperationChargeAmountsTable
          amounts={props.amounts ?? []}
          onAmountsChange={props.onAmountsChange}
          productType={props.form.watch('ProductType')}
          transactionType={props.form.watch('TransactionType')}
          disabled={props.disabled}
          senderIdentifier={extractIdentifierFromFormValue(props.form.watch('SenderIdentifier'))}
          receiverIdentifiers={
            props.form.watch('ReceiverIdentifier')
              ? [extractIdentifierFromFormValue(props.form.watch('ReceiverIdentifier'))]
              : []
          }
          financerIdentifiers={
            props.form.watch('FinancerIdentifier') && props.form.watch('FinancerIdentifier').length > 0
              ? props.form.watch('FinancerIdentifier') // Already an array for multiple select
              : []
          }
          paymentType={props.form.watch('PaymentType')}
          chargeCompanyType={props.form.watch('ChargeCompanyType')}
          isDaily={props.form.watch('IsDaily')}
          onSave={props.onSave}
          parentForm={props.form}
          onDeleteSuccess={props.onDeleteSuccess}
          operationChargeId={props.operationChargeId}
        />
      )}
    </>
  );
};
