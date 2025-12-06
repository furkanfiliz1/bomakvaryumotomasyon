import { OrderGetResponseModel } from '@store';
import { FC } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';

interface Props {
  row: OrderGetResponseModel | undefined;
  isBuyer?: boolean;
  id: string;
}

const ReceivableNameCell: FC<Props> = (props) => {
  const { row, isBuyer, id } = props;

  return (
    <DoubleTextCell
      maxWidth={300}
      primaryText={
        isBuyer 
        ? row?.SenderName ? `${row?.SenderName}` : '-'
        : row?.ReceiverName ? `${row?.ReceiverName}` : '-'
      }
      secondaryText={row?.OrderNo ? `${row.OrderNo}` : '-'}
      id={id}
    />
  );
};

export default ReceivableNameCell;
