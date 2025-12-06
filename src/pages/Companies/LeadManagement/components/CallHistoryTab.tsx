/**
 * Call History Tab Component
 * Displays call history list with add/edit/delete functionality
 * Following OperationPricing table and form patterns
 */

import { Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Box, Button, Chip, Typography } from '@mui/material';
import React, { useState } from 'react';
import { CallResult, SalesScenario } from '../constants';
import { getCallHistoryTableHeaders } from '../helpers';
import {
  useCreateCallMutation,
  useDeleteCallMutation,
  useGetCallHistoryQuery,
  useUpdateCallMutation,
} from '../lead-management.api';
import type { CallHistory } from '../lead-management.types';
import { CallHistoryDialog } from './CallHistoryDialog';

interface CallHistoryTabProps {
  leadId: number;
  customerManagerId?: number;
}

export const CallHistoryTab: React.FC<CallHistoryTabProps> = ({ leadId, customerManagerId }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<CallHistory | null>(null);

  // Mutations
  const [createCall, { error: createError }] = useCreateCallMutation();
  const [updateCall, { error: updateError }] = useUpdateCallMutation();
  const [deleteCall, { error: deleteError }] = useDeleteCallMutation();

  // Notice and error handling
  const notice = useNotice();
  useErrorListener([createError, updateError, deleteError]);

  // Fetch call history - Real API Integration (GET /leads/{leadId}/phone-calls)
  const { data: callHistoryData, isLoading, refetch } = useGetCallHistoryQuery({ leadId });

  const tableData = callHistoryData?.Data || [];
  const tableHeaders = getCallHistoryTableHeaders();

  const handleAddClick = () => {
    setSelectedCall(null);
    setDialogOpen(true);
  };

  const handleEditClick = (call: CallHistory) => {
    setSelectedCall(call);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (call: CallHistory) => {
    try {
      await notice({
        title: 'Emin misiniz?',
        message: 'Bu arama kaydını silmek istediğinize emin misiniz?',
        variant: 'error',
        type: 'confirm',
        buttonTitle: 'Sil',
        catchOnCancel: true,
      });

      await deleteCall({ id: call.Id }).unwrap();
      notice({
        title: 'Başarılı',
        message: 'Telefon görüşmesi başarıyla silindi',
        variant: 'success',
        type: 'dialog',
      });
      refetch();
    } catch (error) {
      // User cancelled or error occurred
      if (error !== undefined) {
        // Error handled by useErrorListener
        console.error('Failed to delete call:', error);
      }
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedCall(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDialogSubmit = async (data: any) => {
    try {
      const requestData = {
        leadId,
        callResult: data.callResult,
        salesScenario: data.salesScenario,
        followUpDate: data.followUpDate || null,
        notes: data.notes || null,
        callDate: data.callDate,
        callerId: data.customerManagerId || customerManagerId,
      };

      if (selectedCall) {
        // Update existing call
        await updateCall({
          id: selectedCall.Id,
          data: requestData,
        }).unwrap();
        notice({
          title: 'Başarılı',
          message: 'Telefon görüşmesi başarıyla güncellendi',
          variant: 'success',
          type: 'dialog',
        });
      } else {
        // Create new call
        await createCall({
          data: requestData,
        }).unwrap();
        notice({
          title: 'Başarılı',
          message: 'Telefon görüşmesi başarıyla eklendi',
          variant: 'success',
          type: 'dialog',
        });
      }

      refetch();
      handleDialogClose();
    } catch (error) {
      // Error handled by useErrorListener
      console.error('Failed to submit call:', error);
    }
  };

  const getCallResultColor = (result: CallResult): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (result) {
      case CallResult.POSITIVE:
      case CallResult.REQUEST_RECEIVED:
      case CallResult.PROCESSED:
        return 'success';
      case CallResult.NEGATIVE:
      case CallResult.JUNK_DATA:
        return 'error';
      case CallResult.UNREACHABLE:
      case CallResult.NO_CONTACT_INFO:
        return 'warning';
      case CallResult.FOLLOW_UP:
      case CallResult.ROUTINE_CALL:
        return 'info';
      default:
        return 'default';
    }
  };

  const getSalesScenarioColor = (scenario: SalesScenario): 'success' | 'error' | 'warning' | 'info' | 'default' => {
    switch (scenario) {
      case SalesScenario.POSITIVE_FKF_DIRECTED_TO_SALE:
      case SalesScenario.SUPPLIER_FINANCE_CUSTOMER:
        return 'success';
      case SalesScenario.POTENTIAL_UNDECIDED:
      case SalesScenario.POTENTIAL_NEWLY_ESTABLISHED:
        return 'info';
      case SalesScenario.POTENTIAL_WILL_JOIN_LATER:
      case SalesScenario.POTENTIAL_PROBLEM_KKB:
        return 'warning';
      case SalesScenario.POTENTIAL_NO_LONGER_INTERESTED:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />} onClick={handleAddClick}>
          Yeni Görüşme Ekle
        </Button>
      </Box>

      <Table<CallHistory>
        id="CallHistoryTable"
        rowId="Id"
        headers={tableHeaders}
        data={tableData}
        loading={isLoading}
        size="medium"
        rowActions={[
          {
            Element: ({ row }) => {
              if (!row) return null;
              return (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" variant="outlined" onClick={() => handleEditClick(row)}>
                    Düzenle
                  </Button>
                  <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteClick(row)}>
                    Sil
                  </Button>
                </Box>
              );
            },
          },
        ]}>
        <Slot<CallHistory> id="CallResult">
          {(value, row) => {
            if (!value) return <Typography variant="body2">-</Typography>;
            // Show CallResultText from API instead of enum value
            const displayText = row?.CallResultText || (value as string);
            return <Chip label={displayText} color={getCallResultColor(value as CallResult)} size="small" />;
          }}
        </Slot>
        <Slot<CallHistory> id="SalesScenario">
          {(value, row) => {
            if (!value) return <Typography variant="body2">-</Typography>;
            // Show SalesScenarioText from API instead of enum value
            const displayText = row?.SalesScenarioText || (value as string);
            return <Chip label={displayText} color={getSalesScenarioColor(value as SalesScenario)} size="small" />;
          }}
        </Slot>
      </Table>

      <CallHistoryDialog
        open={dialogOpen}
        callData={selectedCall}
        leadId={leadId}
        customerManagerId={customerManagerId}
        onClose={handleDialogClose}
        onSubmit={handleDialogSubmit}
      />
    </Box>
  );
};
