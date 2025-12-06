/**
 * E-Ledger Section Component
 * Following OperationPricing pattern for section components
 * Matches legacy renderELedgerStatus() structure exactly
 */

import { Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import React from 'react';
import type { LedgerIntegrator } from '../company-document-data-tab.types';
// Legacy renderELedgerStatus() business logic - no helper imports needed

interface ELedgerSectionProps {
  ledgerIntegrator: LedgerIntegrator;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

/**
 * E-Ledger Integration Section matching legacy layout exactly
 */
export const ELedgerSection: React.FC<ELedgerSectionProps> = ({ ledgerIntegrator, loading, error, onRefresh }) => {
  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader
          title="e-Defter"
          action={
            <IconButton onClick={onRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardHeader
          title="e-Defter"
          action={
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Alert
            severity="error"
            action={
              <Button onClick={onRefresh} size="small">
                Tekrar Dene
              </Button>
            }>
            {error}
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Legacy renderELedgerStatus() business logic exactly
  // Status: entry ? (active ? "Aktif" : "Pasif") : "Eklenmedi"
  const isActive = ledgerIntegrator.active;
  const hasIntegration = ledgerIntegrator.entry;

  // Status text matching legacy exactly
  const getStatusText = () => {
    if (!hasIntegration) return 'Eklenmedi';
    return isActive ? 'Aktif' : 'Pasif';
  };

  // Legacy business logic: simple text display, no color chips needed

  return (
    <Card>
      <CardHeader
        title="e-Defter"
        action={
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        {/* Matches legacy renderELedgerStatus() layout exactly */}
        <Box sx={{ p: 3, border: 1, borderColor: 'grey.300', borderRadius: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 300, color: 'text.secondary' }}>
              e-Defter Durumu
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {/* Defter Entegratörü Firma - matches legacy field exactly */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    Defter Entegratörü Firma:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box
                    component="input"
                    sx={{
                      width: '100%',
                      p: 1,
                      border: '1px solid #ced4da',
                      borderRadius: 1,
                      backgroundColor: '#f8f9fa',
                      '&:disabled': { backgroundColor: '#e9ecef' },
                    }}
                    value={ledgerIntegrator.integratorName || ''}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Defter Entegratörü Durumu - matches legacy field exactly */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography variant="body2" sx={{ pt: 1 }}>
                    Defter Entegratörü Durumu:
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Box
                    component="input"
                    sx={{
                      width: '100%',
                      p: 1,
                      border: '1px solid #ced4da',
                      borderRadius: 1,
                      backgroundColor: '#f8f9fa',
                      '&:disabled': { backgroundColor: '#e9ecef' },
                    }}
                    value={getStatusText()}
                    disabled
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};
