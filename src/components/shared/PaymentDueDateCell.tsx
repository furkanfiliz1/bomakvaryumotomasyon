import { HUMAN_READABLE_DATE } from '@constant';
import {
  AllowanceInvoiceReponseModel,
  BillGetDetailResponseModel,
  InvoiceBaseResponseModel,
  AllowanceOrderResponseModel,
} from '@store';
import dayjs from 'dayjs';
import { FC } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';

interface Props {
  row:
    | InvoiceBaseResponseModel
    | BillGetDetailResponseModel
    | AllowanceInvoiceReponseModel
    | AllowanceOrderResponseModel
    | undefined;
  id: string;
}

const PaymentDueDateCell: FC<Props> = (props) => {
  const { row, id } = props;
  const { PaymentDueDate } = row || {};

  if (!PaymentDueDate) return <>-</>;

  const remainingDay = dayjs(PaymentDueDate).diff(dayjs(), 'days') + 1;
  return (
    <DoubleTextCell
      primaryText={dayjs(PaymentDueDate).format(HUMAN_READABLE_DATE)}
      secondaryText={`${remainingDay} Gün`}
      id={id}
    />
  );
};

export default PaymentDueDateCell;
