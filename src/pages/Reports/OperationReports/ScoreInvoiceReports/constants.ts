// Constants for Score Invoice Reports module
// Exact match with legacy ScoreInvoiceReport integrator data

import type { IntegratorOption } from './score-invoice-reports.types';

// Integrator options - exactly matching legacy implementation
export const INTEGRATOR_OPTIONS: IntegratorOption[] = [
  {
    id: 1,
    identifier: '3840333291',
    name: 'Foriba',
  },
  {
    id: 2,
    identifier: '3250566851',
    name: 'E-Finans',
  },
  {
    id: 3,
    identifier: '6090122074',
    name: 'E-Logo',
  },
  {
    id: 4,
    identifier: '3230512384',
    name: 'EDM',
  },
  {
    id: 5,
    identifier: '4840847211',
    name: 'İzibiz',
  },
];

// Default form values
export const DEFAULT_FORM_VALUES = {
  companyIdentifier: '',
  integratorIdentifier: '',
  date: new Date(Date.now() + 1), // Legacy uses Date.now() + 1
};

// Table headers - matching legacy implementation
export const TABLE_HEADERS = [
  'Tedarikçi Kimlik Numarası',
  'Entegratör Kimlik Numarası',
  'Giden Toplam E-Fatura',
  'Gelen Toplam E-Fatura',
  'Giden Toplam E-Arşiv',
];
