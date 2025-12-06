import {
  Box,
  Chip,
  CircularProgress,
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
import type { FigoScoreProFormData } from '../../customer-request-branch-detail.types';

export interface CurrentManagementProps {
  figoScoreData?: FigoScoreProFormData;
  isLoading: boolean;
}

/**
 * Current Management Step Component
 * Displays management staff information matching legacy layout exactly
 */
export const CurrentManagement: React.FC<CurrentManagementProps> = ({ figoScoreData, isLoading }) => {
  const stepData = figoScoreData?.CurrentManagementStaff;
  const managementList = stepData?.ManagementStaff || [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" p={4}>
        <CircularProgress size={24} sx={{ mr: 2 }} />
        <Typography>Yönetim bilgileri yükleniyor...</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Yönetim Kadrosu
      </Typography>

      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Ad</TableCell>
              <TableCell>Soyad</TableCell>
              <TableCell>Pozisyon/Rol</TableCell>
              <TableCell>İmza Yetkisi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {managementList.length > 0 ? (
              managementList.map((staff, index) => (
                <TableRow key={`management-${index}`}>
                  <TableCell>{staff.FirstName || 'Veri bekleniyor...'}</TableCell>
                  <TableCell>{staff.LastName || 'Veri bekleniyor...'}</TableCell>
                  <TableCell>{staff.Role || 'Veri bekleniyor...'}</TableCell>
                  <TableCell>
                    {staff.AuthorizedSignatory !== undefined ? (
                      <Chip
                        label={staff.AuthorizedSignatory ? 'Var' : 'Yok'}
                        color={staff.AuthorizedSignatory ? 'success' : 'default'}
                        size="small"
                      />
                    ) : (
                      'Veri bekleniyor...'
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                  Yönetim kadrosu bilgileri henüz yüklenmedi.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
