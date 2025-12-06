/**
 * Existing Branches Table Component
 * Displays existing branches for selected bank
 */

import { FigoLoading } from '@components';
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
import type { BankBranchItem } from '../bank-branch-bulk-upload.types';

interface ExistingBranchesTableProps {
  bankName: string;
  branches: BankBranchItem[];
  isLoading: boolean;
}

export const ExistingBranchesTable: React.FC<ExistingBranchesTableProps> = ({ bankName, branches, isLoading }) => {
  if (isLoading) {
    return (
      <Paper sx={{ p: 3, mt: 3 }}>
        <FigoLoading />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        {bankName} - Mevcut Şubeler
      </Typography>

      {branches.length > 0 ? (
        <>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Şube Kodu</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Şube Adı</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Banka</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {branches.map((branch) => (
                  <TableRow key={branch.Id} hover>
                    <TableCell>{branch.Code}</TableCell>
                    <TableCell>{branch.Name}</TableCell>
                    <TableCell>{branch.Bank}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Toplam {branches.length} şube bulundu
            </Typography>
          </Box>
        </>
      ) : (
        <Box sx={{ py: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">Bu banka için şube bulunamadı.</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default ExistingBranchesTable;
