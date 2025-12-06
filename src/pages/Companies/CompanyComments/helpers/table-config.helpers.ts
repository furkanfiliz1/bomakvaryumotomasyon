import type { HeadCell } from 'src/components/common/Table/types';

/**
 * Table column configuration for Company Comments
 * Following OperationPricing patterns and project standards
 */
export const getCompanyCommentsTableHeaders = (): HeadCell[] => [
  {
    id: 'UserName',
    label: 'Kullanıcı',
    width: 200,
    slot: true,
  },
  {
    id: 'CommentText',
    label: 'Yorum',
    slot: true,
  },
  {
    id: 'ActivityStatus',
    label: 'Durum',
    width: 150,
    slot: true,
  },
  {
    id: 'InsertDateTime',
    label: 'Tarih',
    type: 'date',
    width: 180,
  },
];
