import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table configuration for Lead Channel Consensus report
 * Following legacy system column order and labels exactly
 * Columns: Lead Kanalı, İskonto No, Fatura No, Tedarikçi VKN, Tedarikçi Ünvan,
 *          Toplam Fatura Tutarı, İşlem Ücreti, Lead Kanalı Geliri, İşlem Tarihi
 */
export const getLeadChannelConsensusTableHeaders = (): HeadCell[] => [
  {
    id: 'LeadChannel',
    label: 'Lead Kanalı',
  },
  {
    id: 'AllowanceId',
    label: 'İskonto No',
  },
  {
    id: 'InvoiceNumber',
    label: 'Fatura No',
  },
  {
    id: 'SenderIdentifier',
    label: 'Tedarikçi VKN',
  },
  {
    id: 'SenderCompanyName',
    label: 'Tedarikçi Ünvan',
  },
  {
    id: 'InvoiceAmount',
    label: 'Toplam Fatura Tutarı',
    type: 'currency',
  },
  {
    id: 'OperationChangeAmount',
    label: 'İşlem Ücreti',
    type: 'currency',
  },
  {
    id: 'LeadChannelComission',
    label: 'Lead Kanalı Geliri',
    type: 'currency',
  },
  {
    id: 'IssueDate',
    label: 'İşlem Tarihi',
    type: 'date',
  },
  {
    id: 'IsIntegratorConnect',
    label: 'Entegrator Bağlılık Durumu',
    slot: true,
  },
];
