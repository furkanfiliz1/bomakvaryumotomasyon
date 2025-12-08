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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState, useEffect } from 'react';
import { Form, useNotice } from '@components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { userSchema, UserFormData } from './users.validation';
import { userService } from '../../services/userService';
import { User } from '../../types/user';

const UsersPage = () => {
  const theme = useTheme();
  const notice = useNotice();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // User Dialog
  const [openDialog, setOpenDialog] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  // Add User Form
  const addForm = useForm<UserFormData>({
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(userSchema),
  });

  // Edit User Form
  const editForm = useForm<UserFormData>({
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(userSchema),
  });

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('❌ Users loading error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcılar yüklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddUser = async (values: UserFormData) => {
    try {
      setLoading(true);
      await userService.addUser(values);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kullanıcı başarıyla eklendi',
        buttonTitle: 'Tamam',
      });

      addForm.reset();
      setOpenDialog(false);
      await loadUsers();
    } catch (error) {
      console.error('❌ User add error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı eklenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      setLoading(true);
      await userService.deleteUser(id);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kullanıcı silindi',
        buttonTitle: 'Tamam',
      });

      await loadUsers();
    } catch (error) {
      console.error('❌ User delete error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id || null);
    editForm.reset({
      username: user.username,
      password: user.password,
    });
    setOpenDialog(true);
  };

  const handleUpdateUser = async (values: UserFormData) => {
    if (!editingUserId) return;

    try {
      setLoading(true);
      await userService.updateUser(editingUserId, values);

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kullanıcı başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });

      setEditingUserId(null);
      editForm.reset();
      setOpenDialog(false);
      await loadUsers();
    } catch (error) {
      console.error('❌ User update error:', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı güncellenirken hata oluştu',
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

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
            Kullanıcılar
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            Yeni Kullanıcı Ekle
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Kullanıcı Adı</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Rol</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Oluşturulma Tarihi</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">
                  İşlemler
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography color={theme.palette.grey[600]}>Henüz kullanıcı eklenmemiştir</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Chip label="Admin" color="primary" size="small" />
                    </TableCell>
                    <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="primary" onClick={() => handleEditUser(user)} sx={{ mr: 1 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => user.id && handleDeleteUser(user.id)}>
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

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setEditingUserId(null);
          addForm.reset();
          editForm.reset();
        }}
        maxWidth="sm"
        fullWidth>
        <DialogTitle sx={{ fontWeight: 600, color: theme.palette.dark[800] }}>
          {editingUserId ? 'Kullanıcı Güncelle' : 'Yeni Kullanıcı Ekle'}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Form
            form={editingUserId ? editForm : addForm}
            schema={userSchema}
            onSubmit={(e) => {
              e.preventDefault();
              if (editingUserId) {
                editForm.handleSubmit(handleUpdateUser)();
              } else {
                addForm.handleSubmit(handleAddUser)();
              }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingUserId(null);
              addForm.reset();
              editForm.reset();
            }}
            color="inherit">
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              if (editingUserId) {
                editForm.handleSubmit(handleUpdateUser)();
              } else {
                addForm.handleSubmit(handleAddUser)();
              }
            }}
            sx={{ background: theme.palette.error[700], '&:hover': { background: theme.palette.error[800] } }}>
            {editingUserId ? 'Güncelle' : 'Ekle'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UsersPage;
