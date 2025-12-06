import { Add, Clear, Download, Search } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface CompaniesFilterFormProps {
  onReset: () => void;
  onExport: () => void;
  isExporting?: boolean;
  handleFormSubmit: () => void;
}

const CompaniesFilterForm: React.FC<CompaniesFilterFormProps> = ({
  onReset,
  onExport,
  isExporting,
  handleFormSubmit,
}) => {
  return (
    <Box>
      {/* Action Buttons */}
      <Box display="flex" justifyContent="space-between" gap={2} mt={1}>
        <Button variant="outlined" startIcon={<Add />} component={Link} to="/companies/new">
          Yeni Şirket
        </Button>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={onReset} startIcon={<Clear />}>
            Temizle
          </Button>
          <LoadingButton startIcon={<Search />} id="asd" onClick={handleFormSubmit} variant="contained">
            Uygula
          </LoadingButton>
          <LoadingButton
            startIcon={<Download />}
            variant="contained"
            onClick={onExport}
            loading={isExporting}
            loadingPosition="start">
            Excel
          </LoadingButton>
        </Box>
      </Box>
    </Box>
  );
};

export default CompaniesFilterForm;
