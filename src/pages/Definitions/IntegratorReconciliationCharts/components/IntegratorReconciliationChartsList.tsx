/**
 * Integrator Reconciliation Charts List Component
 * Displays list of integrator charts with delete functionality
 * Matches legacy renderList() method exactly
 */

import { Slot, Table, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { IconButton, Typography } from '@mui/material';
import React from 'react';
import { NumericFormat } from 'react-number-format';
import { getIntegratorChartsTableHeaders } from '../helpers';
import { useDeleteIntegratorChartMutation } from '../integrator-reconciliation-charts.api';
import type { IntegratorChart } from '../integrator-reconciliation-charts.types';

interface IntegratorReconciliationChartsListProps {
  data: IntegratorChart[];
  isLoading: boolean;
  onRefetch: () => void;
}

/**
 * Table list component with formatted numbers and delete action
 * Following OperationPricing table patterns with custom slots
 */
export const IntegratorReconciliationChartsList: React.FC<IntegratorReconciliationChartsListProps> = ({
  data,
  isLoading,
  onRefetch,
}) => {
  const notice = useNotice();
  const [deleteChart, { isLoading: isDeleting, error: deleteError }] = useDeleteIntegratorChartMutation();

  useErrorListener(deleteError);
  /**
   * Handle delete with confirmation dialog
   * Matches legacy deleteIntegratorCharts behavior
   */
  const handleDelete = (id: number) => {
    const executeDelete = async () => {
      try {
        await deleteChart(id).unwrap();

        // Success notification matching legacy
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Entegratör mutabakat baremi silindi',
        });

        // Refetch data
        onRefetch();
      } catch (err: unknown) {
        // Error notification matching legacy
        console.log(err);
      }
    };

    notice({
      type: 'confirm',
      variant: 'warning',
      title: 'Sil',
      message: 'Bu baremi silmek istediğinizden emin misiniz?',
      buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
      onClick: () => {
        void executeDelete();
      },
      catchOnCancel: true,
    });
  };

  const headers = getIntegratorChartsTableHeaders();

  return (
    <Table<IntegratorChart>
      id="IntegratorChartsTable"
      rowId="Id"
      headers={headers}
      data={data}
      loading={isLoading}
      hidePaging={true} // No pagination, show all items as in legacy
      size="medium">
      {/* Custom slot for PercentFee with "%" prefix */}
      <Slot id="PercentFee">
        {(value?: number | string) => {
          if (!value) return <Typography>-</Typography>;
          return (
            <Typography>
              %
              <NumericFormat displayType="text" thousandSeparator="." decimalSeparator="," value={value} />
            </Typography>
          );
        }}
      </Slot>

      {/* Custom slot for actions (delete button) */}
      <Slot id="actions">
        {(_?: string | number, row?: IntegratorChart) => {
          if (!row) return null;
          return (
            <IconButton
              onClick={() => handleDelete(row.Id)}
              color="error"
              size="small"
              disabled={isDeleting}
              aria-label="Sil">
              <DeleteIcon />
            </IconButton>
          );
        }}
      </Slot>
    </Table>
  );
};
