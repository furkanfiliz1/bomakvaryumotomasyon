import { Icon } from '@components';
import { ProductTypes } from '@types';
import { useNavigate } from 'react-router-dom';
import { FeatureCardGrid, PageHeader } from '../../components/shared';
import { DiscountType } from './discount-operations.types';

const discountTypes: DiscountType[] = [
  {
    title: 'buyerApprovedRequests',
    text: 'buyerApprovedquestsTitle',
    link: 'alici-garantili',
    linkId: 'buyerApprovedquestsTitle',
    productType: ProductTypes.SUPPLIER_FINANCING,
  },
  {
    title: 'invoiceFinanceRequests',
    text: 'invoiceRequestsTitle',
    link: 'kolay-finansman',
    linkId: 'easyFinanceRequestsTitle',
    productType: ProductTypes.SME_FINANCING,
  },
  {
    title: 'chequeCollectionRequests',
    text: 'chequeCollectionRequestsTitle',
    link: 'cek-tahsilat',
    linkId: 'chequeRequestsTitle',
    productType: ProductTypes.CHEQUES_FINANCING,
  },
  {
    title: 'spotLoanRequests',
    text: 'spotLoanRequestsTitle',
    link: 'spot-kredi',
    linkId: 'spotLoanRequestsTitle',
    productType: ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE,
  },
  {
    title: 'spotLoanWithoutInvoiceRequests',
    text: 'spotLoanWithoutInvoiceRequestsTitle',
    link: 'fatura-teminatsiz-spot-kredi',
    linkId: 'spotLoanWithoutInvoiceRequestsTitle',
    productType: ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE,
  },
  {
    title: 'receiverFinancingInvoiceRequestsTitle',
    text: 'receiverFinancingInvoiceRequestsDesc',
    link: 'alacak-finansmanı',
    linkId: 'receiverFinancingInvoiceRequestsTitle',
    productType: ProductTypes.RECEIVABLE_FINANCING,
  },
  {
    title: 'commercialLoanRequests',
    text: 'commercialLoanRequestsTitle',
    link: 'taksitli-ticari-kredi',
    linkId: 'commercialLoanRequestsTitle',
    productType: ProductTypes.COMMERCIAL_LOAN,
  },
  {
    title: 'revolvingCreditRequests',
    text: 'revolvingCreditRequestsTitle',
    link: 'rotatif-kredi',
    linkId: 'revolvingCreditRequestsTitle',
    productType: ProductTypes.ROTATIVE_LOAN,
  },
  {
    title: 'instantBusinessLoanRequests',
    text: 'instantBusinessLoanRequestsTitle',
    link: 'aninda-ticari-kredi',
    linkId: 'instantBusinessLoanRequestsTitle',
    productType: ProductTypes.INSTANT_BUSINESS_LOAN,
  },
];

const discountTranslations: Record<string, string> = {
  buyerApprovedRequests: 'Tedarikçi Finansmanı Talepler',
  buyerApprovedquestsTitle: 'Tedarikçi Finansmanı Talep Detayları',
  invoiceFinanceRequests: 'Fatura Finansmanı Talepler',
  invoiceRequestsTitle: 'Fatura Finansmanı Talep Detayları',
  chequeCollectionRequests: 'Çek Finansmanı Talepler',
  chequeCollectionRequestsTitle: 'Çek Finansmanı Talep Detayları',
  spotLoanRequests: 'Faturalı Spot Kredi Talepler',
  spotLoanRequestsTitle: 'Faturalı Spot Kredi Talep Detayları',
  spotLoanWithoutInvoiceRequests: 'Faturasız Spot Kredi Talepler',
  spotLoanWithoutInvoiceRequestsTitle: 'Faturasız Spot Kredi Talep Detayları',
  receiverFinancingInvoiceRequestsTitle: 'Alacak Finansmanı Talep Detayları',
  receiverFinancingInvoiceRequestsDesc: 'Alacak Finansmanı Talep Detayları',
  commercialLoanRequests: 'Taksitli Ticari Kredi Talepler',
  commercialLoanRequestsTitle: 'Taksitli Ticari Kredi Talep Detayları',
  revolvingCreditRequests: 'Rotatif Kredi Talepler',
  revolvingCreditRequestsTitle: 'Rotatif Kredi Talep Detayları',
  instantBusinessLoanRequests: 'Anında Ticari Kredi Talepler',
  instantBusinessLoanRequestsTitle: 'Anında Ticari Kredi Talep Detayları',
};

const DiscountOperationsPage = () => {
  const navigate = useNavigate();

  const handleNavigateToDiscountType = (discountType: DiscountType) => {
    navigate(`/iskonto-islemleri/${discountType.link}/${discountType.productType}`);
  };

  const getIconForDiscountType = (productType: ProductTypes) => {
    switch (productType) {
      case ProductTypes.SUPPLIER_FINANCING:
        return <Icon icon="truck-01" size={16} />;
      case ProductTypes.SME_FINANCING:
        return <Icon icon="receipt" size={16} />;
      case ProductTypes.CHEQUES_FINANCING:
        return <Icon icon="file-check-02" size={16} />;
      case ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE:
        return <Icon icon="credit-card-01" size={16} />;
      case ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE:
        return <Icon icon="credit-card-02" size={16} />;
      case ProductTypes.RECEIVABLE_FINANCING:
        return <Icon icon="coins-01" size={16} />;
      case ProductTypes.COMMERCIAL_LOAN:
        return <Icon icon="bank" size={16} />;
      case ProductTypes.ROTATIVE_LOAN:
        return <Icon icon="refresh-ccw-01" size={16} />;
      default:
        return <Icon icon="activity" size={16} />;
    }
  };

  const cards = discountTypes.map((discountType) => ({
    title: discountTranslations[discountType.title] || discountType.title,
    description: discountTranslations[discountType.text] || discountType.text,
    buttonText: 'Görüntüle',
    onButtonClick: () => handleNavigateToDiscountType(discountType),
    buttonId: discountType.linkId,
    icon: getIconForDiscountType(discountType.productType),
  }));

  return (
    <>
      <PageHeader title="İskonto İşlemleri" subtitle="İskonto ve Kredi Talepleri" />
      <FeatureCardGrid cards={cards} />
    </>
  );
};

export default DiscountOperationsPage;
