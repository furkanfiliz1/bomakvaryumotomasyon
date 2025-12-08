import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme,
  CircularProgress,
  TextField,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
} from '@mui/material';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { collectionService } from '../../services/collectionService';
import { salesService } from '../../services/salesService';
import { Collection } from '../../types/collection';
import { Sale } from '../../types/sale';

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

  const totalCollected = collections.reduce((sum, c) => sum + c.collectedAmount, 0);
  const totalReceivables = salesWithCollections.reduce((sum, s) => sum + s.remainingAmount, 0);

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
      </Box>

      {/* İstatistik Kartları */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: theme.palette.success.light }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Toplam Tahsilat
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ₺{totalCollected.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: theme.palette.warning.light }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Toplam Alacak
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 600 }}>
                ₺{totalReceivables.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alacaklar Listesi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Alacaklar
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Müşteri</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Satış Tarihi</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Toplam Tutar</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tahsil Edilen</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Kalan</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                İşlemler
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesWithCollections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color={theme.palette.grey[600]}>Alacak bulunmamaktadır</Typography>
                </TableCell>
              </TableRow>
            ) : (
              salesWithCollections.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{sale.customerName}</TableCell>
                  <TableCell>{new Date(sale.date.toDate()).toLocaleDateString('tr-TR')}</TableCell>
                  <TableCell>₺{sale.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={`₺${sale.totalCollected.toFixed(2)}`} color="info" size="small" />
                  </TableCell>
                  <TableCell>
                    <Chip label={`₺${sale.remainingAmount.toFixed(2)}`} color="warning" size="small" />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenPartialPayment(sale)}
                      sx={{ mr: 1 }}
                      title="Kısmi Tahsilat">
                      <PaymentIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleOpenFullPayment(sale)}
                      title="Tümünü Tahsil Et">
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tahsilat Geçmişi */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Tahsilat Geçmişi
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Müşteri</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Satış Toplamı</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tahsilat Tutarı</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tarih</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Not</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {collections.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3 }}>
                  <Typography color={theme.palette.grey[600]}>Henüz tahsilat kaydı bulunmamaktadır</Typography>
                </TableCell>
              </TableRow>
            ) : (
              collections.map((collection) => (
                <TableRow key={collection.id}>
                  <TableCell>{collection.customerName}</TableCell>
                  <TableCell>₺{collection.saleTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    <Chip label={`₺${collection.collectedAmount.toFixed(2)}`} color="success" size="small" />
                  </TableCell>
                  <TableCell>{collection.date ? new Date(collection.date).toLocaleDateString('tr-TR') : '-'}</TableCell>
                  <TableCell>{collection.notes || '-'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tahsilat Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Tahsilat Ekle - {selectedSale?.customerName}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Satış Toplamı: ₺{selectedSale?.total.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tahsil Edilen: ₺{selectedSale?.totalCollected.toFixed(2)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
              Kalan Tutar: ₺{selectedSale?.remainingAmount.toFixed(2)}
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
