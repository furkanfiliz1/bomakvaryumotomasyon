import type { HeadCell } from '../../../components/common/Table/types';
import type { CompanyScoring } from '../limit-operations.types';

export const getCompaniesTableHeaders = (): HeadCell[] => [
  {
    id: 'CompanyName',
    label: 'Şirket Bilgileri',
    width: 300,
    slot: true,
  },
  {
    id: 'CustomerManagerFullName',
    label: 'Müşteri Temsilcisi',
  },
  {
    id: 'IntegratorName',
    label: 'Entegratör',
  },
  {
    id: 'IsLimitActive',
    label: 'Limit Durumu',
    slot: true,
    isSortDisabled: false,
  },
  {
    id: 'IsRisk',
    label: 'Risk Durumu',
    slot: true,
    isSortDisabled: false,
  },
  {
    id: 'Limit',
    label: 'Limit',
    type: 'currency',
    isSortDisabled: false,
  },
];

// Helper functions for data formatting
export const formatCompanyInfo = (company: CompanyScoring) => ({
  name: company.CompanyName || '-',
  identifier: company.Identifier || '-',
  displayName:
    company.CompanyName && company.CompanyName.length > 43
      ? `${company.CompanyName.substring(0, 40)}...`
      : company.CompanyName || '-',
});

export const formatCustomerManager = (fullName?: string) => {
  return fullName && fullName !== ' ' ? fullName : '-';
};

export const formatIntegrator = (integratorName?: string) => {
  return integratorName ? integratorName.substring(0, 10) : '-';
};

export const getLimitStatusBadge = (isLimitActive?: boolean | null) => {
  if (isLimitActive === true) {
    return {
      label: 'Aktif',
      color: 'success' as const,
      variant: 'filled' as const,
    };
  } else if (isLimitActive === false) {
    return {
      label: 'Pasif',
      color: 'warning' as const,
      variant: 'filled' as const,
    };
  }
  return {
    label: 'Tanımlanmamış',
    color: 'default' as const,
    variant: 'outlined' as const,
  };
};

export const getRiskStatusBadge = (isRisk?: boolean) => {
  return {
    label: isRisk === true ? 'Donduruldu' : 'Aktif',
    color: isRisk === true ? 'error' : 'success',
    variant: 'filled' as const,
  };
};
