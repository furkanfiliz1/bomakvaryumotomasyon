/**
 * E-Invoices Table Component
 * Following OperationPricing pattern for table implementation
 * Matches legacy table structure and styling exactly
 */

import { Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React from 'react';
import type { CurrencyInvoices } from '../company-einvoices-tab.types';
import { getTableCellValue } from '../helpers';
import { useEInvoicesTableConfig } from '../hooks';

interface EInvoicesTableProps {
  currencyInvoices: CurrencyInvoices;
}

/**
 * Table component for displaying invoice data for a specific currency
 * Matches legacy table exactly: thead-dark styling, small size, formatted values
 */
export const EInvoicesTable: React.FC<EInvoicesTableProps> = ({ currencyInvoices }) => {
  const { columns, tableStyling } = useEInvoicesTableConfig();

  return (
    <Card sx={tableStyling.card}>
      <CardContent>
        <Typography variant="h6" component="h4" gutterBottom sx={{ marginBottom: 4 }}>
          E-Faturalar ({currencyInvoices.currency})
        </Typography>

        <Table size={tableStyling.table.size}>
          <TableHead sx={tableStyling.tableHead}>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.key} align={column.align || 'left'}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody sx={tableStyling.tableBody}>
            {currencyInvoices.amounts.map((invoice, index) => (
              <TableRow key={`${invoice.year}-${invoice.month}-${index}`}>
                {columns.map((column) => (
                  <TableCell key={column.key} align={column.align || 'left'}>
                    {getTableCellValue(invoice, column, currencyInvoices.currency)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EInvoicesTable;
