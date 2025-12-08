import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
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
  IconButton,
  Chip,
  CircularProgress,
  useTheme,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import { tankService } from '../../services/tankService';
import { Tank } from '../../types/tank';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { tankSchema, TankFormData } from './tanks.validation';

const TanksPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTankId, setEditingTankId] = useState<string | null>(null);

  // Form
  const form = useForm<TankFormData>({
    resolver: yupResolver(tankSchema),
    defaultValues: {
      name: '',
      code: '',
    },
  });

  useEffect(() => {
    loadTanks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTanks = async () => {
    setLoading(true);
    try {
      const data = await tankService.getAllTanks();
      setTanks(data);
    } catch (error) {
      console.error('Error loading tanks:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tanklar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (tank?: Tank) => {
    if (tank) {
      setEditingTankId(tank.id || null);
      form.reset({
        name: tank.name,
        code: tank.code,
      });
    } else {
      setEditingTankId(null);
      form.reset({
        name: '',
        code: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTankId(null);
  };

  const handleSubmit = async (data: TankFormData) => {
    setLoading(true);
    try {
      const tankData = {
        ...data,
        isActive: true,
      };

      if (editingTankId) {
        await tankService.updateTank(editingTankId, tankData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Tank güncellendi',
          buttonTitle: 'Tamam',
        });
      } else {
        await tankService.addTank(tankData);
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Tank eklendi',
          buttonTitle: 'Tamam',
        });
      }
      handleCloseDialog();
      loadTanks();
    } catch (error) {
      console.error('Error saving tank:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tank kaydedilirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!window.confirm('Bu Tanku devre dışı bırakmak istediğinize emin misiniz?')) {
      return;
    }

    setLoading(true);
    try {
      await tankService.deactivateTank(id);
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tank devre dışı bırakıldı',
        buttonTitle: 'Tamam',
      });
      loadTanks();
    } catch (error) {
      console.error('Error deactivating tank:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tank devre dışı bırakılırken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu Tanku silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      return;
    }

    setLoading(true);
    try {
      await tankService.deleteTank(id);
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tank silindi',
        buttonTitle: 'Tamam',
      });
      loadTanks();
    } catch (error) {
      console.error('Error deleting tank:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Tank silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          Tank
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenDialog()}
          sx={{ background: theme.palette.primary.main, '&:hover': { background: theme.palette.primary.dark } }}>
          Yeni Tank Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableCell sx={{ fontWeight: 600 }}>Kod</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Tank Adı</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Durum</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>
                İşlemler
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tanks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  <Typography color="text.secondary">Henüz tank eklenmedi</Typography>
                </TableCell>
              </TableRow>
            ) : (
              tanks.map((tank) => (
                <TableRow key={tank.id} hover>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {tank.code}
                    </Typography>
                  </TableCell>
                  <TableCell>{tank.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={tank.isActive ? 'Aktif' : 'Pasif'}
                      color={tank.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" color="primary" onClick={() => handleOpenDialog(tank)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="warning"
                        onClick={() => handleDeactivate(tank.id!)}
                        disabled={!tank.isActive}>
                        <BlockIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(tank.id!)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTankId ? 'Tank Düzenle' : 'Yeni Tank Ekle'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Form
              form={form}
              schema={tankSchema}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(handleSubmit)();
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>İptal</Button>
          <Button onClick={form.handleSubmit(handleSubmit)} variant="contained" disabled={loading}>
            {editingTankId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TanksPage;
