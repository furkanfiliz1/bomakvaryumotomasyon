import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { Box, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React from 'react';
import { formatMetricValue } from '../helpers';
import type { InvoiceScoreMetricDefinition } from '../invoice-score-ratios.types';

interface InvoiceScoreRatiosTableProps {
  definitions: InvoiceScoreMetricDefinition[];
  onEdit: (definition: InvoiceScoreMetricDefinition) => void;
  onDelete: (id: number) => void;
}

const InvoiceScoreRatiosTable: React.FC<InvoiceScoreRatiosTableProps> = ({ definitions, onEdit, onDelete }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 2 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Min</TableCell>
            <TableCell>Max</TableCell>
            <TableCell>Değer</TableCell>
            <TableCell>Yüzde</TableCell>
            <TableCell align="center">İşlemler</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {definitions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                Veri bulunamadı
              </TableCell>
            </TableRow>
          ) : (
            definitions.map((definition) => (
              <TableRow key={definition.Id}>
                <TableCell>{formatMetricValue(definition.Min)}</TableCell>
                <TableCell>{formatMetricValue(definition.Max)}</TableCell>
                <TableCell>{definition.Value}</TableCell>
                <TableCell>{definition.Percent}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <IconButton size="small" color="primary" onClick={() => onEdit(definition)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => onDelete(definition.Id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InvoiceScoreRatiosTable;
