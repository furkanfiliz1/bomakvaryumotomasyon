import { Form, Slot, Table, useNotice } from '@components';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Button, Card, CardContent, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { HeadCell } from 'src/components/common/Table/types';
import type { ObjectSchema } from 'yup';
import { createOperationChargeAmountsSchema } from '../helpers/operation-charge-amounts.schema';
import { useOperationChargeAmounts } from '../hooks';
import { useDeleteOperationChargeAmountMutation } from '../operation-charge.api';
import type {
  NewOperationChargeAmountFormData,
  OperationChargeAmount,
  OperationChargeFormData,
} from '../operation-charge.types';

interface OperationChargeAmountsTableProps {
  amounts: OperationChargeAmount[];
  onAmountsChange: (amounts: OperationChargeAmount[]) => void;
  productType?: string;
  transactionType?: string;
  disabled?: boolean;
  // Props for API call
  senderIdentifier?: string;
  receiverIdentifiers?: string[];
  financerIdentifiers?: string[];
  paymentType?: number;
  chargeCompanyType?: number;
  isDaily?: boolean;
  onSave?: (data: unknown) => void;
  // Parent form reference for setting OperationChargeDefinitionType in Genel Bilgiler
  parentForm?: UseFormReturn<OperationChargeFormData>;
  // Callback for successful delete operations
  onDeleteSuccess?: () => void;
  // Operation charge ID for edit mode API calls
  operationChargeId?: number;
}

/**
 * Operation Charge Amounts Table Component using built-in Table component
 */
export const OperationChargeAmountsTable: React.FC<OperationChargeAmountsTableProps> = ({
  amounts,
  onAmountsChange,
  productType = '',
  transactionType = '2',
  disabled = false,
  senderIdentifier = '',
  receiverIdentifiers = [],
  financerIdentifiers = [],
  paymentType = 1,
  chargeCompanyType = 1,
  isDaily = false,
  onSave,
  parentForm,
  onDeleteSuccess,
  operationChargeId,
}) => {
  const notice = useNotice();
  const [deleteOperationChargeAmount, { isLoading: isDeleting }] = useDeleteOperationChargeAmountMutation();

  const { newAmountForm, isAmountType, handleAddAmount, isScoreFieldsDisabled } = useOperationChargeAmounts({
    initialAmounts: amounts,
    productType,
    transactionType,
    onAmountsChange,
    senderIdentifier,
    receiverIdentifiers,
    financerIdentifiers,
    paymentType,
    chargeCompanyType,
    isDaily,
    onSave,
    parentForm,
    operationChargeId,
  });

  // Handle delete with confirmation
  const handleDelete = (row: OperationChargeAmount) => {
    if (!row.Id) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: "Ücret tanımı ID'si bulunamadı.",
        buttonTitle: 'Tamam',
      });
      return;
    }

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Ücret Tanımını Sil',
      message: 'Bu ücret tanımını kalıcı olarak silmek istediğinize emin misiniz?',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: async () => {
        try {
          await deleteOperationChargeAmount(row.Id!).unwrap();

          notice({
            variant: 'success',
            title: 'Başarılı',
            message: 'Ücret tanımı başarıyla silindi.',
            buttonTitle: 'Tamam',
          });

          // Update local state by removing the deleted item
          const updatedAmounts = amounts.filter((amount) => amount.Id !== row.Id);
          onAmountsChange(updatedAmounts);

          // Trigger callback for successful delete (e.g., refetch ChargeHistoryTable)
          onDeleteSuccess?.();
        } catch (error) {
          notice({
            variant: 'error',
            title: 'Hata',
            message: 'Ücret tanımı silinirken bir hata oluştu.',
            buttonTitle: 'Tamam',
          });
        }
      },
      catchOnCancel: true,
    });
  };

  // Watch the current amountType value for dynamic schema updates
  const currentAmountType = newAmountForm.watch('amountType');

  // Create schema with current amount type for conditional field display
  const newAmountSchema = useMemo(
    () => createOperationChargeAmountsSchema(isAmountType, isScoreFieldsDisabled, transactionType, currentAmountType),
    [isAmountType, isScoreFieldsDisabled, transactionType, currentAmountType],
  );

  // Reset fee fields when amountType changes
  useEffect(() => {
    if (currentAmountType !== undefined) {
      // Reset opposing fee field when switching types
      if (currentAmountType === 1) {
        // Switching to Birim (Unit) - reset PercentFee
        newAmountForm.setValue('PercentFee', 0);
      } else if (currentAmountType === 2) {
        // Switching to Yüzde (Percentage) - reset TransactionFee
        newAmountForm.setValue('TransactionFee', 0);
      }
    }
  }, [currentAmountType, newAmountForm]);

  // Define table headers based on amount type
  const tableHeaders: HeadCell[] = React.useMemo(() => {
    const baseHeaders: HeadCell[] = [
      { id: 'MinScore', label: 'Min Skor', width: 100, slot: true },
      { id: 'MaxScore', label: 'Max Skor', width: 100, slot: true },
      // Always show both fee columns in table - users can see all data
      { id: 'PercentFee', label: 'İşlem Ücreti (%)', width: 140, slot: true },
      { id: 'TransactionFee', label: 'İşlem Ücreti (Birim)', width: 160, type: 'currency' },
      { id: 'InsertDate', label: 'Eklenme Tarihi', width: 140, type: 'date' },
      { id: 'ProrationDays', label: 'Bölünecek gün sayısı', width: 140 },
      { id: 'actions', label: '', width: 100, slot: true },
    ];

    if (isAmountType) {
      return [
        { id: 'MinAmount', label: 'Minimum Tutar', width: 120, slot: true, type: 'currency' },
        { id: 'MaxAmount', label: 'Maksimum Tutar', width: 120, slot: true, type: 'currency' },
        ...baseHeaders,
      ];
    } else {
      return [
        { id: 'MinDueDay', label: 'Min Vade Günü', width: 140, slot: true },
        { id: 'MaxDueDay', label: 'Max Vade Günü', width: 140, slot: true },
        ...baseHeaders,
      ];
    }
  }, [isAmountType]);

  const renderAmountForm = (
    form: UseFormReturn<NewOperationChargeAmountFormData>,
    schema: ObjectSchema<NewOperationChargeAmountFormData>,
  ) => {
    const handleManualSubmit = async () => {
      // Get form data and call handleAddAmount (validation is handled in the hook)
      const formData = form.getValues();
      await handleAddAmount(formData);
    };

    return (
      <Box>
        <Form form={form} schema={schema} space={1} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" disabled={disabled} onClick={handleManualSubmit}>
            Kaydet
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Ücret Tanımları
        </Typography>

        {/* Add New Amount Form using built-in Form component */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Yeni Ücret Ekle
          </Typography>
          {renderAmountForm(newAmountForm, newAmountSchema)}
        </Box>

        {/* Built-in Table Component */}
        <Table
          id="operation-charge-amounts-table"
          rowId="Id"
          headers={tableHeaders}
          data={amounts}
          size="small"
          hidePaging
          notFoundConfig={{
            title: 'Henüz ücret tanımı eklenmemiş',
            subTitle: 'Yukarıdaki formu kullanarak yeni ücret ekleyebilirsiniz.',
          }}>
          {/* Custom slot for percentage display */}
          <Slot<OperationChargeAmount> id="PercentFee">
            {(_, row) => {
              if (!row || row.PercentFee === null || row.PercentFee === undefined) return '-';
              return `%${row.PercentFee}`;
            }}
          </Slot>

          {/* Custom slots for amount fields to show 0 instead of "-" */}
          <Slot<OperationChargeAmount> id="MinAmount">
            {(_, row) => {
              if (!row) return '-';
              if (row.MinAmount === null || row.MinAmount === undefined) return '-';
              return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(row.MinAmount);
            }}
          </Slot>

          <Slot<OperationChargeAmount> id="MaxAmount">
            {(_, row) => {
              if (!row) return '-';
              if (row.MaxAmount === null || row.MaxAmount === undefined) return '-';
              return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
              }).format(row.MaxAmount);
            }}
          </Slot>

          {/* Custom slots for due day fields to show 0 instead of "-" */}
          <Slot<OperationChargeAmount> id="MinDueDay">
            {(_, row) => {
              console.log('row.MinDueDay', row?.MinDueDay);
              if (!row) return '0';
              if (row.MinDueDay === null || row.MinDueDay === undefined) return '0';
              return `${row.MinDueDay}`;
            }}
          </Slot>

          <Slot<OperationChargeAmount> id="MaxDueDay">
            {(_, row) => {
              if (!row) return '0';
              if (row.MaxDueDay === null || row.MaxDueDay === undefined) return '0';
              return `${row.MaxDueDay}`;
            }}
          </Slot>

          {/* Custom slots for score fields to show 0 instead of "-" */}
          <Slot<OperationChargeAmount> id="MinScore">
            {(_, row) => {
              if (!row) return '0';
              if (row.MinScore === null || row.MinScore === undefined) return '0';
              return `${row.MinScore}`;
            }}
          </Slot>

          <Slot<OperationChargeAmount> id="MaxScore">
            {(_, row) => {
              if (!row) return '0';
              if (row.MaxScore === null || row.MaxScore === undefined) return '0';
              return `${row.MaxScore}`;
            }}
          </Slot>

          {/* Custom slot for OperationChargeDefinitionType display */}
          <Slot<OperationChargeAmount> id="OperationChargeDefinitionType">
            {(_, row) => {
              if (!row || row.OperationChargeDefinitionType === null || row.OperationChargeDefinitionType === undefined)
                return '-';
              // OperationChargeDefinitionType represents integrator status (1=with integrator, 2=without integrator)
              // Not the charge calculation type
              const integratorStatus = row.OperationChargeDefinitionType === 1 ? 'Entegratörlü' : 'Entegratörsüz';
              return integratorStatus;
            }}
          </Slot>

          {/* Actions slot for delete button */}
          <Slot<OperationChargeAmount> id="actions">
            {(_, row) => {
              if (!row || !row.Id) return null;
              return (
                <Tooltip title="Sil">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDelete(row)}
                    disabled={disabled || isDeleting}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              );
            }}
          </Slot>
        </Table>
      </CardContent>
    </Card>
  );
};
