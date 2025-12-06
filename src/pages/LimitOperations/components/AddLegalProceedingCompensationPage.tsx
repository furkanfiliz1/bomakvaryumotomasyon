import { Form, PageHeader, Slot, Table, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Card, Grid, Stack, TextField, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { HeadCell } from 'src/components/common/Table/types';
import { useErrorListener } from 'src/hooks';
import {
  useCreateLegalProceedingCompensationMutation,
  useGetFinancerCompaniesForCompensationQuery,
  useLazyGetAvailableCompensationsDetailsQuery,
} from '../CompensationTransactions/compensation-transactions.api';
import type {
  AvailableCompensationDetail,
  SelectedCompensationItem,
} from '../CompensationTransactions/compensation-transactions.types';
import { transformFinancerCompanies } from '../CompensationTransactions/helpers';
import { createLegalProceedingCompensationSchema } from '../helpers';
import { useCompanySearch } from '../hooks';
import { useGetRiskyCalculationsQuery } from '../limit-operations.api';

// Form data type will be inferred from the schema

/**
 * Add Legal Proceeding Compensation Page Component
 * Following OperationPricing patterns and modern form handling
 * Extracted form logic from reference AddCompensation.js file
 */
export const AddLegalProceedingCompensationPage: React.FC = () => {
  const notice = useNotice();

  // State management for compensation details and selections
  const [compensationDetails, setCompensationDetails] = useState<AvailableCompensationDetail[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedCompensationItem[]>([]);

  // API hooks for dropdown data
  const {
    data: financerCompanies = [],
    isLoading: isLoadingFinancers,
    error: financerCompaniesError,
  } = useGetFinancerCompaniesForCompensationQuery();
  const {
    data: riskyCalculations = [],
    isLoading: isLoadingRiskyCalculations,
    error: riskyCalculationsError,
  } = useGetRiskyCalculationsQuery();

  // Company search hook
  const { companySearchResults, searchCompaniesByNameOrIdentifier, isCompanySearchLoading } = useCompanySearch();

  // Lazy query for getting available compensations
  const [getAvailableCompensations, { isLoading: isLoadingCompensations, error: getCompensationsError }] =
    useLazyGetAvailableCompensationsDetailsQuery();

  // Mutation for creating legal proceeding compensation
  const [createLegalProceedingCompensation, { isLoading: isCreatingCompensation, error: createCompensationError }] =
    useCreateLegalProceedingCompensationMutation();

  // Error listeners for API calls
  useErrorListener([financerCompaniesError, riskyCalculationsError, getCompensationsError, createCompensationError]);

  // Table headers configuration
  const headers: HeadCell[] = useMemo(
    () => [
      { id: 'Id', label: 'Fatura Id', width: 100 },
      { id: 'invoiceNumber', label: 'Fatura No', width: 150 },
      { id: 'AllowanceId', label: 'İskonto No', width: 120 },
      { id: 'AllowanceAmount', label: 'Fatura Tutarı', type: 'currency', width: 140 },
      { id: 'AllowanceDate', label: 'İskonto Tarihi', type: 'date', width: 130 },
      { id: 'AllowanceDueDate', label: 'Fatura Vade Tarihi', type: 'date', width: 150 },
      { id: 'GuarantorRate', label: 'Garantörlük Oranı (%)', type: 'percentage', width: 160 },
      { id: 'ChargedAmount', label: 'Tahsil Edilen Tutar', type: 'currency', width: 160 },
      { id: 'compensationWeight', label: 'Tazmin Ağırlığı', slot: true, width: 130 },
      { id: 'compensationAmount', label: 'Tazmin Tutarı', slot: true, width: 180 },
      { id: 'remainingRisk', label: 'Tazmin Ana Para', slot: true, width: 140 },
      { id: 'compensationInterest', label: 'Tazmin Ödenen Faiz Tutarı', slot: true, width: 180 },
    ],
    [],
  );

  // Transform data for table - extend with selected item data
  const tableData = useMemo(() => {
    return compensationDetails.map((item) => {
      const selectedItem = selectedItems.find(
        (selected) => `${selected.Id}-${selected.AllowanceId}` === `${item.Id}-${item.AllowanceId}`,
      );

      return {
        ...item,
        invoiceNumber: item.InvoiceNumber || item.BillNumber || '-',
        isSelected: !!selectedItem,
        compensationWeight: selectedItem?.compensationWeight || 0,
        compensationAmount: selectedItem?.compensationAmount || 0,
        remainingRisk: item.RemainingRiskAmount * (item.GuarantorRate / 100),
        compensationInterest: selectedItem
          ? selectedItem.compensationAmount - item.RemainingRiskAmount * (item.GuarantorRate / 100)
          : 0,
        selectedItem,
      };
    });
  }, [compensationDetails, selectedItems]);

  // Form setup with validation schema - now with all required parameters
  const schema = useMemo(
    () =>
      createLegalProceedingCompensationSchema(
        transformFinancerCompanies(financerCompanies),
        riskyCalculations,
        companySearchResults,
        searchCompaniesByNameOrIdentifier,
        isCompanySearchLoading,
      ),
    [
      financerCompanies,
      riskyCalculations,
      companySearchResults,
      searchCompaniesByNameOrIdentifier,
      isCompanySearchLoading,
    ],
  );

  const form = useForm({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    defaultValues: {
      identifier: '',
      compensationDate: '',
      amount: undefined,
      financerCompany: undefined,
      riskyFinancialSituations: [],
      productType: 3, // Default to type 3 like reference
    },
  });

  // Get available compensations details (like legacy getAvailableCompensationsDetails)
  const handleGetCompensations = async () => {
    const formValues = form.getValues();
    const { identifier, financerCompany, productType } = formValues;

    // Find selected company ID from search results
    const selectedCompany = companySearchResults.find((c) => c.Identifier === identifier);
    if (!selectedCompany || !financerCompany || !productType) {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'Lütfen şirket, finansör ve ürün tipi seçimlerini tamamlayın',
        buttonTitle: 'Tamam',
      });
      return;
    }

    const result = await getAvailableCompensations({
      companyId: selectedCompany.Id,
      financerCompanyId: Number(financerCompany),
      ProductType: productType,
    }).unwrap();

    if (result) {
      setCompensationDetails(result);
      setSelectedItems([]); // Clear previous selections
    }
  };

  // Item selection is now handled by Table component's onCheckboxSelect prop

  // Handle select all functionality is now handled by Table component's checkbox prop  // Recalculate compensation amounts (like legacy recalculateCompensationAmounts)
  const recalculateCompensationAmounts = (items: SelectedCompensationItem[], totalAmount: number) => {
    const totalRemainingRisk = items.reduce((total, item) => total + item.calculatedRemainingRisk, 0);

    return items.map((item) => {
      const weight = totalRemainingRisk > 0 ? (item.calculatedRemainingRisk / totalRemainingRisk) * 100 : 0;
      const compensationAmount = totalAmount * (weight / 100);

      return {
        ...item,
        compensationWeight: parseFloat(weight.toFixed(2)),
        compensationAmount,
      };
    });
  };

  // Handle compensation amount change for individual items
  const handleCompensationAmountChange = (itemIdAllowanceId: string, newAmount: string) => {
    setSelectedItems((prevState) =>
      prevState.map((item) => {
        if (`${item.Id}-${item.AllowanceId}` === itemIdAllowanceId) {
          return {
            ...item,
            compensationAmount: parseFloat(newAmount) || 0,
          };
        }
        return item;
      }),
    );
  };

  // Calculation helper functions (like legacy)
  const calculateTotalCompensationPrincipal = () =>
    selectedItems.reduce((total, item) => total + (item.compensationAmount || 0), 0);

  const calculateTotalRemainingRisk = () =>
    selectedItems.reduce((total, item) => total + (item.RemainingRiskAmount * (item.GuarantorRate / 100) || 0), 0);

  const calculateTotalCompensationInterest = () =>
    selectedItems.reduce((total, item) => {
      if (item.compensationAmount && item.RemainingRiskAmount) {
        const interest = item.compensationAmount - item.RemainingRiskAmount * (item.GuarantorRate / 100);
        return total + interest;
      }
      return total;
    }, 0);

  const calculateCompensationEfficiencyRatio = () => {
    const formValues = form.getValues();
    const totalCompensationAmount = formValues.amount || 0;
    const totalRemainingRisk = calculateTotalRemainingRisk();

    if (totalRemainingRisk === 0) return 0;

    const ratio = (totalCompensationAmount - totalRemainingRisk) / totalRemainingRisk;
    return ratio * 100;
  };

  // Format currency helper
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2,
    }).format(value || 0);

  // Parse currency input helper
  const parseCurrencyInput = (formattedValue: string) =>
    formattedValue.replace(/[₺\s]/g, '').replace(/\./g, '').replace(',', '.');

  // Watch for amount changes and recalculate compensation amounts
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'amount' && selectedItems.length > 0) {
        const newAmount = value.amount || 0;
        setSelectedItems((prevItems) => recalculateCompensationAmounts(prevItems, newAmount));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedItems.length]);

  // Handle form submission
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    if (selectedItems.length === 0) {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'Lütfen en az bir iskonto seçiniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    const isCheque = formData.productType === 4;

    const details = selectedItems.map((item) => ({
      allowanceId: item.AllowanceId,
      allowanceInvoiceId: isCheque ? undefined : item.AllowanceInvoiceId || undefined,
      allowanceBillId: isCheque ? item.AllowanceBillId || undefined : undefined,
      compensationAmount: Number(item.compensationAmount.toFixed(2)),
      interestRate: Number(calculateCompensationEfficiencyRatio().toFixed(2)),
      compensationRate: item.compensationWeight,
    }));

    // Format the request to match the curl example
    const requestData = {
      Identifier: formData.identifier,
      CompensationDate: formData.compensationDate,
      Amount: formData.amount,
      FinancerId: String(formData.financerCompany), // Convert to string as per curl
      ProductType: String(formData.productType), // Convert to string as per curl
      interestRate: Number(calculateCompensationEfficiencyRatio().toFixed(2)),
      details,
    };

    const result = await createLegalProceedingCompensation(requestData).unwrap();

    if (result) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tazmin kaydı başarıyla oluşturuldu',
        buttonTitle: 'Tamam',
      });
    }
  };

  return (
    <Box>
      {/* Page Header */}
      <PageHeader title="Tazmin Ekleme" subtitle="Kanuni takip için yeni tazmin kaydı oluşturun" />

      <Box sx={{ p: 2 }}>
        <Grid container spacing={3}>
          {/* Form Section */}
          <Grid item xs={12} lg={12}>
            <Card sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'light' }}>
                Tazmin Ekleme
              </Typography>

              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form} schema={schema as any} />

              {/* Action Buttons */}
              <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={form.handleSubmit(handleSubmit)}
                  disabled={
                    isLoadingFinancers || isLoadingRiskyCalculations || isCompanySearchLoading || isCreatingCompensation
                  }>
                  Kaydet
                </Button>
                <Button variant="contained" onClick={handleGetCompensations} disabled={isLoadingCompensations}>
                  İskontoları Getir
                </Button>
              </Stack>
            </Card>
          </Grid>

          {/* Compensation Details Table */}
          {compensationDetails.length > 0 && (
            <Grid item xs={12}>
              <Card sx={{ p: 3 }}>
                {/* Summary Info */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'light', color: 'text.secondary' }}>
                    Mevcut Tazmin Detayları
                  </Typography>
                  <Alert
                    severity="info"
                    sx={{
                      py: 1,
                      px: 2,
                      opacity: selectedItems.length === 0 ? 0.8 : 1,
                    }}>
                    <Typography variant="body2">
                      <strong>Seçilen {selectedItems.length} kayıt</strong>
                      <br />
                      <span style={{ color: 'primary.main' }}>
                        Seçilen Toplam Tazmin Tutarı: {formatCurrency(calculateTotalCompensationPrincipal())}
                      </span>
                      <br />
                      <span style={{ color: 'info.main' }}>
                        Seçilen Toplam Tazmin Ana Para: {formatCurrency(calculateTotalRemainingRisk())}
                      </span>
                      <br />
                      <span style={{ color: 'success.main' }}>
                        Seçilen Toplam Tazmin Ödenen Faiz Tutarı: {formatCurrency(calculateTotalCompensationInterest())}
                      </span>
                      <br />
                      <span>Faiz Oranı: %{calculateCompensationEfficiencyRatio().toFixed(2)}</span>
                    </Typography>
                  </Alert>
                </Box>

                {/* Table */}
                <Table
                  id="compensation-details-table"
                  rowId="Id"
                  headers={headers}
                  data={tableData}
                  checkbox={true}
                  onCheckboxSelect={(selectedRows) => {
                    // Convert selected table rows back to SelectedCompensationItem format
                    const formValues = form.getValues();
                    const formAmount = formValues.amount || 0;

                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const newSelectedItems = selectedRows.map((row: any) => {
                      const remainingRisk = row.RemainingRiskAmount * (row.GuarantorRate / 100) || 0;
                      return {
                        ...row,
                        calculatedRemainingRisk: remainingRisk,
                        compensationWeight: 0,
                        compensationAmount: 0,
                      };
                    });

                    setSelectedItems(recalculateCompensationAmounts(newSelectedItems, formAmount));
                  }}
                  initialCheckedIds={selectedItems.map((item) => item.Id)}
                  size="medium"
                  loading={isLoadingCompensations}>
                  {/* Custom slots for special columns */}
                  <Slot id="compensationWeight">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(_, row: any) => (row.selectedItem ? `%${row.selectedItem.compensationWeight}` : '-')}
                  </Slot>
                  <Slot id="compensationAmount">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(_, row: any) =>
                      row.selectedItem ? (
                        <TextField
                          size="small"
                          value={formatCurrency(row.selectedItem.compensationAmount)}
                          onChange={(e) => {
                            const numericValue = parseCurrencyInput(e.target.value);
                            handleCompensationAmountChange(`${row.Id}-${row.AllowanceId}`, numericValue);
                          }}
                          sx={{ minWidth: '180px' }}
                        />
                      ) : (
                        '-'
                      )
                    }
                  </Slot>
                  <Slot id="remainingRisk">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(_, row: any) => formatCurrency(row.remainingRisk)}
                  </Slot>
                  <Slot id="compensationInterest">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {(_, row: any) => (row.selectedItem ? formatCurrency(row.compensationInterest) : '-')}
                  </Slot>
                </Table>
              </Card>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default AddLegalProceedingCompensationPage;
