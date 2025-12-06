import React, { useRef, useState } from 'react';
import { Box, Card, Grid, Typography, styled, useTheme, Button } from '@mui/material';
import { ExcelInvoiceImportModal, ExcelInvoiceImportModalMethods } from './excel';
import { Icon } from '@components';
import RequiredFieldsModal from './RequiredFieldsModal';
import FileSaver from 'file-saver';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  m: 2,
  display: 'flex',
  flexDirection: 'column',
  minHeight: '150px',
  justifyContent: 'center',
}));

const StyledBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  marginBottom: theme.spacing(2),
}));

/**
 * Excel Invoice Add Component
 * Following Portal InvoicesBuyer Add Excel pattern with Operation.RD DDD structure
 */
const InvoiceAddExcel: React.FC = () => {
  const theme = useTheme();
  const modalRef = useRef<ExcelInvoiceImportModalMethods>(null);
  const [requiredViewListVisible, setRequiredViewListVisible] = useState(false);

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  const downloadSampleTemplate = async () => {
    const res = await fetch('/assets/files/FaturaYukleme.xlsx');
    const blob = await res.blob();

    FileSaver.saveAs(blob, 'FaturaYukleme.xlsx');
  };

  return (
    <>
      <Grid container spacing={2} mt={2} mb={2}>
        <Grid item lg={4} md={4} sm={12} xs={12}>
          <StyledCard>
            <StyledBox display="flex" mb={2}>
              <Icon icon="download-03" size={24} color={theme.palette.primary.main} />
              <Typography variant="body1" color="text.primary" sx={{ ml: 1 }}>
                Örnek excel şablonumuzu indirin.
              </Typography>
            </StyledBox>

            <Button
              id="downloadSampleTemplate"
              onClick={downloadSampleTemplate}
              variant="outlined"
              startIcon={<Icon icon="download-03" size={16} />}>
              Şablonu İndir
            </Button>
          </StyledCard>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <StyledCard>
            <StyledBox display="flex" mb={2}>
              <Icon icon="list" size={24} color={theme.palette.primary.main} />
              <Typography variant="body1" color="text.primary" sx={{ ml: 1 }}>
                Doldurulması zorunlu alanları doldurun.
              </Typography>
            </StyledBox>
            <Button
              id="revieRequiredFields"
              variant="outlined"
              onClick={() => setRequiredViewListVisible(true)}
              startIcon={<Icon icon="list" size={16} />}>
              Zorunlu Alanları İncele
            </Button>
          </StyledCard>
        </Grid>

        <Grid item lg={4} md={4} sm={12} xs={12}>
          <StyledCard>
            <StyledBox display="flex" mb={2}>
              <Icon icon="upload-03" size={24} color={theme.palette.primary.main} />
              <Typography variant="body1" color="text.primary" sx={{ ml: 1 }}>
                Doldurduğunuz şablonu yükleyin{' '}
              </Typography>
            </StyledBox>
            <Button
              id="selectFile"
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<Icon icon="upload-03" size={16} />}>
              Fatura Ekle
            </Button>
          </StyledCard>
        </Grid>
      </Grid>

      <RequiredFieldsModal show={requiredViewListVisible} onClose={() => setRequiredViewListVisible(false)} />

      <ExcelInvoiceImportModal ref={modalRef} />
    </>
  );
};

export default InvoiceAddExcel;
