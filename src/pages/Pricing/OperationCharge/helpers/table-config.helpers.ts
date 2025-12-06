import { HeadCell } from 'src/components/common/Table/types';
import { getProductName } from 'src/helpers';
import { OperationChargeDefinitionTypes } from '../constants';

// Table column configuration matching legacy structure exactly
export const operationChargeTableColumns: HeadCell[] = [
  { id: 'Id', label: 'ID' },
  { id: 'ReceiverName', label: 'Alıcı', slot: true, isSortDisabled: true },
  { id: 'SenderName', label: 'Satıcı', slot: true, isSortDisabled: true },
  { id: 'FinancerName', label: 'Finansör', slot: true, isSortDisabled: true },
  { id: 'ProductType', label: 'Ürün', slot: true, isSortDisabled: true },
  { id: 'LastUpdate', label: 'Son Güncelleme Tarihi', type: 'date', isSortDisabled: true },
  { id: 'OperationChargeDefinitionType', label: 'Entegratör Durumu', slot: true, isSortDisabled: true },
  { id: 'actions', label: 'İşlemler', slot: true, isSortDisabled: true, width: 120 },
];

// Product type translation mapping using the existing global helper
export const translateProductTypeName = (productType: number | null | undefined): string => {
  if (productType == null) return '-';

  const productName = getProductName(Number(productType));
  return productName ?? '-';
};

// Operation charge definition type translation (from legacy helper)
export const translateOperationChargeDefinitionType = (type: number | null | undefined): string => {
  if (type == null) return '-';

  const typeValue = Number(type);

  // Use constants matching legacy OperationChargeDefinitionTypes
  const { withIntegrator, withoutIntegrator } = OperationChargeDefinitionTypes;

  if (typeValue === withIntegrator) return 'Entegratörlü';
  if (typeValue === withoutIntegrator) return 'Entegratörsüz';

  return '-';
};

// Truncate text with tooltip logic from legacy
export const truncateWithTooltip = (text?: string, maxLength: number = 14) => {
  if (!text) return { text: '-', showTooltip: false };

  if (text.length > maxLength) {
    return {
      text: `${text.slice(0, maxLength - 2)}..`,
      showTooltip: true,
      fullText: text,
    };
  }

  return { text, showTooltip: false };
};
