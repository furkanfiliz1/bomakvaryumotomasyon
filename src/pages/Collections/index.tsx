import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  TextField,
  Grid,
  Card,
  Chip,
  Drawer,
  Badge,
  IconButton,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FilterListIcon from '@mui/icons-material/FilterList';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect, useMemo } from 'react';
import { useNotice } from '@components';
import { collectionService } from '../../services/collectionService';
import { salesService } from '../../services/salesService';
import { Collection } from '../../types/collection';
import { Sale } from '../../types/sale';
import { formatTurkishCurrency } from '@utils';

interface SaleWithCollection extends Sale {
  totalCollected: number;
  remainingAmount: number;
}

const CollectionsPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [salesWithCollections, setSalesWithCollections] = useState<SaleWithCollection[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSale, setSelectedSale] = useState<SaleWithCollection | null>(null);
  const [collectionAmount, setCollectionAmount] = useState<number>(0);
  const [collectionNotes, setCollectionNotes] = useState<string>('');
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [filterCustomerName, setFilterCustomerName] = useState<string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [collectionsData, salesData] = await Promise.all([
        collectionService.getAllCollections(),
        salesService.getAllSales(),
      ]);

      setCollections(collectionsData);

      // Satışları tahsilatlarla birleştir
      const salesWithCollectionsData: SaleWithCollection[] = salesData.map((sale) => {
        const saleCollections = collectionsData.filter((c) => c.saleId === sale.id);
        const totalCollected = saleCollections.reduce((sum, c) => sum + c.collectedAmount, 0);
        const remainingAmount = sale.total - totalCollected;

        return {
          ...sale,
          totalCollected,
          remainingAmount,
        };
      });

      // Sadece alacağı olanları filtrele
      const receivables = salesWithCollectionsData.filter((s) => s.remainingAmount > 0);
      setSalesWithCollections(receivables);
    } catch (error) {
      console.error('❌ Data loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Veriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenPartialPayment = (sale: SaleWithCollection) => {
    setSelectedSale(sale);
    setCollectionAmount(0);
    setCollectionNotes('');
    setOpenDialog(true);
  };

  const handleOpenFullPayment = (sale: SaleWithCollection) => {
    setSelectedSale(sale);
    setCollectionAmount(sale.remainingAmount);
    setCollectionNotes('Tam Tahsilat');
    setOpenDialog(true);
  };

  const handleAddCollection = async () => {
    if (!selectedSale || collectionAmount <= 0) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Lütfen geçerli bir tutar giriniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    if (collectionAmount > selectedSale.remainingAmount) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tahsilat tutarı kalan tutardan fazla olamaz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);
      await collectionService.addCollection({
        saleId: selectedSale.id || '',
        customerId: selectedSale.customerId,
        customerName: selectedSale.customerName,
        saleTotal: selectedSale.total,
        collectedAmount: collectionAmount,
        date: new Date(),
        notes: collectionNotes,
      });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tahsilat başarıyla kaydedildi ve kasaya eklendi',
        buttonTitle: 'Tamam',
      });

      setOpenDialog(false);
      setSelectedSale(null);
      await loadData();
    } catch (error) {
      console.error('❌ Collection add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tahsilat eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCollection = async (collectionId: string) => {
    try {
      setLoading(true);
      await collectionService.deleteCollection(collectionId);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tahsilat silindi',
        buttonTitle: 'Tamam',
      });

      await loadData();
    } catch (error) {
      console.error('❌ Collection delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tahsilat silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const totalCollected = collections.reduce((sum, c) => sum + c.collectedAmount, 0);
  const totalReceivables = salesWithCollections.reduce((sum, s) => sum + s.remainingAmount, 0);

  // Filtered sales with collections
  const filteredSalesWithCollections = useMemo(() => {
    console.log('salesWithCollections', salesWithCollections);
    let filtered = [...salesWithCollections];

    // Filter by customer name
    if (filterCustomerName) {
      filtered = filtered.filter((sale) => sale.customerName.toLowerCase().includes(filterCustomerName.toLowerCase()));
    }

    // Filter by start date
    if (filterStartDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = sale.date.toDate();
        return saleDate >= new Date(filterStartDate);
      });
    }

    // Filter by end date
    if (filterEndDate) {
      filtered = filtered.filter((sale) => {
        const saleDate = sale.date.toDate();
        return saleDate <= new Date(filterEndDate);
      });
    }

    return filtered;
  }, [salesWithCollections, filterCustomerName, filterStartDate, filterEndDate]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterCustomerName) count++;
    if (filterStartDate) count++;
    if (filterEndDate) count++;
    return count;
  }, [filterCustomerName, filterStartDate, filterEndDate]);

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Tahsilatlar
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={activeFilterCount} color="primary">
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setFilterDrawerOpen(true)}
              size="small">
              Filtreler
            </Button>
          </Badge>
          {activeFilterCount > 0 && (
            <Button
              variant="text"
              color="error"
              onClick={() => {
                setFilterCustomerName('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              size="small">
              Temizle
            </Button>
          )}
        </Box>
      </Box>

      {/* Filter Drawer */}
      <Drawer anchor="right" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: 400, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Filtreler
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Müşteri Adı"
              value={filterCustomerName}
              onChange={(e) => setFilterCustomerName(e.target.value)}
              fullWidth
              size="small"
            />
            <TextField
              label="Başlangıç Tarihi"
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Bitiş Tarihi"
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
            />
          </Box>
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFilterCustomerName('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              fullWidth>
              Temizle
            </Button>
            <Button variant="contained" onClick={() => setFilterDrawerOpen(false)} fullWidth>
              Uygula
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* İstatistik Kartları */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: theme.palette.success.light, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Toplam Tahsilat
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatTurkishCurrency(totalCollected)}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: theme.palette.warning.light, p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Toplam Alacak
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {formatTurkishCurrency(totalReceivables)}
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Alacaklar Listesi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Alacaklar
      </Typography>

      {filteredSalesWithCollections.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
          <Typography color={theme.palette.grey[600]}>
            {salesWithCollections.length === 0 ? 'Alacak bulunmamaktadır' : 'Filtreye uygun alacak bulunamadı'}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {filteredSalesWithCollections.map((sale) => (
            <Paper
              key={sale.id}
              sx={{
                p: 2,
                border: `1px solid ${theme.palette.grey[200]}`,
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {sale.customerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Satış Tarihi: {new Date(sale.date.toDate()).toLocaleDateString('tr-TR')}
                  </Typography>
                  {sale.notes && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ fontStyle: 'italic', display: 'block', mt: 0.5 }}>
                      Not: {sale.notes}
                    </Typography>
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Toplam Tutar
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatTurkishCurrency(sale.total)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Tahsil Edilen
                  </Typography>
                  <Chip label={formatTurkishCurrency(sale.totalCollected)} color="info" size="small" />
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Kalan
                  </Typography>
                  <Chip label={formatTurkishCurrency(sale.remainingAmount)} color="warning" size="small" />
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  startIcon={<PaymentIcon />}
                  onClick={() => handleOpenPartialPayment(sale)}
                  sx={{ py: 1 }}>
                  Kısmi Tahsilat
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircleIcon />}
                  onClick={() => handleOpenFullPayment(sale)}
                  sx={{ py: 1 }}>
                  Tümünü Tahsil Et
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Tahsilat Geçmişi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Tahsilat Geçmişi
      </Typography>

      {collections.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography color={theme.palette.grey[600]}>Henüz tahsilat kaydı bulunmamaktadır</Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {collections.map((collection) => (
            <Paper
              key={collection.id}
              sx={{
                p: 2,
                backgroundColor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.grey[200]}`,
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                    {collection.customerName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {collection.date ? new Date(collection.date).toLocaleDateString('tr-TR') : '-'}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Chip label={formatTurkishCurrency(collection.collectedAmount)} color="success" size="small" />
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteCollection(collection.id!)}
                    title="Sil">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">
                    Satış Toplamı
                  </Typography>
                  <Typography variant="body2">{formatTurkishCurrency(collection.saleTotal)}</Typography>
                </Box>
                {collection.notes && (
                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Not
                    </Typography>
                    <Typography variant="body2">{collection.notes}</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      {/* Tahsilat Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Tahsilat Ekle - {selectedSale?.customerName}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Satış Toplamı: {formatTurkishCurrency(selectedSale?.total)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tahsil Edilen: {formatTurkishCurrency(selectedSale?.totalCollected)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
              Kalan Tutar: {formatTurkishCurrency(selectedSale?.remainingAmount)}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Tahsilat Tutarı"
            type="number"
            value={collectionAmount}
            onChange={(e) => setCollectionAmount(Number(e.target.value))}
            sx={{ mb: 2 }}
            inputProps={{ min: 0, max: selectedSale?.remainingAmount, step: 0.01 }}
          />

          <TextField
            fullWidth
            label="Not"
            multiline
            rows={3}
            value={collectionNotes}
            onChange={(e) => setCollectionNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setSelectedSale(null);
            }}
            color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleAddCollection}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Tahsilat Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CollectionsPage;
