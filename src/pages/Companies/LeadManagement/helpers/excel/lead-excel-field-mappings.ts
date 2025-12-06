/**
 * Excel Field Mappings for Lead Import
 * Following InvoiceOperations pattern for Excel import
 */

import { LeadAddManuelFormData } from '../../lead-management.types';

// Excel column to field mappings
export interface ExcelFieldMapping {
  id: keyof LeadAddManuelFormData;
  required: boolean;
  showOnTable: boolean;
  width?: number;
}

// Table header configuration for Excel review table
export const leadHeaderFieldKeys: ExcelFieldMapping[] = [
  { id: 'taxNumber', required: true, showOnTable: true },
  { id: 'title', required: true, showOnTable: true, width: 200 },
  { id: 'firstName', required: true, showOnTable: true },
  { id: 'lastName', required: true, showOnTable: true },
  { id: 'phone', required: true, showOnTable: true },
  { id: 'products', required: true, showOnTable: true, width: 200 },
];

/**
 * Maps Excel column headers to database field names
 * Turkish column names -> English field names
 */
export const getExcelFieldKey = (key: string): keyof LeadAddManuelFormData => {
  const mappings: Record<string, keyof LeadAddManuelFormData> = {
    VKN: 'taxNumber',
    'VKN/TCKN': 'taxNumber',
    VKNTCKN: 'taxNumber',
    Unvan: 'title',
    Ünvan: 'title',
    Ad: 'firstName',
    Soyad: 'lastName',
    'Cep Telefonu': 'phone',
    Telefon: 'phone',
    'Cep telefonu': 'phone',
    Urunler: 'products',
    Ürünler: 'products',
    'İlgilendiği Ürünler': 'products',
    'Ilgilendigi Urunler': 'products',
  };

  return mappings[key] || 'taxNumber'; // Default fallback
};

/**
 * Get Turkish field label for display
 */
export const getFieldLabel = (fieldId: keyof LeadAddManuelFormData): string => {
  const labels: Record<keyof LeadAddManuelFormData, string> = {
    taxNumber: 'VKN/TCKN',
    title: 'Ünvan',
    firstName: 'Ad',
    lastName: 'Soyad',
    phone: 'Cep Telefonu',
    products: 'Ürünler',
  };

  return labels[fieldId] || fieldId;
};
