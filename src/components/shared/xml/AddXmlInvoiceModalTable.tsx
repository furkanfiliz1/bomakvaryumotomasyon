import { Button, Icon, InputCurrencyWithoutForm, InvoiceDatePicker, Slot, Table } from '@components';
import { RESPONSE_DATE } from '@constant';
import { Box, CircularProgress, IconButton, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import { Dispatch, FC, SetStateAction, useCallback } from 'react';
import { HeadCell, RowActions } from 'src/components/common/Table/types';
import DoubleTextCell from '../DoubleTextCell';
import { InvoiceTableData } from './AddXMLInvoiceModal';

interface Props {
  setInvoiceTableData: Dispatch<SetStateAction<InvoiceTableData[]>>;
  invoiceTableData: InvoiceTableData[];
}

const headers: HeadCell[] = [
  { id: 'icon', label: 'Dosya', slot: true },
  { id: 'invoiceId', label: 'Satıcı Bilgileri', slot: true },
  { id: 'fileJson.senderIdentifier', label: 'Alıcı Bilgileri', slot: true },
  { id: 'invoiceNumber', label: 'Fatura No', slot: true },
  { id: 'invoiceType', label: 'Fatura Tipi', slot: true },
  { id: 'hashCode', label: 'Hash Kodu', slot: true },
  { id: 'fileJson.issueDate', label: 'Fatura Tarihi', type: 'date', slot: true },
  { id: 'fileJson.paymentDueDate', label: 'Vade Tarihi', type: 'date', slot: true },
  { id: 'payableAmount', label: 'Fatura Tutarı', type: 'currency', slot: true, width: 250 },
];

const AddXmlInvoiceModalTable: FC<Props> = (props) => {
  const { invoiceTableData, setInvoiceTableData } = props;
  const theme = useTheme();

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
  }, []);

  const onIvoicePayableAmountChange = useCallback(
    (newValue: undefined | number, index: number) => {
      setInvoiceTableData((invoiceTableData) => {
        const newInvoiceTableData = cloneDeep(invoiceTableData);
        newInvoiceTableData[index].fileJson.approvedPayableAmount = newValue || undefined;

        return newInvoiceTableData;
      });
    },
    [setInvoiceTableData],
  );

  const onIvoicePaymentDueDateChange = useCallback(
    (newValue: unknown, index: number, isAllSelected: boolean) => {
      if (isAllSelected) {
        setInvoiceTableData((invoices) => {
          return invoices.map((i) => {
            const newInvoice = cloneDeep(i);
            newInvoice.fileJson.paymentDueDate =
              newValue && dayjs(newValue as string).isValid() ? dayjs(newValue as string).format(RESPONSE_DATE) : null;
            return newInvoice;
          });
        });

        return;
      }

      setInvoiceTableData((invoiceTableData) => {
        const newInvoiceTableData = cloneDeep(invoiceTableData);
        newInvoiceTableData[index].fileJson.paymentDueDate =
          newValue && dayjs(newValue as string).isValid() ? dayjs(newValue as string).format(RESPONSE_DATE) : null;

        return newInvoiceTableData;
      });
    },
    [setInvoiceTableData],
  );

  const onInvoiceIssueDateChange = useCallback(
    (newValue: unknown, index: number, isAllSelected: boolean) => {
      if (isAllSelected) {
        setInvoiceTableData((invoices) => {
          return invoices.map((i) => {
            const newInvoice = cloneDeep(i);
            newInvoice.fileJson.issueDate = dayjs(newValue as string).format(RESPONSE_DATE);
            return newInvoice;
          });
        });

        return;
      }

      setInvoiceTableData((invoiceTableData) => {
        const newInvoiceTableData = cloneDeep(invoiceTableData);
        newInvoiceTableData[index].fileJson.issueDate = dayjs(newValue as string).format(RESPONSE_DATE);

        return newInvoiceTableData;
      });
    },
    [setInvoiceTableData],
  );

  const onInvoiceAmountChange = useCallback(
    (newValue: undefined | number, index: number) => {
      setInvoiceTableData((invoiceTableData) => {
        const newInvoiceTableData = cloneDeep(invoiceTableData);
        newInvoiceTableData[index].fileJson.payableAmount = newValue || undefined;

        return newInvoiceTableData;
      });
    },
    [setInvoiceTableData],
  );

  const deleteRow = (row: InvoiceTableData) => {
    setInvoiceTableData((invoices) => invoices.filter((i) => i.invoiceId !== row.invoiceId));
  };

  const rowActions: RowActions<InvoiceTableData>[] = [
    {
      Element: ({ row }) => (
        <Button
          id="delete-invoice"
          onClick={() => row && deleteRow(row)}
          sx={{ mr: 1.5, color: theme.palette.neutral[600], fontWeight: 600 }}
          variant="text"
          size="medium">
          <Typography sx={{ mr: 1, color: theme.palette.neutral[600] }}>Sil</Typography>
          <Icon icon="trash-04" size={14} color={theme.palette.neutral[600]} />
        </Button>
      ),
    },
  ];

  const profileIdList = [
    {
      Id: 'TEMELFATURA',
      Name: 'Temel Fatura',
    },
    {
      Id: 'TICARIFATURA',
      Name: 'Ticari Fatura',
    },
    {
      Id: 'EARSIVFATURA',
      Name: 'E-Arşiv',
    },
    {
      Id: 'EMUSTAHSIL',
      Name: 'E-Müstahsil',
    },
  ];

  return (
    <Table<InvoiceTableData>
      id="invoiceTable"
      disableSorting
      rowId="invoiceId"
      data={invoiceTableData}
      headers={headers}
      rowActions={rowActions}
      notFoundConfig={{ title: 'İncelenecek XML fatura bulunamadı' }}>
      <Slot<InvoiceTableData> id="invoiceId">
        {(_, row, index) => {
          if (!row?.fileJson.invoiceNumber) return '-';
          return (
            <DoubleTextCell
              maxWidth={300}
              primaryText={row?.fileJson.senderName ? `${row?.fileJson.senderName}` : '-'}
              secondaryText={row?.fileJson.senderIdentifier ? `${row?.fileJson.senderIdentifier}` : '-'}
              id={`invoiceId-${index}`}
            />
          );
        }}
      </Slot>

      <Slot<InvoiceTableData> id="fileJson.senderIdentifier">
        {(_, row) => {
          if (!row?.fileJson.receiverName) return '-';
          return (
            <DoubleTextCell
              maxWidth={300}
              primaryText={row?.fileJson.receiverName ? `${row?.fileJson.receiverName}` : '-'}
              secondaryText={row?.fileJson.receiverIdentifier ? `${row?.fileJson.receiverIdentifier}` : '-'}
              id={`receiverInfo-${row?.invoiceId || 'unknown'}`}
            />
          );
        }}
      </Slot>

      <Slot<InvoiceTableData> id="invoiceNumber">
        {(_, row) => {
          return row?.fileJson.invoiceNumber
            ? row.fileJson.invoiceNumber
            : row?.fileJson.serialNumber && row?.fileJson.sequenceNumber
              ? `${row.fileJson.serialNumber}-${row.fileJson.sequenceNumber}`
              : '-';
        }}
      </Slot>

      <Slot<InvoiceTableData> id="hashCode">
        {(_, row) => {
          if (row?.isLoading) return <CircularProgress size={14} />;
          if (!row?.fileJson.hashCode) return '-';

          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title="Kopyala">
                <IconButton
                  size="small"
                  onClick={() => copyToClipboard(row.fileJson.hashCode || '')}
                  sx={{
                    padding: '2px',
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}>
                  <Icon icon="copy-01" size={14} color={theme.palette.primary.main} />
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ fontSize: '12px', fontFamily: 'monospace' }}>
                {row.fileJson.hashCode.substring(0, 20) + '...'}
              </Typography>
            </Box>
          );
        }}
      </Slot>

      <Slot<InvoiceTableData> id="icon">
        {(_, row) => {
          if (row?.isLoading) return <CircularProgress size={20} />;
          if (row?.fileJson.invoiceNumber) return <img src="/assets/icons/success.png" width={25} alt="success" />;
          else return <img src="/assets/icons/error-file.png" width={25} alt="error" />;
        }}
      </Slot>
      <Slot<InvoiceTableData> id="invoiceType">
        {(_, row) =>
          row?.fileJson?.invoiceType === 'EInvoice'
            ? 'E-Fatura'
            : row?.fileJson?.invoiceType === undefined
              ? '-'
              : 'Kağıt Fatura'
        }
      </Slot>
      <Slot<InvoiceTableData> id="profileId">
        {(_, row) => profileIdList?.find((item) => item.Id === row?.fileJson?.profileId)?.Name}
      </Slot>
      <Slot<InvoiceTableData> id="payableAmount">
        {(_, row, index) => {
          if (row?.isLoading || !row?.fileJson.invoiceNumber) return '-';
          return (
            <InputCurrencyWithoutForm
              style={{ minWidth: 175 }}
              currency={row?.fileJson.payableAmountCurrency || 'TRY'}
              maxLength={14}
              name={`${index}.PayableAmount`}
              id={`${index}.PayableAmount`}
              value={row?.fileJson.payableAmount ?? undefined}
              onChange={(value) => {
                if (value) {
                  onInvoiceAmountChange(Number(value), index!);
                } else {
                  onInvoiceAmountChange(undefined, index!);
                }
              }}
            />
          );
        }}
      </Slot>

      <Slot<InvoiceTableData> id="fileJson.issueDate">
        {(_, row, index) => {
          if (row?.isLoading || !row?.fileJson.invoiceNumber) return '-';

          return (
            <InvoiceDatePicker
              hideRemainingDay
              onChange={(value, isAllSelected) => {
                onInvoiceIssueDateChange(value, index!, isAllSelected);
              }}
              error={false}
              value={row?.fileJson?.issueDate ? row?.fileJson?.issueDate : ''}
            />
          );
        }}
      </Slot>
      <Slot<InvoiceTableData> id="fileJson.approvedPayableAmount">
        {(_, row, index) => {
          if (row?.isLoading || !row?.fileJson.invoiceNumber) return '-';
          return (
            <InputCurrencyWithoutForm
              style={{ minWidth: 175 }}
              currency={row?.fileJson.currency || 'TRY'}
              maxLength={14}
              name={`${index}.PayableAmount`}
              id={`${index}.PayableAmount`}
              value={row?.fileJson.approvedPayableAmount ?? undefined}
              onChange={(value) => {
                if (value) {
                  onIvoicePayableAmountChange(Number(value), index!);
                } else {
                  onIvoicePayableAmountChange(undefined, index!);
                }
              }}
            />
          );
        }}
      </Slot>
      <Slot<InvoiceTableData> id="fileJson.paymentDueDate">
        {(_, row, index) => {
          if (row?.isLoading || !row?.fileJson.invoiceNumber) return '-';

          return (
            <InvoiceDatePicker
              hideRemainingDay
              showClearButton
              onChange={(value, isAllSelected) => {
                onIvoicePaymentDueDateChange(value, index!, isAllSelected);
              }}
              error={false}
              value={row?.fileJson?.paymentDueDate ? row?.fileJson?.paymentDueDate : ''}
            />
          );
        }}
      </Slot>
    </Table>
  );
};

export default AddXmlInvoiceModalTable;
