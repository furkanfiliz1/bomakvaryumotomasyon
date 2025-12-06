import { Visibility } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { CompanyScoring } from '../limit-operations.types';

interface CompanyTableRowActionsProps {
  row?: CompanyScoring;
}

/**
 * Table row actions component for company scoring table
 */
export const CompanyTableRowActions = ({ row }: CompanyTableRowActionsProps) => {
  const navigate = useNavigate();

  if (!row || !row.CompanyId) return null;

  const handleViewDetails = () => {
    navigate(`/limit-operations/companies/${row.CompanyId}/genel`);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Button
        id="company-detail-button"
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<Visibility />}
        onClick={handleViewDetails}>
        Detay
      </Button>
    </div>
  );
};
