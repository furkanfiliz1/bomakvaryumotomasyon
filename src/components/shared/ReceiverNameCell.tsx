import { InvoiceBaseResponseModel } from '@store';
import { FC } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';

interface Props {
  row?: InvoiceBaseResponseModel;
  id: string;
}

const ReceiverNameCell: FC<Props> = (props) => {
  const { row, id } = props;
  return (
    <DoubleTextCell
      maxWidth={300}
      primaryText={row?.ReceiverName ? `${row?.ReceiverName}` : '-'}
      secondaryText={row?.InvoiceNumber ? `${row.InvoiceNumber}` : `${row?.SerialNumber}-${row?.SequenceNumber}`}
      id={id}
    />
  );
};

export default ReceiverNameCell;
