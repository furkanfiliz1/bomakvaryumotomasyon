import { AllowanceKind, NotifyBuyer, ProductTypes } from '@types';

export const getProductTypeFlags = (allowanceKind: AllowanceKind | null, allowanceNotifyBuyer: NotifyBuyer | null) => {
  return {
    //Spot
    isSpot: allowanceKind === AllowanceKind.SPOT_WITH_INVOICE,
    //isSpotWithoutInvoice
    isSpotWithoutInvoice: allowanceKind === AllowanceKind.SPOT_WITHOUT_INVOICE,
    //isReceivable
    isReceivable: allowanceKind === AllowanceKind.RECEIVABLE,
    //isCommercialLoan
    isCommercialLoan: allowanceKind === AllowanceKind.COMMERCIAL_LOAN,
    //isRotativeLoan
    isRotativeLoan: allowanceKind === AllowanceKind.ROTATIVE_LOAN,
    // INSTANT_BUSINESS_LOAN corresponds to allowanceKind === 13 in legacy system
    // Currently not defined in AllowanceKind enum, but exists in ProductTypes for future compatibility
    isInstantBusinessLoan: allowanceKind === AllowanceKind.INSTANT_BUSINESS_LOAN,
    isCheque: allowanceKind === AllowanceKind.CHEQUE && allowanceNotifyBuyer === NotifyBuyer.FKF_KOBI,
    isSme: allowanceKind === AllowanceKind.INVOICE && allowanceNotifyBuyer === NotifyBuyer.FKF_KOBI,
    isSupplier: allowanceKind === AllowanceKind.INVOICE && allowanceNotifyBuyer === NotifyBuyer.AG_TEDARIKCI,
  };
};

export const getProductTypeFromFlags = (productTypeFlags: ReturnType<typeof getProductTypeFlags>): ProductTypes => {
  const {
    isSpot,
    isSpotWithoutInvoice,
    isCheque,
    isReceivable,
    isCommercialLoan,
    isRotativeLoan,
    isInstantBusinessLoan,
    isSme,
    isSupplier,
  } = productTypeFlags;

  if (isSpot) return ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE;
  if (isSpotWithoutInvoice) return ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE;
  if (isCheque) return ProductTypes.CHEQUES_FINANCING;
  if (isReceivable) return ProductTypes.RECEIVABLE_FINANCING;
  if (isCommercialLoan) return ProductTypes.COMMERCIAL_LOAN;
  if (isRotativeLoan) return ProductTypes.ROTATIVE_LOAN;
  if (isInstantBusinessLoan) return ProductTypes.INSTANT_BUSINESS_LOAN;
  if (isSme) return ProductTypes.SME_FINANCING;
  if (isSupplier) return ProductTypes.SUPPLIER_FINANCING;
  return ProductTypes.SUPPLIER_FINANCING;
};

export function shouldUseSenderEndpoint(productType: ProductTypes): boolean {
  const senderTypes = [
    ProductTypes.SME_FINANCING,
    ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE,
    ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE,
    ProductTypes.CHEQUES_FINANCING,
    ProductTypes.COMMERCIAL_LOAN,
    ProductTypes.ROTATIVE_LOAN,
    ProductTypes.INSTANT_BUSINESS_LOAN,
  ];
  return senderTypes.includes(productType);
}

export function getKindFromProductType(productType: ProductTypes): number {
  switch (productType) {
    case ProductTypes.SUPPLIER_FINANCING:
      return 1;
    case ProductTypes.CHEQUES_FINANCING:
      return 2;
    case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
      return 4;
    case ProductTypes.RECEIVABLE_FINANCING:
      return 5;
    case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      return 6;
    case ProductTypes.ROTATIVE_LOAN:
      return 7;
    case ProductTypes.COMMERCIAL_LOAN:
      return 8;
    case ProductTypes.INSTANT_BUSINESS_LOAN:
      return 9; // API expects kind=9 for instant commercial loan
    case ProductTypes.SME_FINANCING:
      return 1;
    default:
      return 1;
  }
}

export function getPageTitle(input: ProductTypes | ReturnType<typeof getProductTypeFlags>): string {
  const productType = typeof input === 'object' ? getProductTypeFromFlags(input) : input;
  switch (productType) {
    case ProductTypes.CHEQUES_FINANCING:
      return 'Çek Finansmanı Talep Detayları';
    case ProductTypes.SUPPLIER_FINANCING:
      return 'Tedarikçi Finansmanı Talep Detayları';
    case ProductTypes.SME_FINANCING:
      return 'Fatura Finansmanı Talep Detayları';
    case ProductTypes.RECEIVABLE_FINANCING:
      return 'Alacak Finansmanı Talepleri Yönetimi';
    case ProductTypes.COMMERCIAL_LOAN:
      return 'Taksitli Ticari Talep Detayları';
    case ProductTypes.ROTATIVE_LOAN:
      return 'Rotatif Kredi Talepleri Yönetimi';
    case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      return 'Faturasız Spot Talep Detayları';
    case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
      return 'Spot kredi talepleri yönetimi';
    case ProductTypes.INSTANT_BUSINESS_LOAN:
      return 'Anında Ticari Kredi Talep Detayları';

    default:
      return 'İskonto İşlemi Talepler';
  }
}

export function getPageDescription(productType: ProductTypes): string {
  switch (productType) {
    case ProductTypes.CHEQUES_FINANCING:
      return 'Çek tahsilat işlemleri';
    case ProductTypes.RECEIVABLE_FINANCING:
      return 'Alacak finansmanı talepleri yönetimi';
    case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
      return 'Spot kredi talepleri yönetimi';
    case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
      return 'Spot kredi talepleri yönetimi';
    case ProductTypes.COMMERCIAL_LOAN:
      return 'Taksitli ticari kredi talepleri yönetimi';
    case ProductTypes.ROTATIVE_LOAN:
      return 'Rotatif kredi talepleri yönetimi';
    case ProductTypes.INSTANT_BUSINESS_LOAN:
      return 'Anında Ticari Kredi Talep Detayları';
    default:
      return 'İskonto işlemleri yönetimi';
  }
}

export function getDetailPath(allowanceId: number): string {
  return `/iskonto-islemleri/detay/${allowanceId}`;
}
