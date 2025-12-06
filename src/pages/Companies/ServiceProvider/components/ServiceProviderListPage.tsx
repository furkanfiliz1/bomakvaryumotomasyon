import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Grid, Alert, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useErrorListener } from '@hooks';
import { AddIntegratorDialog } from './AddIntegratorDialog';
import { IntegratorDetailsRow } from './IntegratorDetailsRow';
import { EditIntegratorDialog } from './EditIntegratorDialog';
import { useServiceProviderData } from '../hooks/useServiceProviderData';
import type { CompanyIntegrator } from '../service-provider.types';

interface ServiceProviderListPageProps {
  companyId: number;
  companyIdentifier: string;
}

/**
 * Main service provider management page
 * Converts legacy CompaniesDetailFileTransfer.js to modern TypeScript component
 */
export const ServiceProviderListPage: React.FC<ServiceProviderListPageProps> = ({ companyId, companyIdentifier }) => {
  const [selectedIntegrator, setSelectedIntegrator] = useState<CompanyIntegrator | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const { integrators, nestedIntegrators, isLoading, error, refetch } = useServiceProviderData(companyIdentifier);

  useErrorListener(error ? [error] : []);

  const handleEditIntegrator = (integrator: CompanyIntegrator) => {
    setSelectedIntegrator(integrator);
  };

  const handleCloseEdit = () => {
    setSelectedIntegrator(null);
  };

  const handleToggleRow = (integratorId: number) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(integratorId)) {
      newExpandedRows.delete(integratorId);
    } else {
      newExpandedRows.add(integratorId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSuccess = () => {
    setShowAddDialog(false);
    setSelectedIntegrator(null);
    refetch();
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Servis Sağlayıcıları</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setShowAddDialog(true)}>
            Yeni Entegratör
          </Button>
        </Box>

        {integrators.length === 0 ? (
          <Alert severity="info">Bu şirket için henüz entegratör tanımlanmamış.</Alert>
        ) : (
          <Grid container spacing={0}>
            {integrators.map((integrator: CompanyIntegrator) => (
              <Grid item xs={12} key={integrator.Id}>
                <IntegratorDetailsRow
                  integrator={integrator}
                  isExpanded={expandedRows.has(integrator.Id)}
                  onToggleExpand={handleToggleRow}
                  onEdit={handleEditIntegrator}
                  onSuccess={handleSuccess}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {selectedIntegrator && (
          <EditIntegratorDialog
            integrator={selectedIntegrator}
            open={!!selectedIntegrator}
            onClose={handleCloseEdit}
            onSuccess={handleSuccess}
          />
        )}

        <AddIntegratorDialog
          companyId={companyId}
          nestedIntegrators={nestedIntegrators}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onSuccess={handleSuccess}
        />
      </CardContent>
    </Card>
  );
};
