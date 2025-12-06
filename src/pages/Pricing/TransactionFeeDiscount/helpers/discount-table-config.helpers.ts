import { HeadCell } from 'src/components/common/Table/types';

export function getTransactionFeeDiscountTableHeaders(): HeadCell[] {
  return [
    { id: 'ReceiverCompanyIdentifier', label: 'Alıcı VKN', slot: true },
    { id: 'SenderCompanyIdentifier', label: 'Satıcı VKN', slot: true },
    { id: 'StartDate', label: 'Başlangıç Tarihi', type: 'date' },
    { id: 'ExpireDateTime', label: 'Bitiş Tarihi', type: 'date' },
    { id: 'Percent', label: 'İndirim(%)', type: 'percent' },
    { id: 'Amount', label: 'İndirim(TL)', type: 'currency' },
    { id: 'TypeName', label: 'Süreç' },
    { id: 'IsActive', label: 'Durumu', slot: true },
  ];
}
