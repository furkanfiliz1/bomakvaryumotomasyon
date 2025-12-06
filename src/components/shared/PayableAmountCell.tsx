import { AllowanceInvoiceReponseModel, BillGetDetailResponseModel, InvoiceBaseResponseModel } from '@store';
import { FC } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';
import { currencyFormatter } from '@utils';
interface Props {
  row: InvoiceBaseResponseModel | BillGetDetailResponseModel | AllowanceInvoiceReponseModel | undefined;
  id: string;
}
const PayableAmountCell: FC<Props> = (props) => {
  const { row, id } = props;
  const { ApprovedPayableAmount } = (row as InvoiceBaseResponseModel) || {};
  const { PayableAmount, PayableAmountCurrency } = row || {};
  if (!ApprovedPayableAmount && !PayableAmount) return <>-</>;
  return (
    <DoubleTextCell
      primaryText={`${currencyFormatter(PayableAmount, PayableAmountCurrency)}`}
      secondaryText={`Fatura Tutarı: ${currencyFormatter(ApprovedPayableAmount, PayableAmountCurrency)}`}
      primaryFontWeight="600"
      id={id}
    />
  );
};
export default PayableAmountCell;
