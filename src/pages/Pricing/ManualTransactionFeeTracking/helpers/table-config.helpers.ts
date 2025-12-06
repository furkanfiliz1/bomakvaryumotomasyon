import type { HeadCell } from 'src/components/common/Table/types';

export const getTableHeaders = (): HeadCell[] => [
  {
    id: 'AllowanceId',
    label: 'İskonto Talep No',
  },
  {
    id: 'AllowanceKindDescription',
    label: 'İskonto Tipi',
  },
  {
    id: 'ReceiverIdentifier',
    label: 'Alıcı VKN',
  },
  {
    id: 'ReceiverCompanyName',
    label: 'Alıcı Ünvan',
  },
  {
    id: 'SenderIdentifier',
    label: 'Satıcı VKN',
  },
  {
    id: 'SenderCompanyName',
    label: 'Satıcı Ünvan',
  },
  {
    id: 'AllowanceIssueDate',
    label: 'İşlem Tarihi',
    type: 'date',
  },
  {
    id: 'StatusDescription',
    label: 'Statü',
    slot: true,
  },
];

export const getExportFilename = () => {
  return 'manuel-islem-ucreti-odemeleri-takibi';
};
