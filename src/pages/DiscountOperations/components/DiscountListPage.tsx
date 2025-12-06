import { EnterEventHandle, Form, useNotice } from '@components';
import { useErrorListener, useServerSideQuery } from '@hooks';
import { Clear, Download, Search } from '@mui/icons-material';
import { Box, Button, Card, Grid, Stack } from '@mui/material';
import { ProductTypes } from '@types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageHeader } from '../../../components/shared';
import { useLazyGetAllowancesUnifiedQuery } from '../discount-operations.api';
import { DiscountOperationFilters } from '../discount-operations.types';
import { generateExportFilename } from '../helpers/export.helpers';
import { getDetailPath, getPageDescription, getPageTitle } from '../helpers/product-type.helpers';
import { PaymentFormData, useDiscountFilterForm } from '../hooks';
import { useDropdownData } from '../hooks/useDropdownData';
import { useQueryParams } from '../hooks/useQueryParams';
import CancelAllowanceDialog from './CancelAllowanceDialog';
import CreateOfferWizard from './CreateOfferWizard';
import { PaymentModal } from './PaymentModal';
import { DiscountOperationsList } from './index';

const DiscountListPage = () => {
  const navigate = useNavigate();
  const notice = useNotice();
  const { productTypeValue } = useParams<{
    productTypeLink: string;
    productTypeValue: string;
  }>();

  const productType = Number(productTypeValue) as ProductTypes;

  // Cancel dialog state
  const [cancelDialog, setCancelDialog] = useState<{
    open: boolean;
    allowanceId: number | null;
  }>({
    open: false,
    allowanceId: null,
  });

  // Payment modal state
  const [paymentModal, setPaymentModal] = useState<{
    open: boolean;
    allowanceId: number | null;
  }>({
    open: false,
    allowanceId: null,
  });

  // Create offer wizard state
  const [createOfferWizardOpen, setCreateOfferWizardOpen] = useState(false);

  // Additional filters state for the form
  const [additionalFilters, setAdditionalFilters] = useState<Partial<DiscountOperationFilters>>({});

  // Load dropdown data
  const { buyerList, bankList, customerManagerList, allowanceStatuses, allowancePaymentStatuses } = useDropdownData();

  // Initialize filter form
  const { form, schema, handleSearch, handleReset } = useDiscountFilterForm({
    buyerList,
    bankList,
    customerManagerList,
    allowanceStatuses,
    allowancePaymentStatuses,
    productType,
    onFilterChange: setAdditionalFilters,
  });

  // Generate query parameters
  const { baseQueryParams } = useQueryParams({ productType, additionalFilters });

  // Use the useServerSideQuery hook
  const { data, error, isLoading, isFetching, pagingConfig, handleExport, refetch } = useServerSideQuery(
    useLazyGetAllowancesUnifiedQuery,
    baseQueryParams,
  );

  // Error handling
  useErrorListener(error);

  // Extract table data from useServerSideQuery result
  const tableData = data?.Items || [];

  // Event handlers
  const handleViewDetails = (allowanceId: number) => {
    const detailPath = getDetailPath(allowanceId);
    navigate(detailPath);
  };

  const handleCancelAllowance = (allowanceId: number) => {
    setCancelDialog({
      open: true,
      allowanceId,
    });
  };

  const handleCloseCancelDialog = () => {
    setCancelDialog({
      open: false,
      allowanceId: null,
    });
  };

  const handleCancelSuccess = () => {
    // Refresh the table data after successful cancellation
    refetch();
  };

  const handleCreateOffer = () => {
    setCreateOfferWizardOpen(true);
  };

  const handleCloseCreateOfferWizard = () => {
    setCreateOfferWizardOpen(false);
  };

  const handleBidPayment = (allowanceId: number) => {
    console.log('handleBidPayment called with allowanceId:', allowanceId);
    setPaymentModal({
      open: true,
      allowanceId,
    });
  };

  const handleClosePaymentModal = () => {
    setPaymentModal({
      open: false,
      allowanceId: null,
    });
  };

  const handlePaymentConfirm = (data: PaymentFormData) => {
    // Here you would call the API to save payment information
    console.log('Payment data:', data);
    console.log('Allowance ID:', paymentModal.allowanceId);

    // For now, just close the modal and show a success message
    // In real implementation, you would call a mutation here
    notice({
      title: 'Başarılı',
      message: 'Ödeme bilgileri kaydedildi.',
    });

    handleClosePaymentModal();
    refetch(); // Refresh the table data
  };

  const handleExportClick = () => {
    const customFilename = generateExportFilename(productType);
    handleExport(customFilename);
  };

  return (
    <>
      <PageHeader title={getPageTitle(productType)} subtitle={getPageDescription(productType)} />
      <Box mx={2}>
        {/* Filters */}
        <Card sx={{ mb: 2, p: 2 }}>
          <Form form={form} schema={schema}>
            <Grid item xs={12}>
              <Stack direction="row" justifyContent="space-between" spacing={1} mt={1}>
                <Box>
                  {productType === ProductTypes.CHEQUES_FINANCING && (
                    <Button variant="contained" onClick={handleCreateOffer}>
                      Teklif Oluştur
                    </Button>
                  )}
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="outlined" onClick={handleReset} startIcon={<Clear />}>
                    Temizle
                  </Button>
                  <Button startIcon={<Search />} variant="contained" onClick={handleSearch}>
                    Uygula
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleExportClick}
                    startIcon={<Download />}
                    disabled={isLoading || isFetching}>
                    Excel
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Form>
        </Card>

        {/* List */}
        <DiscountOperationsList
          data={tableData}
          loading={isLoading || isFetching}
          error={error ? String(error) : undefined}
          productType={productType}
          pagingConfig={pagingConfig}
          onCancelAllowance={handleCancelAllowance}
          onBidPayment={handleBidPayment}
          onViewDetails={handleViewDetails}
        />

        {/* Cancel Allowance Dialog */}
        <CancelAllowanceDialog
          open={cancelDialog.open}
          allowanceId={cancelDialog.allowanceId}
          onClose={handleCloseCancelDialog}
          onSuccess={handleCancelSuccess}
        />

        {/* Payment Modal */}
        <PaymentModal
          open={paymentModal.open}
          allowanceId={paymentModal.allowanceId}
          onClose={handleClosePaymentModal}
          onConfirm={handlePaymentConfirm}
        />

        {/* Create Offer Wizard */}
        {createOfferWizardOpen && (
          <CreateOfferWizard open={createOfferWizardOpen} onClose={handleCloseCreateOfferWizard} onSuccess={refetch} />
        )}

        <EnterEventHandle onEnterPress={handleSearch} />
      </Box>
    </>
  );
};

export default DiscountListPage;
