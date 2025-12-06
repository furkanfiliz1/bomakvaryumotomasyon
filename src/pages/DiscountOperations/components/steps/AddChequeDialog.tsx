import { Button, Modal, ModalMethods } from '@components';
import { Box, Card, Tab, Tabs } from '@mui/material';
import { Ref, forwardRef, useImperativeHandle, useRef, useState } from 'react';
import BulkChequeUploadForm, { BulkChequeUploadFormMethods } from './BulkChequeUploadForm';
import { ChequeExcelUploadForm, ChequeExcelUploadFormMethods } from './ChequeExcelUploadForm';
import { SingleChequeForm, SingleChequeFormMethods } from './SingleChequeForm';

export interface AddChequeDialogMethods {
  open: () => void;
  close: () => void;
}

interface AddChequeDialogProps {
  onChequeAdded?: () => void;
  companyId?: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`cheque-tabpanel-${index}`}
      aria-labelledby={`cheque-tab-${index}`}
      {...other}>
      {value === index && (
        <Card sx={{ p: 3, mt: 0, background: 'white ', borderTop: 'none', borderRadius: '0 0 8px 8px' }}>
          {children}
        </Card>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `cheque-tab-${index}`,
    'aria-controls': `cheque-tabpanel-${index}`,
  };
}

const AddChequeDialog = ({ onChequeAdded, companyId }: AddChequeDialogProps, ref: Ref<AddChequeDialogMethods>) => {
  const modalRef = useRef<ModalMethods>(null);
  const [activeTab, setActiveTab] = useState(0);

  // Refs for child form components
  const singleChequeFormRef = useRef<SingleChequeFormMethods>(null);
  const bulkChequeFormRef = useRef<BulkChequeUploadFormMethods>(null);
  const excelUploadFormRef = useRef<ChequeExcelUploadFormMethods>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      setActiveTab(0); // Reset to first tab
      modalRef.current?.open();
    },
    close: () => {
      modalRef.current?.close();
    },
  }));

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleClose = () => {
    setActiveTab(0);
    modalRef.current?.close();
  };

  const handleSave = () => {
    switch (activeTab) {
      case 0:
        singleChequeFormRef.current?.submit();
        break;
      case 1:
        bulkChequeFormRef.current?.submit();
        break;
      case 2:
        excelUploadFormRef.current?.submit();
        break;
    }
  };

  const handleClear = () => {
    switch (activeTab) {
      case 0:
        singleChequeFormRef.current?.clear();
        break;
      case 1:
        bulkChequeFormRef.current?.clear();
        break;
      case 2:
        excelUploadFormRef.current?.clear();
        break;
    }
  };

  return (
    <Modal
      ref={modalRef}
      title="Çek Ekle"
      maxWidth="md"
      onClose={handleClose}
      sx={{
        '.MuiDialogContent-root': {
          background: '#f5f6fa',
        },
      }}
      actions={[
        {
          element: () => (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {/* Action buttons will be added later when tabs have content */}
            </Box>
          ),
        },
      ]}>
      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            backgroundColor: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            borderRadius: '8px 8px 0 0',
            alignItems: 'center',
          }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="çek ekleme seçenekleri" variant="fullWidth">
            <Tab label="Tekli Yükleme" {...a11yProps(0)} />
            <Tab label="Çoklu Yükleme" {...a11yProps(1)} />
            <Tab label="Excel ile Ekle" {...a11yProps(2)} />
          </Tabs>
          <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
            <Button id="cancel-cheque-button" onClick={handleClose} variant="outlined" color="secondary">
              İptal
            </Button>
            <Button id="clear-cheque-button" onClick={handleClear} variant="outlined">
              Temizle
            </Button>
            <Button id="save-cheque-button" onClick={handleSave} variant="contained">
              Kaydet
            </Button>
          </Box>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <SingleChequeForm
            ref={singleChequeFormRef}
            companyId={companyId}
            onSuccess={() => {
              onChequeAdded?.();
              handleClose();
            }}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <BulkChequeUploadForm
            ref={bulkChequeFormRef}
            companyId={companyId}
            onSuccess={() => {
              onChequeAdded?.();
              handleClose();
            }}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <ChequeExcelUploadForm
            ref={excelUploadFormRef}
            companyId={companyId}
            onSuccess={() => {
              onChequeAdded?.();
              handleClose();
            }}
          />
        </TabPanel>
      </Box>
    </Modal>
  );
};

export default forwardRef(AddChequeDialog);
