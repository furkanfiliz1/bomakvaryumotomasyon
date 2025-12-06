import { Form, PageHeader, Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getCompensationDetailsTableHeaders, parseCurrencyInput } from '../helpers';
import { useUpdateCompensationDropdownData } from '../hooks/useUpdateCompensationDropdownData';
import { useUpdateCompensationForm } from '../hooks/useUpdateCompensationForm';
import {
  useGetCompensationDetailsQuery,
  useGetCompensationItemQuery,
  useUpdateCompensationItemMutation,
} from '../limit-operations.api';
import type { CompensationDetail, CompensationUpdateFormData } from '../limit-operations.types';
import { CompensationDetailsTableSlots } from './CompensationDetailsTableSlots';

/**
 * Update Compensation Page Component
 * Allows editing of compensation items with details table
 * Based on UpdateCompensation.js reference with modern TypeScript/React patterns
 */
export const UpdateCompensationPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const compensationId = Number(id);
  const notice = useNotice();
  // State for compensation details table
  const [compensationDetails, setCompensationDetails] = useState<CompensationDetail[]>([]);

  // API calls
  const {
    data: compensationItem,
    error: itemError,
    isLoading: itemLoading,
  } = useGetCompensationItemQuery(compensationId, {
    skip: !compensationId,
  });

  const {
    data: compensationDetailsData,
    error: detailsError,
    isLoading: detailsLoading,
  } = useGetCompensationDetailsQuery(compensationId, {
    skip: !compensationId,
  });

  const [updateCompensationItem, { isLoading: isUpdating, error }] = useUpdateCompensationItemMutation();

  useErrorListener(error);
  // Dropdown data
  const dropdownData = useUpdateCompensationDropdownData();

  // Form and schema
  const { form, schema, setCompanySearchResults } = useUpdateCompensationForm({ dropdownData });

  // Error handling
  useErrorListener(itemError);
  useErrorListener(detailsError);
  useErrorListener(dropdownData.error);

  // Update compensation details when data loads
  useEffect(() => {
    if (compensationDetailsData) {
      setCompensationDetails(compensationDetailsData);
    }
  }, [compensationDetailsData]);

  // Reset form when compensation item loads
  useEffect(() => {
    console.log('compensationItem', compensationItem);
    if (compensationItem && dropdownData.riskyCalculations.length > 0) {
      // Convert number[] to RiskyCalculationType[] for form compatibility
      const riskyFinancialSituations =
        compensationItem.RiskyFinancialSituations?.map((id) => {
          const found = dropdownData.riskyCalculations.find((item) => item.value === id);
          return found
            ? { Id: id, Name: found.label, label: found.label, value: id }
            : { Id: id, Name: '', label: '', value: id };
        }) || [];

      // First reset form with all data except Identifier
      form.reset({
        ...compensationItem,
        DocumentState: compensationItem?.DocumentState === 0 ? undefined : compensationItem?.DocumentState,
        GuarantorRate: compensationItem?.GuarantorRate === 0 ? undefined : compensationItem?.GuarantorRate,
        Protocol: compensationItem?.Protocol === 0 ? undefined : compensationItem?.Protocol,
        ProductType: compensationItem?.ProductType === 0 ? undefined : compensationItem?.ProductType,
        RiskyFinancialSituations: riskyFinancialSituations,
      });

      // Then set Identifier value separately for AsyncAutoComplete field
      if (compensationItem.Identifier && compensationItem.CustomerName) {
        // Clean JSON string formatting if it exists
        const cleanIdentifier =
          compensationItem.Identifier.startsWith('"') && compensationItem.Identifier.endsWith('"')
            ? compensationItem.Identifier.slice(1, -1)
            : compensationItem.Identifier;

        const cleanCustomerName =
          compensationItem.CustomerName.startsWith('"') && compensationItem.CustomerName.endsWith('"')
            ? compensationItem.CustomerName.slice(1, -1)
            : compensationItem.CustomerName;

        const identifierObject = {
          Id: compensationItem.CompanyId || 0,
          Identifier: cleanIdentifier,
          CompanyName: cleanCustomerName,
          label: `${cleanIdentifier} - ${cleanCustomerName}`,
          value: cleanIdentifier,
        };

        // Add to search results so it can be found by AsyncAutoComplete
        setCompanySearchResults((prev) => {
          const exists = prev.some((item) => item.Identifier === cleanIdentifier);
          if (!exists) {
            return [identifierObject, ...prev];
          }
          return prev;
        });

        // Set the company object directly to the form field
        form.setValue('Identifier', identifierObject);
      }
    }
  }, [compensationItem, form, dropdownData.riskyCalculations, setCompanySearchResults]);

  // Handle form submission
  const handleFormSubmit = useCallback(
    async (formData: CompensationUpdateFormData) => {
      if (!compensationId) return;

      try {
        // Convert RiskyFinancialSituations back to number array for API
        const riskyFinancialSituations =
          formData.RiskyFinancialSituations?.map((item) => {
            if (typeof item === 'object' && item && 'value' in item && typeof item.value === 'number') {
              return item.value;
            }
            if (typeof item === 'number') {
              return item;
            }
            return 0; // fallback
          }).filter((id): id is number => typeof id === 'number') || [];

        // Extract Identifier from company object if it's an object, otherwise use as string
        let identifierValue: string | undefined;
        if (typeof formData.Identifier === 'object' && formData.Identifier && 'Identifier' in formData.Identifier) {
          identifierValue = formData.Identifier.Identifier;
        } else {
          identifierValue = formData.Identifier;
        }

        // Clean JSON string formatting if it exists
        if (identifierValue && typeof identifierValue === 'string') {
          if (identifierValue.startsWith('"') && identifierValue.endsWith('"')) {
            identifierValue = identifierValue.slice(1, -1);
          }
        }

        await updateCompensationItem({
          id: compensationId,
          data: {
            ...formData,
            Identifier: identifierValue,
            details: compensationDetails,
            RiskyFinancialSituations: riskyFinancialSituations,
            IsDigital: formData.IsDigital, // Keep as boolean for API
          },
        }).unwrap();
        notice({
          variant: 'success',
          message: 'Tazminat başarıyla güncellendi',
        });
      } catch (error) {
        console.error('Failed to update compensation item:', error);
        notice({
          variant: 'error',
          message: 'Güncelleme sırasında bir hata oluştu',
        });
      }
    },
    [compensationId, updateCompensationItem, compensationDetails, notice],
  );

  // Handle compensation amount change in details table
  const handleCompensationAmountChange = useCallback((itemId: number, newAmount: string) => {
    const numericValue = parseCurrencyInput(newAmount);
    setCompensationDetails((prevDetails) =>
      prevDetails.map((item) => (item.Id === itemId ? { ...item, CompensationAmount: numericValue } : item)),
    );
  }, []);

  // Loading state
  if (itemLoading || detailsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (itemError) {
    return (
      <Box p={3}>
        <Alert severity="error">Tazminat verileri yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.</Alert>
      </Box>
    );
  }

  // Determine if this is a cheque or invoice based on ProductType
  const isCheque = compensationItem?.ProductType === 4;

  return (
    <Box>
      <PageHeader title="Tazminat Güncelle" subtitle="Tazminat bilgilerini düzenleyebilirsiniz" />

      <Box p={3}>
        <Card sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tazminat Bilgileri
          </Typography>
          {dropdownData.isLoading ? (
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Form with new schema-based approach */}
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form} schema={schema as any} />
            </>
          )}
        </Card>
        {/* Action Buttons */}
        <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={isUpdating}>
            İptal
          </Button>
          <Button variant="contained" onClick={form.handleSubmit(handleFormSubmit)} disabled={isUpdating}>
            {isUpdating ? <CircularProgress size={24} /> : 'Güncelle'}
          </Button>
        </Box>
        {/* Compensation Details Table */}
        {compensationDetails.length > 0 && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tazmin Detayları
              </Typography>

              <Table<CompensationDetail>
                id="compensation-details-table"
                rowId="Id"
                headers={getCompensationDetailsTableHeaders(isCheque)}
                data={compensationDetails}
                loading={detailsLoading}
                size="small"
                hidePaging
                notFoundConfig={{
                  title: 'Tazmin detayı bulunamadı',
                  subTitle: 'Bu tazminat için henüz detay kaydı bulunmamaktadır.',
                }}>
                {/* Custom slot for document number (cheque or invoice number) */}
                <Slot<CompensationDetail> id="documentNumber">
                  {(_, row) => <CompensationDetailsTableSlots.DocumentNumberSlot row={row!} isCheque={isCheque} />}
                </Slot>

                {/* Custom slot for editable compensation amount */}
                <Slot<CompensationDetail> id="CompensationAmount">
                  {(_, row) => (
                    <CompensationDetailsTableSlots.CompensationAmountSlot
                      row={row!}
                      onAmountChange={handleCompensationAmountChange}
                    />
                  )}
                </Slot>
              </Table>
            </CardContent>
          </Card>
        )}
      </Box>
    </Box>
  );
};

export default UpdateCompensationPage;
