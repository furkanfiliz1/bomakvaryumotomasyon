/**
 * Guarantor Limit Table Component
 * Main table component for displaying guarantor limit details
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
import type { GuarantorCompanyListItem } from '../../company-limit-tab.types';
import { GuarantorLimitTableRow } from './GuarantorLimitTableRow';

interface GuarantorLimitTableProps {
  limit: GuarantorCompanyListItem;
  onUpdateLimit: (limitId: number, detailId: number) => void;
  onDeleteLimit: (detailId: number) => void;
  onTotalLimitChange: (limitId: number, detailId: number, totalLimit: number) => void;
  onIsHoldChange: (limitId: number, detailId: number, isHold: boolean) => void;
  onShowRisksModal: (financerId: number, productType: number) => void;
  isLoading: boolean;
}

export const GuarantorLimitTable: React.FC<GuarantorLimitTableProps> = ({
  limit,
  onUpdateLimit,
  onDeleteLimit,
  onTotalLimitChange,
  onIsHoldChange,
  onShowRisksModal,
  isLoading,
}) => {
  return (
    <TableContainer component={Paper} sx={{ backgroundColor: 'white', overflowX: 'auto' }}>
      <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 930 }}>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, width: 120, minWidth: 120, maxWidth: 120 }}>Finansör</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 100, minWidth: 100, maxWidth: 100 }}>Garantörlük</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 160, minWidth: 160, maxWidth: 160 }}>Tanımlanan Limit</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 140, minWidth: 140, maxWidth: 140 }}>Riskler</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 130, minWidth: 130, maxWidth: 130 }}>Kalan Limit</TableCell>
            <TableCell sx={{ fontWeight: 600, width: 80, minWidth: 80, maxWidth: 80 }}>Hold</TableCell>
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
        <TableBody>
          {limit.LimitDetails && limit.LimitDetails.length > 0 ? (
            limit.LimitDetails.map((detail) => (
              <GuarantorLimitTableRow
                key={detail.Id}
                limit={limit}
                detail={detail}
                onUpdateLimit={onUpdateLimit}
                onDeleteLimit={onDeleteLimit}
                onTotalLimitChange={onTotalLimitChange}
                onIsHoldChange={onIsHoldChange}
                onShowRisksModal={onShowRisksModal}
                isLoading={isLoading}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4, backgroundColor: '#EAECEF' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <List fontSize="large" color="action" />
                  <Typography variant="body2" color="text.secondary">
                    Bu ürün için finansör bulunmuyor
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
