import { EnterEventHandle, Form, PageHeader } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Box, Button, Card, Collapse } from '@mui/material';
import { useMemo, useState } from 'react';
import { useExportCompaniesMutation, useLazyGetCompaniesQuery } from '../companies.api';
import { companyTypes, createCompaniesFilterSchema, transformFiltersForAPI } from '../helpers';
import { exportCompanies as exportCompaniesHelper } from '../helpers/export.helpers';
import { useDropdownData, useFilterForm } from '../hooks';
import CompaniesFilterForm from './CompaniesFilterForm';
import CompaniesTable from './CompaniesTable';

const CompaniesListPage = () => {
  const { dropdownOptions } = useDropdownData();

  // State for advanced filters collapse
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // RTK Query mutations
  const [exportCompanies, { isLoading: isExporting }] = useExportCompaniesMutation();

  // Convert string-based companyTypes to number-based for schema compatibility
  const numericCompanyTypes = useMemo(
    () =>
      companyTypes.map((type) => ({
        value: parseInt(type.Value, 10),
        label: type.Description,
      })),
    [],
  );

  // Create schema with actual dropdown options
  const schema = useMemo(
    () =>
      createCompaniesFilterSchema({
        companyTypes: numericCompanyTypes,
        companyStatusOptions: dropdownOptions?.companyStatusOptions || [],
        activityTypes: dropdownOptions?.activityTypes || [],
        onboardingStatus: dropdownOptions?.onboardingStatus || [],
        signedContractOptions: [
          { value: '1', label: 'Evet' },
          { value: '0', label: 'Hayır' },
        ],
        leadingChannels: dropdownOptions?.leadingChannels || [],
        customerManagers: dropdownOptions?.customerManagers || [],
        cities: dropdownOptions?.cities || [],
      }),
    [dropdownOptions, numericCompanyTypes],
  );

  const basicInfoSchema = useMemo(
    () =>
      createCompaniesFilterSchema(
        {
          companyTypes: numericCompanyTypes,
          companyStatusOptions: dropdownOptions?.companyStatusOptions || [],
          activityTypes: dropdownOptions?.activityTypes || [],
          onboardingStatus: dropdownOptions?.onboardingStatus || [],
          signedContractOptions: [
            { value: '1', label: 'Evet' },
            { value: '0', label: 'Hayır' },
          ],
          leadingChannels: dropdownOptions?.leadingChannels || [],
          customerManagers: dropdownOptions?.customerManagers || [],
          cities: dropdownOptions?.cities || [],
        },
        'basicInfoSide',
      ),
    [dropdownOptions, numericCompanyTypes],
  );

  const advancedInfoSchema = useMemo(
    () =>
      createCompaniesFilterSchema(
        {
          companyTypes: numericCompanyTypes,
          companyStatusOptions: dropdownOptions?.companyStatusOptions || [],
          activityTypes: dropdownOptions?.activityTypes || [],
          onboardingStatus: dropdownOptions?.onboardingStatus || [],
          signedContractOptions: [
            { value: '1', label: 'Onaylı' },
            { value: '0', label: 'Hayır' },
          ],
          leadingChannels: dropdownOptions?.leadingChannels || [],
          customerManagers: dropdownOptions?.customerManagers || [],
          cities: dropdownOptions?.cities || [],
        },
        'advancedInfoSide',
      ),
    [dropdownOptions, numericCompanyTypes],
  );

  const { form, handleSearch, handleReset, initialValues } = useFilterForm(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    schema as any,
  );

  // Use initial values from URL parameters for the API params instead of watching form
  const apiParams = useMemo(() => {
    return {
      ...transformFiltersForAPI(initialValues),
      page: 1,
      pageSize: 50,
      sort: 'InsertDateTime',
      sortType: 'Desc' as const,
      GetByIntegrators: false,
    };
  }, [initialValues]);

  // For now, just get the error for error handling, the table will handle its own data
  const { error } = useServerSideQuery(useLazyGetCompaniesQuery, apiParams);

  useErrorListener(error);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFormSubmit = form.handleSubmit(handleSearch as any);

  const handleExport = async () => {
    try {
      const filters = form.getValues();
      await exportCompaniesHelper(filters, exportCompanies);
    } catch (error) {
      // Error handling is managed by useErrorListener via RTK Query
      console.error('Export failed:', error);
    }
  };

  // Create schemas for different sections following InvoiceAddManuel pattern

  return (
    <>
      <PageHeader title="Şirketler" subtitle="Üye olan ticari ve finans şirketlerini takip edin" />
      <Box mx={2}>
        <Card sx={{ p: 2, mb: 2 }}>
          {/* Basic Info Section */}
          <Box sx={{ mb: 0 }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Form form={form as any} schema={basicInfoSchema as any} />
          </Box>

          {/* Detailed Search Toggle Button */}
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              startIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
              variant="text"
              size="small">
              Detaylı Arama
            </Button>
          </Box>

          {/* Collapsible Advanced Info Section */}
          <Collapse in={showAdvancedFilters}>
            <Box sx={{ mb: 3 }}>
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              <Form form={form as any} schema={advancedInfoSchema as any} />
            </Box>
          </Collapse>

          <CompaniesFilterForm
            onReset={handleReset}
            onExport={handleExport}
            isExporting={isExporting}
            handleFormSubmit={handleFormSubmit}
          />
        </Card>

        <Box>
          <Card sx={{ p: 2 }}>
            <CompaniesTable />
          </Card>
        </Box>
        <EnterEventHandle onEnterPress={handleFormSubmit} />
      </Box>
    </>
  );
};

export default CompaniesListPage;
