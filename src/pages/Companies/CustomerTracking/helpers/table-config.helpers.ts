import { HeadCell } from 'src/components/common/Table/types';
import { CustomerTrackingItem } from '../customer-tracking.types';

// Table headers matching the image columns: Unvan, VKN/TCKN, Arama Sonucu, Ürün, Kayıt Tarihi
export function getCustomerTrackingTableHeaders(): HeadCell[] {
  return [
    {
      id: 'CompanyName',
      label: 'Unvan',
      width: 250,
      slot: true, // Custom formatting needed for company info
    },
    {
      id: 'Identifier',
      label: 'VKN/TCKN',
      width: 150,
    },
    {
      id: 'CallResultTypeName',
      label: 'Arama Sonucu',
      width: 200,
      slot: true, // Custom formatting for null values
    },
    {
      id: 'ProductTypes',
      label: 'Ürün',
      width: 250,
      slot: true, // Custom formatting for product types array
    },
    {
      id: 'InsertDatetime',
      label: 'Kayıt Tarihi',
      width: 150,
      type: 'date-time',
    },
    {
      id: 'actions',
      label: 'İşlemler',
      width: 120,
      slot: true,
      isSortDisabled: true,
      props: { align: 'center' },
    },
  ];
}

// Format customer company info for display
export function formatCustomerInfo(customer: CustomerTrackingItem) {
  return {
    name: customer.CompanyName,
    displayName:
      customer.CompanyName?.length > 35 ? `${customer.CompanyName.substring(0, 35)}...` : customer.CompanyName,
    identifier: customer.Identifier,
    fullName: customer.CompanyName,
  };
}

// Format call result type name, show "-" for null
export function formatCallResult(callResultTypeName: string | null): string {
  return callResultTypeName || '-';
}

// Format product types array for display
export function formatProductTypesForDisplay(
  productTypes: Array<{ ProductType: number; ProductTypeDescription: string }> | null,
): string {
  if (!productTypes || productTypes.length === 0) {
    return '-';
  }

  // Show product descriptions, comma separated
  return productTypes.map((p) => p.ProductTypeDescription).join(', ');
}
