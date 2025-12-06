/**
 * Non-Guarantor Limit Table Component
 * Uses the same table structure as GuarantorLimitTable with non-guarantor business logic
 */

import { List } from '@mui/icons-material';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import React from 'react';
import type { NonGuarantorCompanyListItem } from '../../company-limit-tab.types';
import { NonGuarantorLimitTableRow } from './NonGuarantorLimitTableRow';

interface LimitCardGroup {
  description: string;
  values: NonGuarantorCompanyListItem[];
}

interface NonGuarantorLimitTableProps {
  group: LimitCardGroup;
  onUpdate: (limitId: number) => void;
  onDelete: (limitId: number) => void;
  onFieldChange: (name: string, value: unknown, index: number) => void;
  onShowErrorMessage: (message: string) => void;
  isLoading: boolean;
}

// Helper function to get header cell width
const getHeaderCellWidth = (isInvoiceFinancing: boolean, invoiceWidth: number, normalWidth: number) => ({
  fontWeight: 600,
  width: isInvoiceFinancing ? invoiceWidth : normalWidth,
  minWidth: isInvoiceFinancing ? invoiceWidth : normalWidth,
  maxWidth: isInvoiceFinancing ? invoiceWidth : normalWidth,
});

// Helper function to render table header
const renderTableHeader = (isInvoiceFinancing: boolean) => (
  <TableHead>
    <TableRow>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 140, 160)}>Finansör</TableCell>
      <TableCell sx={{ fontWeight: 600, width: 120, minWidth: 120, maxWidth: 120 }}>Tanımlanan Limit</TableCell>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 120, 140)}>Aktif Limit</TableCell>
      {isInvoiceFinancing && (
        <TableCell sx={{ fontWeight: 600, width: 150, minWidth: 150, maxWidth: 150 }}>Teminatsız Limit</TableCell>
      )}
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 120, 140)}>Figo Toplam</TableCell>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 120, 140)}>Figo Kalan</TableCell>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 70, 80)}>Hold</TableCell>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 70, 80)}>Fokus</TableCell>
      <TableCell sx={getHeaderCellWidth(isInvoiceFinancing, 100, 120)}>Revize Tarihi</TableCell>
      <TableCell
        sx={{
          fontWeight: 600,
          width: 120,
          minWidth: 120,
          maxWidth: 120,
          position: 'sticky',
          right: 0,
          backgroundColor: 'white',
          zIndex: 1,
        }}
        align="center">
        İşlemler
      </TableCell>
    </TableRow>
  </TableHead>
);

// Helper function to render table body
const renderTableBody = (props: {
  group: LimitCardGroup;
  hasData: boolean;
  isInvoiceFinancing: boolean;
  onUpdate: (limitId: number) => void;
  onDelete: (limitId: number) => void;
  onFieldChange: (name: string, value: unknown, index: number) => void;
  onShowErrorMessage: (message: string) => void;
  isLoading: boolean;
}) => {
  const { group, hasData, isInvoiceFinancing, onUpdate, onDelete, onFieldChange, onShowErrorMessage, isLoading } =
    props;
  return (
    <TableBody>
      {hasData ? (
        group.values.map((limit, index) => (
          <NonGuarantorLimitTableRow
            key={limit.Id}
            limit={limit}
            index={index}
            groupDescription={group.description}
            onUpdate={() => onUpdate(limit.Id)}
            onDelete={() => onDelete(limit.Id)}
            onFieldChange={onFieldChange}
            onShowErrorMessage={onShowErrorMessage}
            isLoading={isLoading}
          />
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={isInvoiceFinancing ? 10 : 9} align="center" sx={{ py: 4, backgroundColor: '#EAECEF' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <List fontSize="large" color="action" />
              <Typography variant="body2" color="text.secondary">
                Tercih edilen bankalarla ilgili belirlenen bir limit bulunmamaktadır.
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
};

export const NonGuarantorLimitTable: React.FC<NonGuarantorLimitTableProps> = ({
  group,
  onUpdate,
  onDelete,
  onFieldChange,
  onShowErrorMessage,
  isLoading,
}) => {
  const isInvoiceFinancing = group.description === 'Fatura Finansmanı';
  const hasData = group.values && group.values.length > 0;

  return (
    <Paper sx={{ mb: 2, p: 3, backgroundColor: '#FAFAFA' }}>
      {/* Product Title - matching GuarantorLimitList styling */}
      <Box sx={{ mb: 2, fontSize: '18px', fontWeight: 600 }}>{group.description} Listesi</Box>

      <TableContainer component={Paper} sx={{ backgroundColor: 'white', overflowX: 'auto' }}>
        <Table size="small" sx={{ tableLayout: 'fixed', minWidth: isInvoiceFinancing ? 1200 : 1000 }}>
          {renderTableHeader(isInvoiceFinancing)}
          {renderTableBody({
            group,
            hasData,
            isInvoiceFinancing,
            onUpdate,
            onDelete,
            onFieldChange,
            onShowErrorMessage,
            isLoading,
          })}
        </Table>
      </TableContainer>
    </Paper>
  );
};
