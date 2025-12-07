import {
  Box,
  Button,
  TextField,
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useNotice } from '@components';
import { db } from '../../config/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

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

const DashboardPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [categories, setCategories] = useState<FishCategory[]>([]);
  const [fishes, setFishes] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(false);

  // Category Dialog
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // Fish Dialog
  const [openFishDialog, setOpenFishDialog] = useState(false);
  const [fishName, setFishName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

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
  const loadFishes = async () => {
    console.log('🐟 Balıklar yükleniyor...');
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

  // Load categories and fishes on mount
  useEffect(() => {
    console.log('🚀 Dashboard component mounting...');
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

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kategori adı boş olamaz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('➕ Kategori ekleniyor:', categoryName.trim());

      const categoryData = {
        name: categoryName.trim(),
        description: categoryDescription.trim() || '',
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

      setCategoryName('');
      setCategoryDescription('');
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

  const handleAddFish = async () => {
    if (!fishName.trim() || !selectedCategoryId) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Balık adı ve kategori seçimi zorunludur',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('🐟 Balık ekleniyor:', fishName.trim());

      const fishData = {
        name: fishName.trim(),
        categoryId: selectedCategoryId,
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

      setFishName('');
      setSelectedCategoryId('');
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
  return (
    <Box sx={{ p: 3 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Categories Section */}
      <Box sx={{ mb: 4 }}>
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
                      <Button
                        size="small"
                        color="error"
                        onClick={() => category.id && handleDeleteCategory(category.id)}>
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Fishes Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
            Balıklar
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenFishDialog(true)}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni Balık Ekle
          </Button>
        </Box>

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
                      <Button size="small" color="error" onClick={() => fish.id && handleDeleteFish(fish.id)}>
                        Sil
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add Category Dialog */}
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>Yeni Balık Kategorisi</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Kategori Adı"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Açıklama"
            multiline
            rows={3}
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenCategoryDialog(false)}>İptal</Button>
          <Button
            onClick={handleAddCategory}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Fish Dialog */}
      <Dialog open={openFishDialog} onClose={() => setOpenFishDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>Yeni Balık Ekle</DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            autoFocus
            fullWidth
            label="Balık Adı"
            value={fishName}
            onChange={(e) => setFishName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth>
            <InputLabel>Kategori</InputLabel>
            <Select value={selectedCategoryId} onChange={(e) => setSelectedCategoryId(e.target.value)} label="Kategori">
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenFishDialog(false)}>İptal</Button>
          <Button
            onClick={handleAddFish}
            variant="contained"
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Ekle
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DashboardPage;
