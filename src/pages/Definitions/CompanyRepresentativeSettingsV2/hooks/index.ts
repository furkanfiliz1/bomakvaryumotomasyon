/**
 * Company Representative Settings V2 Hooks
 * Re-exports from V1 hooks and adds V2-specific hooks
 */

// Re-export V1 hooks
export { useCompanyRepresentativeDropdownData } from '../../CompanyRepresentativeSettings/hooks/useCompanyRepresentativeDropdownData';
export { default as useCompanyRepresentativeFilterForm } from '../../CompanyRepresentativeSettings/hooks/useCompanyRepresentativeFilterForm';
export { useCompanyRepresentativeQueryParams } from '../../CompanyRepresentativeSettings/hooks/useCompanyRepresentativeQueryParams';

// V2 hooks
export { useOptimizedSelection } from './useOptimizedSelection';
export { useRowEditState } from './useRowEditState';
