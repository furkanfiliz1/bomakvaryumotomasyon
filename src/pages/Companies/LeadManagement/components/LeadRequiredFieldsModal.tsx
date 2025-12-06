/**
 * Lead Required Fields Modal
 * Following InvoiceOperations/RequiredFieldsModal pattern
 * Shows mandatory fields for Excel lead upload
 */

import { Button, Modal, ModalMethods, Slot, Table } from '@components';
import { Box, Typography } from '@mui/material';
import { FC, useEffect, useMemo, useRef } from 'react';
import { useGetProductTypesQuery } from 'src/api/figoParaApi';
import { HeadCell } from 'src/components/common/Table/types';
import { reviewRequiredFieldsList } from './reviewRequiredFieldsListData';

interface LeadRequiredFieldsModalProps {
  show: boolean;
  onClose: () => void;
}

export interface LeadRequiredFieldsModalMethods {
  open: () => void;
  close: () => void;
}

const LeadRequiredFieldsModal: FC<LeadRequiredFieldsModalProps> = ({ show, onClose }) => {
  const modalRef = useRef<ModalMethods>(null);

  // Fetch product types from API
  const { data: productTypesData } = useGetProductTypesQuery();
  const productTypeList = productTypesData || [];

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

  // Turkish field name mapping with product details
  const getFieldName = (key: string): React.ReactNode => {
    const fieldNames: Record<string, string> = {
      taxNumber: 'VKN/TCKN',
      title: 'Ünvan',
      firstName: 'Ad',
      lastName: 'Soyad',
      phone: 'Cep Telefonu',
    };

    // Special handling for products field to show enum values
    if (key === 'products') {
      return (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
            Ürünler (Virgülle ayrılmış ürün numaraları)
          </Typography>
          <Box sx={{ pl: 2 }}>
            {productTypeList.map((product) => (
              <Typography
                key={product.Value}
                variant="caption"
                display="block"
                sx={{ color: 'text.secondary', mb: 0.5 }}>
                • {product.Value} ({product.Description})
              </Typography>
            ))}
          </Box>
        </Box>
      );
    }

    return fieldNames[key] || key;
  };

  const getRequiredStatus = (value: string): string => {
    return value === 'mandatory' ? 'Zorunlu' : 'Opsiyonel';
  };

  const getData = () => {
    return reviewRequiredFieldsList.map((item) => {
      return {
        name: item.name,
        displayName: getFieldName(item.name),
        value: getRequiredStatus(item.value),
      };
    });
  };

  return (
    <Modal ref={modalRef} actions={actions} title="Lead Yüklemesi için Zorunlu Alanlar" onClose={onClose} maxWidth="md">
      <Table rowId="name" data={getData() || []} headers={headers} hidePaging id="reviewRequiredFieldsList">
        <Slot id="name">{(_value, row) => (row as { displayName?: React.ReactNode })?.displayName}</Slot>
      </Table>
    </Modal>
  );
};

export default LeadRequiredFieldsModal;
