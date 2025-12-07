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
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { Form, useNotice } from '@components';
import { db } from '../../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { createFishSpeciesSchema, FishSpeciesFormData } from './fish.validation';

interface FishCategory {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

interface Fish {
  id?: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  createdAt?: Date;
}

const FishesPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);

  // Fish Dialog
  const [openFishDialog, setOpenFishDialog] = useState(false);
  const [editingFishId, setEditingFishId] = useState<string | null>(null);

  // Create schema with current categories
  const fishSpeciesSchema = createFishSpeciesSchema(categories);

  // Add Fish Form
  const addFishForm = useForm<FishSpeciesFormData>({
    defaultValues: { name: '', categoryId: '' },
    resolver: yupResolver(fishSpeciesSchema),
  });

  // Edit Fish Form
  const editFishForm = useForm<FishSpeciesFormData>({
    defaultValues: { name: '', categoryId: '' },
    resolver: yupResolver(fishSpeciesSchema),
  });

  const loadCategories = async () => {
    console.log('🔄 Kategoriler yükleniyor...');

    try {
      const categoriesCollection = collection(db, 'fishCategories');
      const snapshot = await getDocs(categoriesCollection);

      const categoriesArray: FishCategory[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const category: FishCategory = {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          createdAt: data.createdAt?.toDate() || new Date(),
        };
        categoriesArray.push(category);
      });

      setCategories(categoriesArray);
    } catch (error) {
      console.error('❌ Categories loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategoriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setCategories([]);
    }
  };

  const loadFishes = async () => {
    setLoading(true);

    try {
      console.log('🎣 Firestore collection: fishes');

      const fishesCollection = collection(db, 'fishes');
      const snapshot = await getDocs(fishesCollection);

      console.log('🐠 Firestore snapshot:', {
        empty: snapshot.empty,
        size: snapshot.size,
      });

      const fishesArray: Fish[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`🐟 Processing fish [${doc.id}]:`, data);

        // Kategori adını bul
        const category = categories.find((c) => c.id === data.categoryId);

        const fish: Fish = {
          id: doc.id,
          name: data.name || '',
          categoryId: data.categoryId || '',
          categoryName: category?.name || 'Bilinmiyor',
          createdAt: data.createdAt?.toDate() || new Date(),
        };

        console.log('✅ Fish processed:', fish);
        fishesArray.push(fish);
      });
      console.log('🎯 Final fishes array:', fishesArray);
      console.log('🔢 Fishes count:', fishesArray.length);

      setFishes(fishesArray);
      console.log('✅ setFishes called with:', fishesArray);
    } catch (error) {
      console.error('❌ Fishes loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balıklar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setFishes([]);
    } finally {
      setLoading(false);
      console.log('🏁 Fishes loading finished');
    }
  };

  // Load categories on mount
  useEffect(() => {
    console.log('🚀 Fishes component mounting...');
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load fishes after categories are loaded
  useEffect(() => {
    if (categories.length > 0) {
      console.log('📊 Categories loaded, now loading fishes...');
      loadFishes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories.length]);

  const handleAddFish = async (values: FishSpeciesFormData) => {
    try {
      setLoading(true);
      console.log('🐟 Balık ekleniyor:', values.name);

      const fishData = {
        name: values.name,
        categoryId: values.categoryId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('🐠 Fish data to save:', fishData);

      const fishesCollection = collection(db, 'fishes');
      const docRef = await addDoc(fishesCollection, fishData);
      console.log('🆔 New fish ID:', docRef.id);
      console.log('✅ Fish saved successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Balık başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addFishForm.reset();
      setOpenFishDialog(false);

      await loadFishes();
    } catch (error) {
      console.error('❌ Fish add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balık eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFish = async (id: string) => {
    try {
      setLoading(true);
      console.log('❌ Balık siliniyor:', id);

      const fishDoc = doc(db, 'fishes', id);
      await deleteDoc(fishDoc);
      console.log('✅ Fish deleted successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Balık silindi',
        buttonTitle: 'Tamam',
      });

      await loadFishes();
    } catch (error) {
      console.error('❌ Fish delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balık silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditFish = (fish: Fish) => {
    setEditingFishId(fish.id || null);
    editFishForm.reset({
      name: fish.name,
      categoryId: fish.categoryId,
    });
    setOpenFishDialog(true);
  };

  const handleUpdateFish = async (values: FishSpeciesFormData) => {
    if (!editingFishId) return;

    try {
      setLoading(true);
      console.log('✏️ Balık güncelleniyor:', editingFishId);

      const fishData = {
        name: values.name,
        categoryId: values.categoryId,
        updatedAt: new Date(),
      };

      console.log('📝 Fish data to update:', fishData);

      const fishDoc = doc(db, 'fishes', editingFishId);
      await updateDoc(fishDoc, fishData);
      console.log('✅ Fish updated successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Balık başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingFishId(null);
      editFishForm.reset();
      setOpenFishDialog(false);

      await loadFishes();
    } catch (error) {
      console.error('❌ Fish update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balık güncellenirken hata oluştu',
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

      {/* Fishes Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
            Balık Türleri
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenFishDialog(true)}
            disabled={categories.length === 0}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni Balık Ekle
          </Button>
        </Box>

        {categories.length === 0 && (
          <Paper sx={{ p: 2, mb: 2, bgcolor: theme.palette.warning[100] }}>
            <Typography color={theme.palette.warning[800]}>
              Balık eklemeden önce kategori oluşturmanız gerekmektedir.
            </Typography>
          </Paper>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Balık Adı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fishes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>Henüz balık eklenmemiştir</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                fishes.map((fish) => (
                  <TableRow key={fish.id}>
                    <TableCell>{fish.name}</TableCell>
                    <TableCell>{fish.categoryName || 'Bilinmiyor'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEditFish(fish)} sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => fish.id && handleDeleteFish(fish.id)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Fish Dialog */}
      <Dialog
        open={openFishDialog}
        onClose={() => {
          setOpenFishDialog(false);
          setEditingFishId(null);
          addFishForm.reset();
          editFishForm.reset();
        }}
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          {editingFishId ? 'Balık Güncelle' : 'Yeni Balık Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            form={editingFishId ? editFishForm : addFishForm}
            schema={fishSpeciesSchema}
            onSubmit={(e) => {
              e.preventDefault();
              if (editingFishId) {
                editFishForm.handleSubmit(handleUpdateFish)();
              } else {
                addFishForm.handleSubmit(handleAddFish)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenFishDialog(false);
              setEditingFishId(null);
              addFishForm.reset();
              editFishForm.reset();
            }}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (editingFishId) {
                editFishForm.handleSubmit(handleUpdateFish)();
              } else {
                addFishForm.handleSubmit(handleAddFish)();
              }
            }}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            {editingFishId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FishesPage;
