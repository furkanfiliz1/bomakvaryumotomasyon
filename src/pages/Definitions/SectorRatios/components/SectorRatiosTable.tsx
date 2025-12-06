/**
 * Sector Ratios Table Component
 * Displays ratio tallies for selected sector
 * Follows InvoiceScoreRatios pattern
 */

import { Icon, Table, useNotice } from '@components';
import { IconButton, Stack, Tooltip } from '@mui/material';
import React, { useCallback } from 'react';
import { getSectorRatiosTableHeaders } from '../helpers';
import type { RatioTally } from '../sector-ratios.types';

interface SectorRatiosTableProps {
  data: RatioTally[];
  isLoading: boolean;
  onEdit: (ratioTally: RatioTally) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
}

const SectorRatiosTable: React.FC<SectorRatiosTableProps> = ({ data, isLoading, onEdit, onDelete, isDeleting }) => {
  const headers = getSectorRatiosTableHeaders();
  const notice = useNotice();

  // Handle delete with confirmation
  const handleDeleteClick = useCallback(
    (row: RatioTally) => {
      notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Sil',
        message: `"${row.ratio}" rasyosunu silmek istediğinizden emin misiniz?`,
        buttonTitle: isDeleting ? 'Siliniyor...' : 'Evet, Sil',
        onClick: () => {
          onDelete(row.id);
        },
        catchOnCancel: true,
      });
    },
    [notice, onDelete, isDeleting],
  );

  // Create action element to avoid inline function definition
  const ActionElement = useCallback(
    (props: { row?: RatioTally }) => {
      const { row } = props;
      if (!row) return null;
      return (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title="Düzenle">
            <IconButton size="small" onClick={() => onEdit(row)} color="primary">
              <Icon icon="edit-03" size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Sil">
            <IconButton size="small" onClick={() => handleDeleteClick(row)} color="error" disabled={isDeleting}>
              <Icon icon="trash-03" size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
      );
    },
    [onEdit, handleDeleteClick, isDeleting],
  );

  return (
    <Table<RatioTally>
      id="sector-ratios-table"
      rowId="id"
      data={data}
      headers={headers}
      loading={isLoading}
      notFoundConfig={{
        title: 'Listede sektör kaydı yok',
        subTitle: 'Lütfen bir sektör seçin veya yeni kayıt ekleyin',
      }}
      rowActions={[
        {
          Element: ActionElement,
        },
      ]}
      size="small"
    />
  );
};

export default SectorRatiosTable;
