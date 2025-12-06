import { FC, useEffect, useMemo, useRef } from 'react';
import { Box } from '@mui/material';
import { Button, Modal, ModalMethods, Table } from '@components';
import { HeadCell } from 'src/components/common/Table/types';
import { reviewRequiredFieldsList } from './reviewRequiredFieldsListData';

interface RequiredFieldsModalProps {
  show: boolean;
  onClose: () => void;
}

export interface RequiredFieldsModalMethods {
  open: () => void;
  close: () => void;
}

const RequiredFieldsModal: FC<RequiredFieldsModalProps> = ({ show, onClose }) => {
  const modalRef = useRef<ModalMethods>(null);

  const actions = [
    {
      element: () => (
        <Box textAlign="left">
          <Button
            id="CLOSE"
            variant="outlined"
            onClick={() => {
              onClose();
            }}>
            Kapat
          </Button>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    if (show) {
      modalRef?.current?.open();
    } else {
      modalRef?.current?.close();
    }
  }, [show]);

  const headers: HeadCell[] = useMemo(() => {
    return [
      { id: 'name', label: 'Alan Adı', slot: true },
      { id: 'value', label: 'Zorunluluk Durumu' },
    ];
  }, []);

  // Turkish field name mapping
  const getFieldName = (key: string): string => {
    const fieldNames: Record<string, string> = {
      uuid: 'UUID',
      hashCode: 'Hash Kodu',
      invoiceNumber: 'Fatura Numarası',
      senderIdentifier: 'Gönderen Kimlik (VKN/TCKN)',
      senderName: 'Gönderen Adı',
      receiverIdentifier: 'Alıcı Kimlik (VKN/TCKN)',
      receiverName: 'Alıcı Adı',
      documentCurrency: 'Para Birimi',
      approvedPayableAmount: 'Onaylanmış Ödenecek Tutar',
      payableAmount: 'Orijinal Ödenecek Tutar',
      paymentDueDate: 'Ödeme Vadesi',
      serialNumberMandatory: 'Seri Numarası',
      sequenceNumberMandatory: 'Sıra Numarası',
      typeMandatory: 'Fatura Türü',
      eInvoiceTypeMandatory: 'E-Fatura Türü',
      profileId: 'Profil ID',
      invoiceDate: 'Fatura Tarihi',
      issueDate: 'Düzenleme Tarihi',
      taxFreeAmount: 'Vergisiz Tutar',
    };
    return fieldNames[key] || key;
  };

  const getRequiredStatus = (value: string): string => {
    return value === 'mandatory' ? 'Zorunlu' : 'Opsiyonel';
  };

  const getData = () => {
    return reviewRequiredFieldsList.map((item) => {
      return {
        name: getFieldName(item.name),
        value: getRequiredStatus(item.value),
      };
    });
  };

  return (
    <Modal
      ref={modalRef}
      actions={actions}
      title="Fatura Yüklemesi için Zorunlu Alanlar"
      onClose={onClose}
      maxWidth="lg">
      <Table rowId="name" data={getData() || []} headers={headers} hidePaging id="reviewRequiredFieldsList" />
    </Modal>
  );
};

export default RequiredFieldsModal;
