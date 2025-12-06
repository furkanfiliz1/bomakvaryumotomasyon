import React from 'react';
import { IconButton } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';
import { Icon } from '@components';
import { formatDateValue } from '../helpers';
import type { ReceivableReportItem } from '../receivable-report.types';
import { getCurrencyPrefix } from '@utils';

interface ReceivableReportTableSlotsProps {
  columnId: string;
  row: ReceivableReportItem;
  navigate?: NavigateFunction;
}

export const ReceivableReportTableSlots: React.FC<ReceivableReportTableSlotsProps> = ({ columnId, row, navigate }) => {
  const handleCellContent = () => {
    switch (columnId) {
      case 'PayableAmount':
        return (
          <>
            {getCurrencyPrefix(row.CurrencyCode)}{' '}
            {new Intl.NumberFormat('tr-TR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.PayableAmount)}
          </>
        );

      case 'PaymentDueDate':
        return <>{formatDateValue(row.PaymentDueDate)}</>;

      case 'IssueDate':
        return <>{formatDateValue(row.IssueDate)}</>;

      case 'CreatedAt':
        return <>{formatDateValue(row.CreatedAt)}</>;

      case 'Actions':
        return (
          <>
            <IconButton
              size="small"
              onClick={() => navigate?.(`/invoice-operations/receivable-report/${row.Id}`)}
              color="primary"
              title="Detay Görüntüle">
              <Icon icon="eye" size={16} />
            </IconButton>
          </>
        );

      // Default cases for text fields
      case 'OrderNo':
        return <>{row.OrderNo || '-'}</>;
      case 'SenderName':
        return <>{row.SenderName || '-'}</>;
      case 'SenderIdentifier':
        return <>{row.SenderIdentifier || '-'}</>;
      case 'ReceiverName':
        return <>{row.ReceiverName || '-'}</>;
      case 'ReceiverIdentifier':
        return <>{row.ReceiverIdentifier || '-'}</>;
      case 'CurrencyCode':
        return <>{row.CurrencyCode || '-'}</>;

      default:
        return <>{String((row as unknown as Record<string, unknown>)[columnId] || '-')}</>;
    }
  };

  return handleCellContent();
};

export default ReceivableReportTableSlots;
