import { FC } from 'react';
import DoubleTextCell from 'src/components/shared/DoubleTextCell';

interface Props {
  row?: {
    SenderName?: string | null;
    InvoiceNumber?: string | null;
    SerialNumber?: string | null;
    SequenceNumber?: string | null;
    ReceiverCompanyName?: string | null;
  };
  id: string;
}

const SenderNameCell: FC<Props> = (props) => {
  const { row, id } = props;

  const primaryText = (() => {
    if (row?.SenderName) return `${row.SenderName}`;
    if (row?.ReceiverCompanyName) return `${row.ReceiverCompanyName}`;
    return '-';
  })();

  const secondaryText = (() => {
    if (row?.InvoiceNumber) return `${row.InvoiceNumber}`;
    return `${row?.SerialNumber}-${row?.SequenceNumber}`;
  })();

  return <DoubleTextCell maxWidth={300} primaryText={primaryText} secondaryText={secondaryText} id={id} />;
};

export default SenderNameCell;
