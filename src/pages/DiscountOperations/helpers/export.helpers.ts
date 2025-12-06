import { ProductTypes } from '@types';

const PRODUCT_TYPE_EXPORT_NAMES: Record<ProductTypes, string> = {
  [ProductTypes.SUPPLIER_FINANCING]: 'tedarikci_finansmani',
  [ProductTypes.SME_FINANCING]: 'fatura_finansmani',
  [ProductTypes.CHEQUES_FINANCING]: 'cek_finansmani',
  [ProductTypes.FIGO_KART]: 'figo_kart',
  [ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE]: 'faturali_spot_kredi',
  [ProductTypes.RECEIVABLE_FINANCING]: 'alacak_finansmani',
  [ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE]: 'faturasiz_spot_kredi',
  [ProductTypes.ROTATIVE_LOAN]: 'rotatif_kredi',
  [ProductTypes.FIGO_SKOR]: 'figo_skor',
  [ProductTypes.COMMERCIAL_LOAN]: 'taksitli_ticari_kredi',
  [ProductTypes.FIGO_SKOR_PRO]: 'figo_skor_pro',
  [ProductTypes.INSTANT_BUSINESS_LOAN]: 'anlik_isletme_kredisi',
};

export function generateExportFilename(productType: ProductTypes): string {
  const productName = PRODUCT_TYPE_EXPORT_NAMES[productType] || 'iskonto_islemleri';

  return productName;
}
