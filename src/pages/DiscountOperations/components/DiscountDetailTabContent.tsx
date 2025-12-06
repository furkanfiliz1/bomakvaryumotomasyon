import { AllowanceKind } from '@types';
import React from 'react';
import { getProductTypeFlags } from '../helpers/product-type.helpers';

// Tab component imports
import ChangeProcessTab from './ChangeProcessTab';
import ChequesTab from './ChequesTab';
import CollectionsTab from './CollectionsTab';
import DiscountFeeTab from './DiscountFeeTab';
import DocumentsTab from './DocumentsTab';
import FundingTab from './FundingTab';
import FundingTabSpotWithoutInvoice from './FundingTabSpotWithoutInvoice';
import IntegratorReportsTab from './IntegratorReportsTab';
import InvoicesTab from './InvoicesTab';
import OffersTab from './OffersTab';
import PaymentInfoTab from './PaymentInfoTab';
import ReceivableTab from './ReceivableTab';
import TransactionHistoryTab from './TransactionHistoryTab';

interface DiscountDetailTabContentProps {
  tabIndex: number;
  allowanceId: string;
  allowanceKind: AllowanceKind | null;
  productFlags: ReturnType<typeof getProductTypeFlags>;
  productType: number | undefined;
  allowanceTypeData?: {
    IsCreatedWithTransactionFee?: boolean;
  };
  setTabIndex?: React.Dispatch<React.SetStateAction<number>>;
  refetch: () => void;
}

/**
 * Tab content component that renders the appropriate tab based on the selected index
 * Follows clean architecture by separating tab rendering logic from main component
 */
export const DiscountDetailTabContent: React.FC<DiscountDetailTabContentProps> = ({
  tabIndex,
  allowanceId,
  allowanceKind,
  productFlags,
  productType,
  allowanceTypeData,
  setTabIndex,
  refetch,
}) => {
  console.log('allowanceTypeData', allowanceTypeData);
  const allowanceIdNumber = Number(allowanceId);

  switch (tabIndex) {
    case 0:
      return <TransactionHistoryTab allowanceId={allowanceIdNumber} />;

    case 1:
      if (productFlags.isCheque) {
        return <ChequesTab allowanceId={allowanceIdNumber} />;
      }
      if (productFlags.isReceivable) {
        return <ReceivableTab allowanceId={allowanceIdNumber} kind={allowanceKind || AllowanceKind.RECEIVABLE} />;
      }
      return <InvoicesTab allowanceId={allowanceIdNumber} Kind={allowanceKind || undefined} />;

    case 2:
      return (
        <PaymentInfoTab allowanceId={allowanceIdNumber} kind={allowanceKind || undefined} productType={productType} />
      );

    case 3:
      if (productFlags.isSpotWithoutInvoice || productFlags.isCommercialLoan || productFlags.isInstantBusinessLoan) {
        return <FundingTabSpotWithoutInvoice allowanceId={allowanceIdNumber} />;
      }
      return (
        <FundingTab
          allowanceId={allowanceIdNumber}
          kind={allowanceKind || undefined}
          isSpotWithoutInvoice={productFlags.isSpotWithoutInvoice}
          isSpot={productFlags.isSpot}
          isReceivable={productFlags.isReceivable}
        />
      );

    case 4:
      return (
        <DiscountFeeTab
          allowanceId={allowanceIdNumber}
          kind={allowanceKind || undefined}
          isCreatedWithTransactionFee={allowanceTypeData?.IsCreatedWithTransactionFee}
          isCheque={productFlags.isCheque}
          isSpotWithoutInvoice={productFlags.isSpotWithoutInvoice}
          isSpot={productFlags.isSpot}
          isReceivable={productFlags.isReceivable}
          isCommercialLoan={productFlags.isCommercialLoan}
        />
      );

    case 5:
      return (
        <OffersTab
          allowanceId={allowanceIdNumber}
          kind={allowanceKind || undefined}
          isSpot={productFlags.isSpot}
          isSpotWithoutInvoice={productFlags.isSpotWithoutInvoice}
          isReceivable={productFlags.isReceivable}
          isCommercialLoan={productFlags.isCommercialLoan}
        />
      );

    case 6:
      return <DocumentsTab allowanceId={allowanceIdNumber} isCheque={productFlags.isCheque} />;

    case 7:
      return <IntegratorReportsTab allowanceId={allowanceIdNumber} isDialog={false} />;

    case 8:
      return <CollectionsTab allowanceId={allowanceIdNumber} kind={allowanceKind || AllowanceKind.INVOICE} />;

    case 9:
      return (
        <ChangeProcessTab
          allowanceId={allowanceIdNumber}
          isSpot={productFlags.isSpot}
          isSpotWithoutInvoice={productFlags.isSpotWithoutInvoice}
          onTabChange={setTabIndex}
          onRefresh={refetch}
        />
      );

    default:
      return null;
  }
};
