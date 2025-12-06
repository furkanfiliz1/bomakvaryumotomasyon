import { Table } from '@components';
import React from 'react';
import type { InvoiceBuyerAnalysisReceiver } from '../company-invoice-buyer-tab.types';
import { useInvoiceBuyerTableData } from '../hooks';

interface InvoiceBuyerReceiversTableProps {
  data: InvoiceBuyerAnalysisReceiver[];
  loading?: boolean;
  error?: string;
}

/**
 * Table component for displaying invoice buyer receivers
 * Follows OperationPricing table pattern
 */
const InvoiceBuyerReceiversTable: React.FC<InvoiceBuyerReceiversTableProps> = ({ data, loading = false, error }) => {
  const { tableHeaders, tableData } = useInvoiceBuyerTableData({ data });

  return (
    <Table<InvoiceBuyerAnalysisReceiver>
      id="invoice-buyer-receivers-table"
      rowId="Identifier"
      data={tableData}
      headers={tableHeaders}
      loading={loading}
      error={error ? 'Veriler yüklenirken bir hata oluştu' : undefined}
      total={tableData.length}
      notFoundConfig={{ title: 'Fatura alıcı verisi bulunamadı' }}
    />
  );
};

export default InvoiceBuyerReceiversTable;
