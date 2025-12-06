import { IRouteObject } from 'src/router';
import ManualTransactionEntryPage from './ManualTransactionEntryPage';
import { AddFinancialRecordPage, EditFinancialRecordPage, FinancialRecordsListPage } from './components';
import { AddDifferenceEntryPage, DifferenceEntryListPage, EditDifferenceEntryPage } from './components/DifferenceEntry';

export const manualTransactionEntryRouter = [
  {
    path: 'manual-transaction-entry',
    children: [
      {
        index: true,
        Component: ManualTransactionEntryPage,
      },
      {
        path: 'financial-records',
        Component: FinancialRecordsListPage,
      },
      {
        path: 'financial-records/new',
        Component: AddFinancialRecordPage,
      },
      {
        path: 'financial-records/edit/:id',
        Component: EditFinancialRecordPage,
      },
      {
        path: 'difference-entry',
        Component: DifferenceEntryListPage,
      },
      {
        path: 'difference-entry/new',
        Component: AddDifferenceEntryPage,
      },
      {
        path: 'difference-entry/edit/:id',
        Component: EditDifferenceEntryPage,
      },
    ],
  },
] as IRouteObject[];
