/**
 * Lead Add Excel Component
 * Following InvoiceOperations/InvoiceAddExcel pattern with 3-card layout
 * Card 1: Download template, Card 2: Review required fields, Card 3: Upload file
 */

import { Icon } from '@components';
import { Box, Button, Card, Grid, Typography, styled, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import LeadRequiredFieldsModal from './LeadRequiredFieldsModal';
import { ExcelLeadImportModal, ExcelLeadImportModalMethods } from './excel';

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

const LeadAddExcel: React.FC = () => {
  const theme = useTheme();
  const modalRef = useRef<ExcelLeadImportModalMethods>(null);
  const [requiredViewListVisible, setRequiredViewListVisible] = useState(false);

  const handleOpenModal = () => {
    modalRef.current?.open();
  };

  // Generate and download Excel template
  const downloadSampleTemplate = () => {
    // Template data with headers and example rows
    const templateData = [
      ['VKN/TCKN', 'Ünvan', 'Ad', 'Soyad', 'Cep Telefonu', 'Ürünler'],
      ['1234567890', 'Örnek Şirket A.Ş.', 'Ahmet', 'Yılmaz', '5321234567', '3,4,6'],
      ['0987654321', 'Test Ticaret Ltd. Şti.', 'Mehmet', 'Demir', '5329876543', '3,7'],
      ['1122334455', 'Demo İnşaat A.Ş.', 'Ayşe', 'Kaya', '5331234567', '6,8'],
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(templateData);

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // VKN/TCKN
      { wch: 30 }, // Ünvan
      { wch: 15 }, // Ad
      { wch: 15 }, // Soyad
      { wch: 15 }, // Cep Telefonu
      { wch: 30 }, // Ürünler
    ];

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Lead Listesi');

    // Generate and download file
    XLSX.writeFile(wb, 'Lead_Yukleme_Sablonu.xlsx');
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
              id="reviewRequiredFields"
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
                Doldurduğunuz şablonu yükleyin
              </Typography>
            </StyledBox>
            <Button
              id="selectFile"
              variant="contained"
              onClick={handleOpenModal}
              startIcon={<Icon icon="upload-03" size={16} />}>
              Lead Ekle
            </Button>
          </StyledCard>
        </Grid>
      </Grid>

      <LeadRequiredFieldsModal show={requiredViewListVisible} onClose={() => setRequiredViewListVisible(false)} />

      <ExcelLeadImportModal ref={modalRef} />
    </>
  );
};

export { LeadAddExcel };
