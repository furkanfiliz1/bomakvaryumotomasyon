/**
 * Branches To Add Table Component
 * Displays branches that will be submitted
 */

import { LoadingButton } from '@components';
import { Delete } from '@mui/icons-material';
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import React from 'react';
import type { BranchToAdd } from '../bank-branch-bulk-upload.types';

interface BranchesToAddTableProps {
  branches: BranchToAdd[];
  onRemoveBranch: (code: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export const BranchesToAddTable: React.FC<BranchesToAddTableProps> = ({
  branches,
  onRemoveBranch,
  onSubmit,
  isSubmitting,
}) => {
  if (branches.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
        Eklenecek Şubeler ({branches.length})
      </Typography>

      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Şube Kodu</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Şube Adı</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: 80 }}>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {branches.map((branch, index) => (
              <TableRow key={`${branch.code}-${index}`} hover>
                <TableCell>{branch.code}</TableCell>
                <TableCell>{branch.name}</TableCell>
                <TableCell>
                  <Tooltip title="Sil">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemoveBranch(branch.code)}
                      disabled={isSubmitting}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <LoadingButton
          id="submit-branches-btn"
          variant="contained"
          color="success"
          onClick={onSubmit}
          loading={isSubmitting}>
          Şubeleri Kaydet
        </LoadingButton>
      </Box>
    </Box>
  );
};

export default BranchesToAddTable;
