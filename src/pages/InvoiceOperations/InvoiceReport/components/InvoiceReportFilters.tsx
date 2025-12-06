import { Form } from '@components';
import { Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card } from '@mui/material';
import { forwardRef, useImperativeHandle } from 'react';
import useInvoiceReportFilterForm from '../hooks/useInvoiceReportFilterForm';
import type { BuyerItem, Currency, InvoiceSourceType, StatusOption, TypeOption } from '../invoice-report.types';

interface InvoiceReportFiltersProps {
  // Filter options from dropdown data hook
  usingStatusOptions: StatusOption[];
  invoiceTypeOptions: TypeOption[];
  deleteStatusOptions: TypeOption[];
  notifyBuyerOptions: TypeOption[];
  invoiceStatusOptions: TypeOption[];
  profileIdOptions: TypeOption[];
  invoiceSourceTypes: InvoiceSourceType[];
  currencies: Currency[];
  buyersList: BuyerItem[];
  handleExportExcel: () => void;

  // Seller search props
  sellersCompanySearchResults: Array<{ Id: number; CompanyName: string; Identifier: string }>;
  searchSellersByCompanyNameOrIdentifier: (CompanyNameOrIdentifier?: string) => Promise<void>;
  isSellersSearchLoading: boolean;

  // Actions
  onFilterChange: (filters: Record<string, unknown>) => void;

  // State
  isLoading?: boolean;
}

export interface InvoiceReportFiltersRef {
  triggerSearch: () => void;
}

export const InvoiceReportFilters = forwardRef<InvoiceReportFiltersRef, InvoiceReportFiltersProps>(
  (
    {
      usingStatusOptions,
      invoiceTypeOptions,
      deleteStatusOptions,
      notifyBuyerOptions,
      invoiceStatusOptions,
      profileIdOptions,
      invoiceSourceTypes,
      currencies,
      buyersList,
      sellersCompanySearchResults,
      searchSellersByCompanyNameOrIdentifier,
      isSellersSearchLoading,
      onFilterChange,
      isLoading = false,
      handleExportExcel,
    },
    ref,
  ) => {
    // Use the form hook with all dropdown data
    const { form, schema, handleSearch, handleReset } = useInvoiceReportFilterForm({
      usingStatusOptions,
      invoiceTypeOptions,
      deleteStatusOptions,
      notifyBuyerOptions,
      invoiceStatusOptions,
      profileIdOptions,
      invoiceSourceTypes,
      currencies,
      buyersList,
      sellersCompanySearchResults,
      searchSellersByCompanyNameOrIdentifier,
      isSellersSearchLoading,
      onFilterChange,
    });

    // Expose handleSearch function via ref
    useImperativeHandle(ref, () => ({
      triggerSearch: handleSearch,
    }));

    return (
      <Card sx={{ mb: 2, p: 2 }}>
        <Form form={form} schema={schema} space={2}></Form>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
          <Button variant="outlined" onClick={handleReset} disabled={isLoading} startIcon={<Clear />}>
            Temizle
          </Button>
          <Button variant="contained" onClick={handleSearch} disabled={isLoading} startIcon={<Search />}>
            Uygula
          </Button>
          <Button variant="contained" onClick={handleExportExcel} disabled={isLoading} startIcon={<Download />}>
            Excel
          </Button>
        </Box>
      </Card>
    );
  },
);

InvoiceReportFilters.displayName = 'InvoiceReportFilters';
