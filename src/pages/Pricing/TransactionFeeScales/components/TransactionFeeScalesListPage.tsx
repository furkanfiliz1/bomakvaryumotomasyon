import { Table, useNotice } from '@components';
import { Add, Delete, Edit } from '@mui/icons-material';
import { Box, Button, Card } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from 'src/components/shared';
import { getTransactionFeeScalesTableHeaders } from '../helpers/transaction-fee-scales-config.helpers';
import { useDeleteTransactionFeeScaleMutation, useGetTransactionFeeScalesQuery } from '../transaction-fee-scales.api';
import { TransactionFeeScale, TransactionFeeScaleFilters } from '../transaction-fee-scales.types';

const TransactionFeeScalesListPage = () => {
  const navigate = useNavigate();
  const notice = useNotice();

  // Empty filters for now since this is not server-side paginated
  const [filters] = useState<TransactionFeeScaleFilters>({});

  // Use direct query instead of useServerSideQuery
  const { data: tableData = [], isLoading, refetch } = useGetTransactionFeeScalesQuery(filters);

  const [deleteTransactionFeeScale] = useDeleteTransactionFeeScaleMutation();

  // Table configuration
  const tableHeaders = useMemo(() => getTransactionFeeScalesTableHeaders(), []);

  const handleEdit = (scale: TransactionFeeScale) => {
    navigate(`/pricing/islem-ucreti-baremleri/${scale.Id}/duzenle`);
  };

  const handleDelete = async (scale: TransactionFeeScale) => {
    try {
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Uyarı',
        message: `"${scale.MinAmount} - ${scale.MaxAmount}" aralığındaki baremini silmek istediğinize emin misiniz?`,
        buttonTitle: 'Evet, Sil',
        catchOnCancel: true,
      });

      await deleteTransactionFeeScale(scale.Id).unwrap();
      refetch();
    } catch (error) {
      // User cancelled or delete failed
      console.error('Delete cancelled or failed:', error);
    }
  };

  const handleCreateNew = () => {
    navigate('/pricing/islem-ucreti-baremleri/yeni');
  };

  // Table row actions configuration
  const tableRowActions = [
    {
      Element: ({ row }: { row?: TransactionFeeScale }) => (
        <Box display="flex" gap={1}>
          <Button startIcon={<Edit />} size="small" variant="outlined" onClick={() => row && handleEdit(row)}>
            Güncelle
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<Delete />}
            color="error"
            onClick={() => row && handleDelete(row)}>
            Sil
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title="Web Sitesi İşlem Ücreti Baremleri"
        subtitle="Web sitesi için işlem ücreti baremleri tanımlayın"
      />

      <Box mx={2}>
        <Box display="flex" justifyContent="flex-start" mb={2}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleCreateNew}
            id="create-transaction-fee-scale-button">
            Yeni Ücret Tanımı Ekle
          </Button>
        </Box>

        <Card sx={{ p: 2 }}>
          <Table
            id="transaction-fee-scales-table"
            rowId="Id"
            headers={tableHeaders}
            data={tableData}
            loading={isLoading}
            rowActions={tableRowActions}
            notFoundConfig={{ title: 'İşlem ücreti baremi bulunamadı' }}
          />
        </Card>
      </Box>
    </>
  );
};

export default TransactionFeeScalesListPage;
