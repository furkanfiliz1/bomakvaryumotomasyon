import { ProductTypes } from '@types';
import type { HeadCell } from '../../../components/common/Table/types';

export function getTableHeaders(productType: ProductTypes): HeadCell[] {
  const baseHeaders: HeadCell[] = [
    { id: 'Id', label: 'Talep No', width: 120, type: 'number' },
    { id: 'StatusDesc', label: 'Durum', width: 140, slot: true },
    { id: 'InsertDatetime', label: 'Talep Tarihi', width: 140, type: 'date' },
    { id: 'SenderCompanyName', label: 'Tedarikçi', width: 200 },
  ];

  switch (productType) {
    case ProductTypes.CHEQUES_FINANCING:
      return [
        ...baseHeaders,
        { id: 'TotalPayableAmount', label: 'Çek Tutarı', width: 140, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Ortalama Vade', width: 100, slot: true },
        { id: 'AllowanceBillCount', label: 'Çek Adedi', width: 100, slot: true },
        { id: 'RemainingChargedAmount', label: 'Kalan Tahsil Tutarı', width: 150, type: 'currency' },
      ];

    case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      return [
        ...baseHeaders,
        { id: 'TotalPayableAmount', label: 'Kredi Tutarı', width: 140, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Vade', width: 100, slot: true },
      ];

    case ProductTypes.COMMERCIAL_LOAN:
      return [
        ...baseHeaders,
        { id: 'TotalPayableAmount', label: 'Kredi Tutarı', width: 140, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Vade', width: 100, slot: true },
      ];

    case ProductTypes.ROTATIVE_LOAN:
      return [
        ...baseHeaders,
        { id: 'ReceiverCompanyName', label: 'Alıcı', width: 200 },
        { id: 'TotalPayableAmount', label: 'Kredi Tutarı', width: 140, type: 'currency' },
        { id: 'TotalPaidAmount', label: 'Ödenen Fatura Tutarı', width: 150, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Vade', width: 100, slot: true },
        { id: 'AllowanceInvoiceCount', label: 'Fatura Adedi', width: 100, slot: true },
      ];

    case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
      return [
        ...baseHeaders,
        { id: 'TotalPayableAmount', label: 'İskonto Başlatılan Tutar', width: 160, type: 'currency' },
        { id: 'ReceiverCompanyName', label: 'Alıcı', width: 200 },
        { id: 'TotalPaidAmount', label: 'Ödenen Fatura Tutarı', width: 150, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AllowanceInvoiceCount', label: 'Fatura Adedi', width: 100, slot: true },
      ];

    case ProductTypes.RECEIVABLE_FINANCING:
      return [
        ...baseHeaders,
        { id: 'ReceiverCompanyName', label: 'Alıcı', width: 200 },
        { id: 'TotalPayableAmount', label: 'Alacak Tutarı', width: 140, type: 'currency' },
        { id: 'TotalPaidAmount', label: 'Ödenen Alacak Tutarı', width: 150, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Ortalama Vade', width: 100, slot: true },
        { id: 'AllowanceInvoiceCount', label: 'Fatura Adedi', width: 100, slot: true },
      ];

    case ProductTypes.SUPPLIER_FINANCING:
      return [
        ...baseHeaders,
        { id: 'ReceiverCompanyName', label: 'Alıcı', width: 200 },
        { id: 'TotalPayableAmount', label: 'Toplam Tutar', width: 140, type: 'currency' },
        { id: 'TotalPaidAmount', label: 'Ödenen Fatura Tutarı', width: 150, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Ortalama Vade', width: 100, slot: true },
        { id: 'AllowanceInvoiceCount', label: 'Fatura Adedi', width: 100, slot: true },
      ];

    case ProductTypes.SME_FINANCING:
      return [
        ...baseHeaders,
        { id: 'ReceiverCompanyName', label: 'Alıcı', width: 200 },
        { id: 'TotalPayableAmount', label: 'Toplam Tutar', width: 140, type: 'currency' },
        { id: 'TotalPaidAmount', label: 'Ödenen Fatura Tutarı', width: 150, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
        { id: 'AvgDueDayCount', label: 'Ortalama Vade', width: 100, slot: true },
        { id: 'AllowanceInvoiceCount', label: 'Fatura Adedi', width: 100, slot: true },
        { id: 'RemainingChargedAmount', label: 'Kalan Tahsil Tutarı', width: 150, type: 'currency' },
      ];

    default:
      return [
        ...baseHeaders,
        { id: 'TotalPayableAmount', label: 'Toplam Tutar', width: 140, type: 'currency' },
        { id: 'FinancerName', label: 'Finansör', width: 180 },
        { id: 'CustomerManagerName', label: 'Müşteri Temsilcisi', width: 180 },
      ];
  }
}
