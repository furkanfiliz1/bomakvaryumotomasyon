/**
 * Lead Management Components Barrel Exports
 * Following OperationPricing pattern
 */

// Active Components
export { LeadAddExcel } from './LeadAddExcel';
export { LeadAddManuel } from './LeadAddManuel';
export { default as LeadAddPage } from './LeadAddPage';
export { default as LeadListPage } from './LeadListPage';
export { default as LeadRequiredFieldsModal } from './LeadRequiredFieldsModal';

// Excel Import Components
export { ExcelLeadImportModal } from './excel';
export type { ExcelLeadImportModalMethods } from './excel';

// Lead Detail Components
export { CallHistoryDialog } from './CallHistoryDialog';
export { CallHistoryTab } from './CallHistoryTab';
export { FirmaDetailsTab } from './FirmaDetailsTab';
export { LeadDetailPage } from './LeadDetailPage';
export { UserDetailsTab } from './UserDetailsTab';

// NOTE: LeadTableSlots is deprecated - Slots are now inline in LeadListPage.tsx
// export { default as LeadTableSlots } from './LeadTableSlots';
