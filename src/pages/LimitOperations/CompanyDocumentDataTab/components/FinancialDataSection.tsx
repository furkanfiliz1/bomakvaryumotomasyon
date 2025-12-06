/**
 * Financial Data Section Component
 * Following OperationPricing pattern for section components
 * Matches legacy renderFinancialData() structure exactly
 */

import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete as DeleteIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useDeleteFinancialDataMutation } from '../company-document-data-tab.api';
import type { FinancialDataItem } from '../company-document-data-tab.types';
import { canDeleteFinancialData, formatFinancialDataForDisplay, getDeleteConfirmationMessage } from '../helpers';

interface FinancialDataSectionProps {
  financialData: FinancialDataItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}

/**
 * Financial Data Section matching legacy layout exactly
 * Shows financial data in table format with delete actions
 */
export const FinancialDataSection: React.FC<FinancialDataSectionProps> = ({
  financialData,
  loading,
  error,
  onRefresh,
}) => {
  const [deleteFinancialData, { isLoading: deleteLoading, error: deleteError }] = useDeleteFinancialDataMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const notice = useNotice();

  // Error handling for delete mutation
  useErrorListener(deleteError);

  const handleDelete = async (item: FinancialDataItem) => {
    if (!canDeleteFinancialData()) return;

    const confirmMessage = getDeleteConfirmationMessage(item);

    try {
      await notice({
        title: 'Finansal Veri Silme',
        message: confirmMessage,
        type: 'confirm',
        catchOnCancel: true,
      });

      // If we reach here, user confirmed
      try {
        setDeletingId(item.id);
        await deleteFinancialData({ id: item.id }).unwrap();
        onRefresh(); // Refresh data after successful deletion
      } catch (error) {
        // Error handled by global error handler
        console.error('Delete failed:', error);
      } finally {
        setDeletingId(null);
      }
    } catch {
      // User cancelled - do nothing
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Card>
        <CardHeader
          title="İşlenen Finansal Veriler"
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
          title="İşlenen Finansal Veriler"
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

  // Show empty state
  if (!financialData.length) {
    return (
      <Card>
        <CardHeader
          title="İşlenen Finansal Veriler"
          action={
            <IconButton onClick={onRefresh}>
              <RefreshIcon />
            </IconButton>
          }
        />
        <CardContent>
          <Typography variant="body1" color="text.secondary">
            Bu şirket için işlenen finansal veri bulunmamaktadır.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Format data for display (matches legacy sorting)
  const formattedData = formatFinancialDataForDisplay(financialData);

  return (
    <Card>
      <CardHeader
        title="İşlenen Finansal Veriler"
        action={
          <IconButton onClick={onRefresh} disabled={loading}>
            <RefreshIcon />
          </IconButton>
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Belge Türü</TableCell>
                <TableCell align="center">Ay</TableCell>
                <TableCell align="center">Dönem</TableCell>
                <TableCell align="center">Yıl</TableCell>
                <TableCell align="center">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formattedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      {item.typeDescription}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{item.monthDisplay}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{item.quarterDisplay}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">{item.yearDisplay}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(item)}
                      disabled={deleteLoading && deletingId === item.id}
                      title="Sil">
                      {deleteLoading && deletingId === item.id ? (
                        <CircularProgress size={16} />
                      ) : (
                        <DeleteIcon fontSize="small" />
                      )}
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
