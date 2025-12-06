/**
 * Integrators Table Component
 * Displays integrators list with nested accordion
 */

import { Icon, Slot, Table } from '@components';
import { Box, IconButton, Tooltip } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIntegratorsTableHeaders, hasSubIntegrators } from '../helpers';
import type { Integrator } from '../integrators.types';
import IntegratorsCollapseDetails from './IntegratorsCollapseDetails';
import { ActiveStatusSlot, BooleanSlot } from './IntegratorsTableSlots';

/**
 * Collapse component wrapper for nested integrators
 */
const IntegratorsCollapseWrapper = ({ row }: { row: Integrator }) => <IntegratorsCollapseDetails row={row} />;

interface IntegratorsTableProps {
  data: Integrator[];
  isLoading: boolean;
}

const IntegratorsTable: React.FC<IntegratorsTableProps> = ({ data, isLoading }) => {
  const navigate = useNavigate();
  const headers = getIntegratorsTableHeaders();

  const handleEdit = useCallback(
    (integrator: Integrator) => {
      navigate(`/definitions/integrators/edit/${integrator.Id}`);
    },
    [navigate],
  );

  // Edit action element
  const EditActionElement = useCallback(
    (props: { row?: Integrator }) => {
      const { row } = props;
      if (!row) return null;
      return (
        <Tooltip title="Düzenle">
          <IconButton size="small" onClick={() => handleEdit(row)} color="primary">
            <Icon icon="edit-03" size={16} />
          </IconButton>
        </Tooltip>
      );
    },
    [handleEdit],
  );

  // Toggle collapse action element - only for rows with children
  const ToggleActionElement = useCallback(
    (props: { row?: Integrator; isCollapseOpen?: boolean; toggleCollapse?: () => void }) => {
      const { row, isCollapseOpen, toggleCollapse } = props;
      if (!row) return null;

      const hasChildren = hasSubIntegrators(row);
      if (!hasChildren) return null;

      return (
        <Tooltip title={isCollapseOpen ? 'Kapat' : 'Alt Entegratörler'}>
          <IconButton size="small" onClick={toggleCollapse} color="default">
            <Icon icon={isCollapseOpen ? 'chevron-up' : 'chevron-down'} size={16} />
          </IconButton>
        </Tooltip>
      );
    },
    [],
  );

  return (
    <Box>
      <Table<Integrator>
        id="integrators-table"
        rowId="Id"
        data={data}
        headers={headers}
        loading={isLoading}
        size="small"
        hidePaging
        actionHeaderTitle="İşlemler"
        rowActions={[{ Element: EditActionElement }, { Element: ToggleActionElement, isCollapseButton: true }]}
        CollapseComponent={IntegratorsCollapseWrapper}
        notFoundConfig={{
          title: 'Entegratör bulunamadı',
          subTitle: 'Henüz kayıtlı entegratör bulunmamaktadır',
        }}>
        {/* Active status slot */}
        <Slot<Integrator> id="IsActive">{(value) => <ActiveStatusSlot value={Boolean(value)} />}</Slot>

        {/* Background slot */}
        <Slot<Integrator> id="IsBackground">{(value) => <BooleanSlot value={Boolean(value)} />}</Slot>
      </Table>
    </Box>
  );
};

export default IntegratorsTable;
