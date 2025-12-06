/**
 * Integrators Collapse Details
 * Renders nested SubIntegrators in accordion/collapse view
 */

import { Icon, Slot, Table } from '@components';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIntegratorsTableHeaders, hasSubIntegrators } from '../helpers';
import type { Integrator, SubIntegrator } from '../integrators.types';
import { ActiveStatusSlot, BooleanSlot } from './IntegratorsTableSlots';

interface IntegratorsCollapseDetailsProps {
  row: Integrator | SubIntegrator;
  level?: number;
}

/**
 * Creates a stable collapse component for the given level
 * This avoids inline function definition in Table CollapseComponent prop
 */
const createNestedCollapse = (level: number) => {
  const NestedCollapse = ({ row }: { row: SubIntegrator }): React.ReactElement => (
    <IntegratorsCollapseDetails row={row} level={level} />
  );
  return NestedCollapse;
};

// Pre-create components for common nesting levels (2-6)
const NestedCollapseLevel2 = createNestedCollapse(2);
const NestedCollapseLevel3 = createNestedCollapse(3);
const NestedCollapseLevel4 = createNestedCollapse(4);
const NestedCollapseLevel5 = createNestedCollapse(5);
const NestedCollapseLevel6 = createNestedCollapse(6);

const getNestedCollapseComponent = (level: number) => {
  switch (level) {
    case 2:
      return NestedCollapseLevel2;
    case 3:
      return NestedCollapseLevel3;
    case 4:
      return NestedCollapseLevel4;
    case 5:
      return NestedCollapseLevel5;
    case 6:
    default:
      return NestedCollapseLevel6;
  }
};

const IntegratorsCollapseDetails: React.FC<IntegratorsCollapseDetailsProps> = ({ row, level = 1 }) => {
  const navigate = useNavigate();
  const headers = getIntegratorsTableHeaders();

  const handleEdit = useCallback(
    (subIntegrator: SubIntegrator) => {
      navigate(`/definitions/integrators/edit/${subIntegrator.Id}`);
    },
    [navigate],
  );

  // Edit action element
  const EditActionElement = useCallback(
    (props: { row?: SubIntegrator }) => {
      const { row: subRow } = props;
      if (!subRow) return null;
      return (
        <Tooltip title="Düzenle">
          <IconButton size="small" onClick={() => handleEdit(subRow)} color="primary">
            <Icon icon="edit-03" size={16} />
          </IconButton>
        </Tooltip>
      );
    },
    [handleEdit],
  );

  // Toggle collapse action element - only for rows with children
  const ToggleActionElement = useCallback(
    (props: { row?: SubIntegrator; isCollapseOpen?: boolean; toggleCollapse?: () => void }) => {
      const { row: subRow, isCollapseOpen, toggleCollapse } = props;
      if (!subRow) return null;

      const hasChildren = hasSubIntegrators(subRow);
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

  // If no sub-integrators, don't render anything
  if (!row.SubIntegrators || row.SubIntegrators.length === 0) {
    return (
      <Box sx={{ p: 2, pl: level * 3, bgcolor: 'grey.50' }}>
        <Typography variant="body2" color="text.secondary">
          Alt entegratör bulunamadı
        </Typography>
      </Box>
    );
  }

  // Get the pre-created collapse component for the next level
  const NestedCollapseComponent = getNestedCollapseComponent(level + 1);

  return (
    <Box sx={{ p: 2, pl: level * 2, bgcolor: level % 2 === 0 ? 'grey.100' : 'grey.50' }}>
      <Table<SubIntegrator>
        id={`sub-integrators-${row.Id}-level-${level}`}
        rowId="Id"
        data={row.SubIntegrators}
        headers={headers}
        size="small"
        hidePaging
        actionHeaderTitle="İşlemler"
        rowActions={[{ Element: EditActionElement }, { Element: ToggleActionElement, isCollapseButton: true }]}
        CollapseComponent={NestedCollapseComponent}>
        {/* Active status slot */}
        <Slot<SubIntegrator> id="IsActive">{(value) => <ActiveStatusSlot value={Boolean(value)} />}</Slot>

        {/* Background slot */}
        <Slot<SubIntegrator> id="IsBackground">{(value) => <BooleanSlot value={Boolean(value)} />}</Slot>
      </Table>
    </Box>
  );
};

export default IntegratorsCollapseDetails;
