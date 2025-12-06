import React from 'react';
import { Chip } from '@mui/material';

/**
 * Table headers configuration for Integration Reports
 * Matches legacy system exactly - Turkish labels from integrationReports language file
 */
export const getOperationReportsTableHeaders = () => [
  {
    id: 'AllowanceId',
    label: 'İskonto No',
    sortable: true,
  },
  {
    id: 'AllowanceStatus',
    label: 'İskonto Durumu',
    sortable: true,
    render: (value: unknown) => {
      if (!value) return '-';
      const status = value as string;
      return React.createElement(Chip, {
        label: status,
        color: 'default',
        size: 'small',
        variant: 'outlined',
      });
    },
  },
  {
    id: 'Description',
    label: 'Açıklama',
    sortable: true,
  },
  {
    id: 'SenderName',
    label: 'Tedarikçi',
    sortable: true,
  },
  {
    id: 'ReceiverName',
    label: 'Alıcı',
    sortable: true,
  },
  {
    id: 'FinancerName',
    label: 'Finans Şirketi',
    sortable: true,
  },
  {
    id: 'Status',
    label: 'Statü',
    sortable: true,
  },
  {
    id: 'InsertedDate',
    label: 'Eklenme Tarihi',
    sortable: true,
    type: 'date' as const,
  },
];
