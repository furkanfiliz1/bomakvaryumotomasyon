import React, { useRef, useState } from 'react';
import { Box, Card, Grid, Typography, styled, useTheme } from '@mui/material';
import { Button, Icon } from '@components';
import FileSaver from 'file-saver';
import ReviewRequiredFieldsList from './ReviewRequiredFieldsList';
import AddExcelReceivableModal, { AddExcelReceivableModalMethods } from './AddExcelReceivableModal';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  margin: theme.spacing(2, 0),
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
 * Excel Receivable Add Component
 * Following Portal reference pattern from ReceivablesBuyerAddExcel
 */
const ReceivableAddExcel: React.FC = () => {
  const theme = useTheme();
  const addExcelReceivableModalRef = useRef<AddExcelReceivableModalMethods>(null);
  const [requiredViewListVisible, setRequiredViewListVisible] = useState(false);

  const downloadSampleTemplate = async () => {
    const res = await fetch('/assets/files/AlacakYukleme.xlsx');
    const blob = await res.blob();
    // pushEvent('Sample Excel Template Downloaded'); // TODO: Add pushEvent when available

    FileSaver.saveAs(blob, 'AlacakYukleme.xlsx');
  };

  return (
    <>
      <Box sx={{ p: 2, pt: 0 }}>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item lg={4} md={4} sm={12} xs={12}>
            <StyledCard>
              <StyledBox>
                <Icon icon="download-03" size={24} color={theme.palette.neutral?.[600] || '#666'} />
                <Typography variant="body1" color="neutral.600" sx={{ ml: 1 }}>
                  Örnek şablonu indirin ve doldurun
                </Typography>
              </StyledBox>
              <Button id="downloadSampleTemplate" onClick={downloadSampleTemplate} variant="outlined">
                Örnek Şablon İndir
              </Button>
            </StyledCard>
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <StyledCard>
              <StyledBox>
                <Icon icon="list" size={24} color={theme.palette.neutral?.[600] || '#666'} />
                <Typography variant="body1" color="neutral.600" sx={{ ml: 1 }}>
                  Doldurulması zorunlu alanları inceleyin
                </Typography>
              </StyledBox>
              <Button
                id="reviewRequiredFields"
                variant="outlined"
                onClick={() => {
                  // pushEvent('Buyer Receivables Detail Viewed'); // TODO: Add pushEvent when available
                  setRequiredViewListVisible(true);
                }}>
                Zorunlu Alanları İncele
              </Button>
              {requiredViewListVisible && (
                <ReviewRequiredFieldsList
                  show={requiredViewListVisible}
                  onClose={() => {
                    setRequiredViewListVisible(false);
                  }}
                />
              )}
            </StyledCard>
          </Grid>

          <Grid item lg={4} md={4} sm={12} xs={12}>
            <StyledCard>
              <StyledBox>
                <Icon icon="upload-03" size={24} color={theme.palette.neutral?.[600] || '#666'} />
                <Typography variant="body1" color="neutral.600" sx={{ ml: 1 }}>
                  Doldurduğunuz şablonu yükleyin
                </Typography>
              </StyledBox>
              <Button id="selectFile" variant="outlined" onClick={() => addExcelReceivableModalRef.current?.open()}>
                Alacak Ekle
              </Button>
            </StyledCard>
          </Grid>
        </Grid>
        <AddExcelReceivableModal ref={addExcelReceivableModalRef} />
      </Box>
    </>
  );
};

export default ReceivableAddExcel;
