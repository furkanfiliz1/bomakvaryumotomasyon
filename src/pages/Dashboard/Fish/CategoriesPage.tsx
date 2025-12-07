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
import { fishCategorySchema, FishCategoryFormData } from './fish.validation';

interface FishCategory {
  id?: string;
  name: string;
  description?: string;
  createdAt?: Date;
}

const CategoriesPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [loading, setLoading] = useState(false);

  // Category Dialog
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Add Category Form
  const addCategoryForm = useForm<FishCategoryFormData>({
    defaultValues: { name: '', description: '' },
    resolver: yupResolver(fishCategorySchema),
  });

  // Edit Category Form
  const editCategoryForm = useForm<FishCategoryFormData>({
    defaultValues: { name: '', description: '' },
    resolver: yupResolver(fishCategorySchema),
  });

  const loadCategories = async () => {
    console.log('🔄 Kategoriler yükleniyor...');
    setLoading(true);

    try {
      console.log('📍 Firestore collection: fishCategories');

      const categoriesCollection = collection(db, 'fishCategories');
      const snapshot = await getDocs(categoriesCollection);

      console.log('📦 Firestore snapshot:', {
        empty: snapshot.empty,
        size: snapshot.size,
      });

      const categoriesArray: FishCategory[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`📝 Processing category [${doc.id}]:`, data);

        const category: FishCategory = {
          id: doc.id,
          name: data.name || '',
          description: data.description || '',
          createdAt: data.createdAt?.toDate() || new Date(),
        };

        console.log('✅ Category processed:', category);
        categoriesArray.push(category);
      });

      console.log('🎯 Final categories array:', categoriesArray);
      console.log('🔢 Categories count:', categoriesArray.length);

      setCategories(categoriesArray);
      console.log('✅ setCategories called with:', categoriesArray);
    } catch (error) {
      console.error('❌ Categories loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategoriler yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setCategories([]);
    } finally {
      setLoading(false);
      console.log('🏁 Categories loading finished');
    }
  };

  // Load categories on mount
  useEffect(() => {
    console.log('🚀 Categories component mounting...');
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddCategory = async (values: FishCategoryFormData) => {
    try {
      setLoading(true);
      console.log('➕ Kategori ekleniyor:', values.name);

      const categoryData = {
        name: values.name,
        description: values.description || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      console.log('📝 Category data to save:', categoryData);

      const categoriesCollection = collection(db, 'fishCategories');
      const docRef = await addDoc(categoriesCollection, categoryData);
      console.log('🆔 New category ID:', docRef.id);
      console.log('✅ Category saved successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kategori başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addCategoryForm.reset();
      setOpenCategoryDialog(false);

      await loadCategories();
    } catch (error) {
      console.error('❌ Category add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategori eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      setLoading(true);
      console.log('❌ Kategori siliniyor:', id);

      const categoryDoc = doc(db, 'fishCategories', id);
      await deleteDoc(categoryDoc);
      console.log('✅ Category deleted successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kategori silindi',
        buttonTitle: 'Tamam',
      });

      await loadCategories();
    } catch (error) {
      console.error('❌ Category delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategori silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = (category: FishCategory) => {
    setEditingCategoryId(category.id || null);
    editCategoryForm.reset({
      name: category.name,
      description: category.description || '',
    });
    setOpenCategoryDialog(true);
  };

  const handleUpdateCategory = async (values: FishCategoryFormData) => {
    if (!editingCategoryId) return;

    try {
      setLoading(true);
      console.log('✏️ Kategori güncelleniyor:', editingCategoryId);

      const categoryData = {
        name: values.name,
        description: values.description || '',
        updatedAt: new Date(),
      };

      console.log('📝 Category data to update:', categoryData);

      const categoryDoc = doc(db, 'fishCategories', editingCategoryId);
      await updateDoc(categoryDoc, categoryData);
      console.log('✅ Category updated successfully');

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kategori başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingCategoryId(null);
      editCategoryForm.reset();
      setOpenCategoryDialog(false);

      await loadCategories();
    } catch (error) {
      console.error('❌ Category update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategori güncellenirken hata oluştu',
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

      {/* Categories Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
            Balık Kategorileri
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenCategoryDialog(true)}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni Kategori Ekle
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Kategori Adı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Açıklama</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>Henüz kategori eklenmemiştir</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.description || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleEditCategory(category)}
                        sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => category.id && handleDeleteCategory(category.id)}>
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

      {/* Add/Edit Category Dialog */}
      <Dialog
        open={openCategoryDialog}
        onClose={() => {
          setOpenCategoryDialog(false);
          setEditingCategoryId(null);
          addCategoryForm.reset();
          editCategoryForm.reset();
        }}
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          {editingCategoryId ? 'Kategori Güncelle' : 'Yeni Balık Kategorisi'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            form={editingCategoryId ? editCategoryForm : addCategoryForm}
            schema={fishCategorySchema}
            onSubmit={(e) => {
              e.preventDefault();
              if (editingCategoryId) {
                editCategoryForm.handleSubmit(handleUpdateCategory)();
              } else {
                addCategoryForm.handleSubmit(handleAddCategory)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenCategoryDialog(false);
              setEditingCategoryId(null);
              addCategoryForm.reset();
              editCategoryForm.reset();
            }}>
            İptal
          </Button>
          <Button
            onClick={() => {
              if (editingCategoryId) {
                editCategoryForm.handleSubmit(handleUpdateCategory)();
              } else {
                addCategoryForm.handleSubmit(handleAddCategory)();
              }
            }}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            {editingCategoryId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesPage;
