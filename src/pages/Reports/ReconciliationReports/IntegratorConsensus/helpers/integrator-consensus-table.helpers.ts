import { HeadCell } from 'src/components/common/Table/types';

/**
 * Table configuration for Integrator Consensus report
 * Following legacy system column order and labels exactly
 * Columns: Entegratör Ünvanı, İskonto No, Fatura No, Tedarikçi VKN, Tedarikçi Ünvan,
 *          Toplam Fatura Tutarı, İşlem Ücreti, Entegratör Geliri, İşlem Tarihi, Entegrator Bağlılık Durumu
 */
export const getIntegratorConsensusTableHeaders = (): HeadCell[] => [
  {
    id: 'IntegratorName',
    label: 'Entegratör Ünvanı',
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
    id: 'IntegratorCommission',
    label: 'Entegratör Geliri',
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
