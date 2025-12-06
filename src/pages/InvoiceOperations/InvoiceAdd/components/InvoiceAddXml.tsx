import { Button, Icon, ModalMethods } from '@components';
import { Box, Card, Grid, Typography, styled, useTheme } from '@mui/material';
import { ProductTypes, UserTypes } from '@types';
import { useRef } from 'react';
import AddXMLInvoiceModal from 'src/components/shared/xml/AddXMLInvoiceModal';

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

interface InvoiceAddXmlProps {
  isSpot?: boolean;
}

const InvoiceAddXml = ({ isSpot = false }: InvoiceAddXmlProps) => {
  const addXMLInvoiceModal = useRef<ModalMethods>(null);

  const theme = useTheme();

  return (
    <>
      <Box>
        <Grid container spacing={2} mt={2} mb={2}>
          <Grid item lg={4}>
            <StyledCard>
              <StyledBox display="flex" mb={2}>
                <Icon icon="upload-03" size={24} color={theme.palette.neutral[600]} />
                <Typography variant="body1" color="neutral.600" sx={{ ml: 1, flex: 2 }}>
                  {isSpot
                    ? 'Spot kredisi için tek ya da çoklu (max 500 adet) XML fatura ekleyebilirsiniz.'
                    : 'Tek ya da çoklu (max 500 adet) XML fatura ekleyebilirsiniz.'}
                </Typography>
              </StyledBox>
              <Button id="selectFile" variant="outlined" onClick={() => addXMLInvoiceModal.current?.open()}>
                {isSpot ? 'Spot Fatura Ekle' : 'Fatura Ekle'}{' '}
              </Button>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
      <AddXMLInvoiceModal
        type={UserTypes.BUYER}
        ref={addXMLInvoiceModal}
        onSuccess={() => {}}
        productType={isSpot ? ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE : undefined}
      />
    </>
  );
};

export default InvoiceAddXml;
