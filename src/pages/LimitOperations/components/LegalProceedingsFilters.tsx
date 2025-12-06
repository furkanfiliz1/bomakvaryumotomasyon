import { EnterEventHandle, Form } from '@components';
import { Add, Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Stack } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { useCompanySearch, useLegalProceedingsDropdownData, useLegalProceedingsFilterForm } from '../hooks';

interface LegalProceedingsFiltersProps {
  onExport: () => void;
  isLoading?: boolean;
}

export const LegalProceedingsFilters: React.FC<LegalProceedingsFiltersProps> = ({ onExport, isLoading = false }) => {
  const { dropdownData, isLoading: isLoadingDropdowns } = useLegalProceedingsDropdownData();

  // Company search for Identifier field
  const { companySearchResults, searchCompaniesByNameOrIdentifier, isCompanySearchLoading } = useCompanySearch();

  const { form, schema, handleSearch, onReset } = useLegalProceedingsFilterForm({
    dropdownData,
    onFilterChange: () => {},
    companySearchResults,
    searchCompaniesByNameOrIdentifier,
    isCompanySearchLoading,
  });

  // Show loading state while dropdown data is being fetched
  if (isLoadingDropdowns) {
    return (
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <div>Loading filters...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 2, p: 2 }}>
      <Form form={form} schema={schema} space={3}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
          {/* Search and Reset Buttons */}
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              component={Link}
              to="/limit-operations/legal-proceedings/add">
              Ekle
            </Button>
            <Button
              variant="contained"
              component={Link}
              to="/limit-operations/legal-proceedings/compensation-transactions">
              Muhasebe işlemleri
            </Button>
          </Stack>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" onClick={onReset} disabled={isLoading} startIcon={<Clear />}>
              Temizle
            </Button>
            <Button variant="contained" disabled={isLoading} startIcon={<Search />} onClick={handleSearch}>
              Uygula
            </Button>

            <Button variant="contained" onClick={onExport} disabled={isLoading} startIcon={<Download />}>
              Excel
            </Button>
          </Stack>

          {/* Action Buttons */}
        </Box>
      </Form>
      <EnterEventHandle onEnterPress={handleSearch} />
    </Card>
  );
};
