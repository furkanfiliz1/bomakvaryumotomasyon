import { HeadCell } from 'src/components/common/Table/types';

export const companiesTableHeaders: HeadCell[] = [
  {
    id: 'Status',
    slot: true,
    label: '',
    isSortDisabled: true,
    width: 50,
  },
  {
    id: 'CompanyName',
    label: 'Ünvan',
    isSortDisabled: false,
  },
  {
    id: 'Identifier',
    label: 'VKN/TCKN',
    isSortDisabled: false,
  },
  {
    id: 'CustomerManagerName',
    label: 'Müşteri Temsilcisi',
    isSortDisabled: false,
  },
  {
    id: 'InsertDateTime',
    label: 'Kayıt Tarihi',
    type: 'date',
    isSortDisabled: false,
  },
  {
    id: 'actions',
    slot: true,
    label: '',
    isSortDisabled: true,
    width: 100,
  },
];

export const defaultSortConfig = {
  sort: 'InsertDateTime',
  sortType: 'Desc' as const,
};

export const defaultPaginationConfig = {
  page: 1,
  pageSize: 50,
};
