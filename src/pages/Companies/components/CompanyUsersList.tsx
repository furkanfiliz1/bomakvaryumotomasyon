import { Icon } from '@components';
import { Add as AddIcon } from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCompanyMernisFailedUsersQuery, useGetCompanyUsersQuery } from '../companies.api';
import { CompanyUser } from '../companies.types';

interface CompanyUsersListProps {
  companyId: number;
}

const CompanyUsersList: React.FC<CompanyUsersListProps> = ({ companyId }) => {
  const [showMernisFailedUsers, setShowMernisFailedUsers] = useState(false);

  const {
    data: users,
    isLoading,
    error,
  } = useGetCompanyUsersQuery(
    { companyId },
    {
      skip: showMernisFailedUsers,
      refetchOnMountOrArgChange: true,
    },
  );
  const {
    data: mernisFailedUsers,
    isLoading: isMernisLoading,
    error: mernisError,
  } = useGetCompanyMernisFailedUsersQuery(
    { companyId },
    {
      skip: !showMernisFailedUsers,
      refetchOnMountOrArgChange: true,
    },
  );

  const navigate = useNavigate();

  // Determine which data to use based on switch state
  const currentUsers = showMernisFailedUsers ? mernisFailedUsers : users;
  const currentLoading = showMernisFailedUsers ? isMernisLoading : isLoading;
  const currentError = showMernisFailedUsers ? mernisError : error;

  const handleAddClick = () => {
    navigate(`/companies/${companyId}/kullanici/yeni`);
  };

  if (currentLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (currentError) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {showMernisFailedUsers
          ? 'Mernis hatalı kullanıcı bilgileri yüklenirken bir hata oluştu.'
          : 'Kullanıcı bilgileri yüklenirken bir hata oluştu.'}
      </Alert>
    );
  }

  const getInitials = (firstName?: string, lastName?: string) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase() || '?';
  };

  const getFullName = (firstName?: string, lastName?: string) => {
    const parts = [firstName, lastName].filter(Boolean);
    return parts.join(' ') || 'Kullanıcı';
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      '#2196f3',
      '#03a9f4',
      '#00bcd4',
      '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
    ];
    const hash = name.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="h6">
            {showMernisFailedUsers
              ? `Mernis Hatalı Kullanıcılar (${currentUsers?.length || 0})`
              : `Kullanıcı Listesi (${currentUsers?.length || 0})`}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={2}>
          <FormControlLabel
            control={
              <Switch
                checked={showMernisFailedUsers}
                onChange={(event) => setShowMernisFailedUsers(event.target.checked)}
                color="primary"
              />
            }
            label="Mernis Hatalı Kullanıcıları Göster"
          />
          {!showMernisFailedUsers && (
            <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={handleAddClick}>
              Kullanıcı Ekle
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        {currentUsers?.length === 0 ? (
          <Grid item lg={12} sx={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography variant="h6" color="textSecondary">
              {showMernisFailedUsers
                ? 'Bu şirkete ait Mernis hatalı kullanıcı bulunamadı.'
                : 'Bu şirkete ait kullanıcı bulunamadı.'}
            </Typography>
          </Grid>
        ) : (
          <>
            {' '}
            {currentUsers?.map((user: CompanyUser) => (
              <Grid item xs={12} sm={6} md={4} key={user.Id}>
                <Card
                  elevation={2}
                  sx={{
                    height: '100%',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      elevation: 4,
                      transform: 'translateY(-2px)',
                    },
                  }}>
                  <CardContent sx={{ p: 2 }}>
                    <Box display="flex" alignItems="flex-start" gap={2}>
                      {/* Avatar */}
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(getFullName(user.FirstName, user.LastName)),
                          width: 48,
                          height: 48,
                          fontSize: '1.2rem',
                          fontWeight: 'bold',
                          flexShrink: 0,
                        }}>
                        {getInitials(user.FirstName, user.LastName)}
                      </Avatar>

                      {/* User Info */}
                      <Box flex={1} minWidth={0}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            mb: 1,
                            lineHeight: 1.2,
                            wordBreak: 'break-word',
                          }}>
                          {getFullName(user.FirstName, user.LastName)}
                        </Typography>

                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              wordBreak: 'break-all',
                            }}>
                            <Icon icon="mail-01" size={16} />
                            {user.Email}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                            }}>
                            <Icon icon="phone-01" size={16} />
                            {user.Phone}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              mt: 1,
                            }}>
                            <Icon icon="user-01" size={16} />
                            {user.UserName}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Detail Button */}
                      <IconButton
                        onClick={() => navigate(`/companies/${companyId}/kullanici/${user.Id}`)}
                        sx={{
                          alignSelf: 'flex-start',
                          color: 'primary.main',
                        }}
                        title="Kullanıcı Detayına Git">
                        <Icon icon="eye" size={20} />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </>
        )}
      </Grid>
    </Box>
  );
};

export default CompanyUsersList;
