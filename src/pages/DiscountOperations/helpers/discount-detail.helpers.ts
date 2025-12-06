import { AllowanceKind, AllowanceStatusEnum, NotifyBuyer } from '@types';
import { getProductTypeFlags } from './product-type.helpers';

export const shouldCallEasyFinancingAPI = (
  allowanceKind: AllowanceKind | null,
  allowanceNotifyBuyer: NotifyBuyer | null,
): boolean => {
  if (allowanceKind === null) return false;

  return (
    (allowanceKind === AllowanceKind.INVOICE && allowanceNotifyBuyer === NotifyBuyer.FKF_KOBI) ||
    (allowanceKind === AllowanceKind.CHEQUE && allowanceNotifyBuyer === NotifyBuyer.FKF_KOBI) ||
    allowanceKind === AllowanceKind.SPOT_WITH_INVOICE
  );
};

export const shouldCallBuyerApprovedAPI = (
  allowanceKind: AllowanceKind | null,
  allowanceNotifyBuyer: NotifyBuyer | null,
): boolean => {
  if (allowanceKind === null) return false;

  return (
    (allowanceKind === AllowanceKind.INVOICE && allowanceNotifyBuyer === NotifyBuyer.AG_TEDARIKCI) ||
    (allowanceKind === AllowanceKind.RECEIVABLE && allowanceNotifyBuyer === NotifyBuyer.AG_TEDARIKCI)
  );
};

export interface TabConfig {
  index: number;
  label: string;
  show: boolean;
}

export const getTabLabel = (index: number, productTypeFlags: ReturnType<typeof getProductTypeFlags>): string => {
  const { isCheque, isReceivable } = productTypeFlags;

  switch (index) {
    case 0:
      return 'İşlem Tarihçesi';
    case 1:
      if (isCheque) return 'Çekler';
      if (isReceivable) return 'Alacaklar';
      return 'Faturalar';
    case 2:
      return 'Ödeme Bilgileri';
    case 3:
      return 'Fonlama Oranı';
    case 4:
      return 'İşlem Ücretleri';
    case 5:
      return 'Teklifler';
    case 6:
      return 'Dokümanlar';
    case 7:
      return 'Entegrasyon Raporu';
    case 8:
      return 'Tahsilatlar';
    case 9:
      return 'Değişiklik Süreci';
    default:
      return `Tab ${index}`;
  }
};

/**
 * Get the configuration for discount detail tabs based on product flags
 * Based on the original AllowanceReportDetail.js tab rendering conditions
 * Matches the exact legacy system validation logic and tab order
 * Note: Tahsilatlar (Collections) tab is excluded from SpotWithoutInvoice (Faturasız Spot Kredi), CommercialLoan (TTK) and InstantBusinessLoan
 */
export const getDiscountDetailTabs = (
  productFlags: ReturnType<typeof getProductTypeFlags>,
  allowanceNotifyBuyer: NotifyBuyer | null,
  allowanceStatus: number,
): TabConfig[] => {
  const { isSpotWithoutInvoice, isCommercialLoan, isInstantBusinessLoan, isCheque, isReceivable, isSupplier } =
    productFlags;
  // Based on exact legacy AllowanceReportDetail.js tab structure:
  // Tab order: İşlem Tarihçesi, Çekler/Alacaklar/Faturalar, Ödeme Bilgileri, Fonlama Oranı, İşlem Ücretleri, Teklifler, Dokümanlar, Tahsilatlar (not for CommercialLoan)

  // Tab 0: İşlem Tarihçesi - Always show
  const showTransactionHistory = true;

  // Tab 1: Second tab based on type (Çekler/Alacaklar/Faturalar)
  // - Çekler: allowanceKind === 2 (CHEQUE)
  // - Alacaklar: isReceivable
  // - Faturalar: !isSpotWithoutInvoice && !isReceivable && !isCheque && !isCommercialLoan && !isInstantBusinessLoan
  // For InstantBusinessLoan: Only show İşlem Tarihçesi, Ödeme Bilgileri, Fonlama Oranı
  const showSecondTab =
    !isInstantBusinessLoan &&
    (isCheque ||
      isReceivable ||
      (!isSpotWithoutInvoice && !isReceivable && !isCheque && !isCommercialLoan && !isInstantBusinessLoan));

  // Tab 2: Ödeme Bilgileri - Always show
  const showPaymentInfo = true;

  // Tab 3: Fonlama Oranı - Always show
  const showFunding = true;

  // Tab 4: İşlem Ücretleri - Show for all except InstantBusinessLoan
  const showTransactionFees = !isInstantBusinessLoan;

  // Tab 5: Teklifler - Show for all except InstantBusinessLoan
  const showOffers = !isInstantBusinessLoan;

  // Tab 6: Dokümanlar - Show for all except SpotWithoutInvoice, CommercialLoan, InstantBusinessLoan
  const showDocuments = !isSpotWithoutInvoice && !isCommercialLoan && !isInstantBusinessLoan;

  // Tab 7: Entegrasyon Raporu - Show for FKF_KOBI or SpotWithoutInvoice or CommercialLoan (but not InstantBusinessLoan)
  const showIntegrationReport = isCheque;

  // Tab 8: Tahsilatlar - Show for FKF_KOBI only (excluded from SpotWithoutInvoice, CommercialLoan and InstantBusinessLoan)
  const showCollections =
    allowanceNotifyBuyer === NotifyBuyer.FKF_KOBI &&
    !isSpotWithoutInvoice &&
    !isCommercialLoan &&
    !isInstantBusinessLoan;

  // Tab 9: Değişiklik Süreci (Change Process) - Show for FKF_KOBI, SpotWithoutInvoice, Spot, or CommercialLoan (but not InstantBusinessLoan)
  // Based on legacy: (allowanceNotifyBuyer === NotifyBuyerTypes.FKF_KOBI || isSpotWithoutInvoice || isSpot || isCommercialLoan)
  const showChangeProcess =
    !isSupplier && !isReceivable && !isInstantBusinessLoan && allowanceStatus === AllowanceStatusEnum.OdemeAlindi;

  const baseTabs = [
    { index: 0, label: getTabLabel(0, productFlags), show: showTransactionHistory },
    { index: 1, label: getTabLabel(1, productFlags), show: showSecondTab },
    { index: 2, label: getTabLabel(2, productFlags), show: showPaymentInfo },
    { index: 3, label: getTabLabel(3, productFlags), show: showFunding },
    { index: 4, label: getTabLabel(4, productFlags), show: showTransactionFees },
    { index: 5, label: getTabLabel(5, productFlags), show: showOffers },
    { index: 6, label: getTabLabel(6, productFlags), show: showDocuments },
    { index: 7, label: getTabLabel(7, productFlags), show: showIntegrationReport },
    { index: 8, label: getTabLabel(8, productFlags), show: showCollections },
    { index: 9, label: getTabLabel(9, productFlags), show: showChangeProcess },
  ];

  return baseTabs.filter((tab) => tab.show);
};
