import { IRouteObject } from 'src/router';
import { CheckDetailPage } from './CheckReport/components';
import CheckReportPage from './CheckReport/index.tsx';
import InvoiceAddPage from './InvoiceAdd';
import { InvoiceDetailPage } from './InvoiceDetail';
import InvoiceOperationsPage from './InvoiceOperationsPage';
import InvoiceReportPage from './InvoiceReport';
import InvoiceTransactionPage from './InvoiceTransaction';
import ReceivableAddPage from './ReceivableAdd';
import ReceivableReportPage from './ReceivableReport';
import { ReceivableReportDetailPage } from './ReceivableReport/components';

export const invoiceOperationsRouter = [
  {
    path: 'invoice-operations',
    Component: InvoiceOperationsPage,
  },
  {
    path: 'invoice-operations/invoice-report',
    Component: InvoiceReportPage,
  },
  {
    path: 'invoice-operations/invoice-report/:id',
    Component: InvoiceDetailPage,
  },
  {
    path: 'invoice-operations/invoice-add',
    Component: InvoiceAddPage,
  },
  {
    path: 'invoice-operations/invoice-add/:activeTab',
    Component: InvoiceAddPage,
  },
  {
    path: 'invoice-operations/invoice-transaction',
    Component: InvoiceTransactionPage,
  },
  {
    path: 'invoice-operations/receivable-report',
    Component: ReceivableReportPage,
  },
  {
    path: 'invoice-operations/receivable-report/:id',
    Component: ReceivableReportDetailPage,
  },
  {
    path: 'invoice-operations/receivable-add/:activeTab?',
    Component: ReceivableAddPage,
  },
  {
    path: 'invoice-operations/check-report',
    Component: CheckReportPage,
  },
  {
    path: 'invoice-operations/check-report/:id',
    Component: CheckDetailPage,
  },
] as IRouteObject[];
