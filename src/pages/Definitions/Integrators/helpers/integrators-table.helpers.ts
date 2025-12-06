/**
 * Integrators Table Helpers
 * Table configuration and column definitions
 */

import { HeadCell } from 'src/components/common/Table/types';

/**
 * Get table headers for integrators list
 * Matches legacy column order exactly
 */
export const getIntegratorsTableHeaders = (): HeadCell[] => {
  return [
    {
      id: 'Name',
      label: 'Başlık',
    },
    {
      id: 'Identifier',
      label: 'Vergi No',
    },
    {
      id: 'IsActive',
      label: 'Durum',
      slot: true,
    },
    {
      id: 'IsBackground',
      label: 'Arkaplan',
      slot: true,
    },
    {
      id: 'TypeDescription',
      label: 'Açıklama',
    },
  ];
};

/**
 * Get table headers for params list
 */
export const getParamsTableHeaders = (): HeadCell[] => {
  return [
    {
      id: 'Key',
      label: 'Key',
      width: 100,
    },
    {
      id: 'SubKey',
      label: 'Sub Key',
      width: 120,
    },
    {
      id: 'Description',
      label: 'Tanım',
      width: 150,
    },
    {
      id: 'DataTypeDescription',
      label: 'Tip',
      width: 100,
    },
    {
      id: 'InputDataTypeDescription',
      label: 'Kullanım',
      width: 120,
    },
    {
      id: 'Detail',
      label: 'Detay',
      width: 150,
    },
    {
      id: 'OrderIndex',
      label: 'Sıra',
      width: 80,
      slot: true,
    },
  ];
};
