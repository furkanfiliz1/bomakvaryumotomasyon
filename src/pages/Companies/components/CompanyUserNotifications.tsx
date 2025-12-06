import { Icon, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid,
  Switch,
  Typography,
} from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  useGetNotificationTypesQuery,
  useGetUserNotificationsQuery,
  useUpdateUserNotificationsMutation,
} from '../companies.api';
import type { NotificationType } from '../companies.types';

interface NotificationWithStatus extends NotificationType {
  available: boolean;
}

const CompanyUserNotifications: React.FC = () => {
  const { companyId, userId } = useParams<{ companyId: string; userId: string }>();
  const [localNotifications, setLocalNotifications] = useState<NotificationWithStatus[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const notice = useNotice();
  // API queries
  const {
    data: notificationTypes = [],
    isLoading: typesLoading,
    error: typesError,
  } = useGetNotificationTypesQuery({ companyId: Number(companyId), companyType: 1 }, { skip: !companyId });

  const {
    data: userNotifications = [],
    isLoading: userNotificationsLoading,
    error: userNotificationsError,
  } = useGetUserNotificationsQuery(
    { companyId: Number(companyId), userId: Number(userId) },
    { skip: !companyId || !userId, refetchOnMountOrArgChange: true },
  );

  const [updateUserNotifications, { isLoading: updating, isSuccess, error: updateError }] =
    useUpdateUserNotificationsMutation();
  // Merge not  ification types with user selections
  useErrorListener(updateError);
  const notificationsWithStatus = useMemo(() => {
    return notificationTypes.map((notificationType) => ({
      ...notificationType,
      available: userNotifications.some((userNotif) => userNotif.MailTypeId === notificationType.Id),
    }));
  }, [notificationTypes, userNotifications]);

  // Update local state when data changes
  useEffect(() => {
    setLocalNotifications(notificationsWithStatus);
    setHasChanges(false);
  }, [notificationsWithStatus]);

  // Handle individual notification toggle
  const handleNotificationToggle = (notification: NotificationWithStatus) => {
    const updatedNotifications = localNotifications.map((item) =>
      item.Id === notification.Id ? { ...item, available: !item.available } : item,
    );
    setLocalNotifications(updatedNotifications);
    setHasChanges(true);
  };

  // Handle "Open All" button
  const handleOpenAll = () => {
    const updatedNotifications = localNotifications.map((item) => ({
      ...item,
      available: true,
    }));
    setLocalNotifications(updatedNotifications);
    setHasChanges(true);
  };

  // Handle "Close All" button
  const handleCloseAll = () => {
    const updatedNotifications = localNotifications.map((item) => ({
      ...item,
      available: false,
    }));
    setLocalNotifications(updatedNotifications);
    setHasChanges(true);
  };

  // Save notifications
  const handleSave = async () => {
    if (!companyId || !userId || !hasChanges) return;

    try {
      const enabledNotifications = localNotifications
        .filter((notif) => notif.available)
        .map((notif) => ({
          MailTypeId: notif.Id,
          TypeId: notif.Type,
          UserId: userId,
          CompanyId: companyId,
        }));

      await updateUserNotifications({
        companyId: Number(companyId),
        userId: Number(userId),
        data: enabledNotifications,
      }).unwrap();

      setHasChanges(false);
    } catch (error) {
      console.error('Failed to update notifications:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket bilgileri başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  const isLoading = typesLoading || userNotificationsLoading;
  const error = typesError || userNotificationsError;

  if (isLoading) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ mt: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Alert severity="error">Bildirim ayarları yüklenirken bir hata oluştu.</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mt: 3 }}>
      {/* Header */}
      <Card sx={{ m: 3, mb: 0, background: 'linear-gradient(45deg, #1976d2, #42a5f5)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Icon icon="bell-02" size={32} color="white" />
            <Box>
              <Typography variant="h6" sx={{ color: 'white', mb: 0.5 }}>
                Bildirim Ayarları
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Kullanıcının hangi bildirimleri alacağını belirleyebilirsiniz.
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <CardContent sx={{ p: 4 }}>
        {/* Action Buttons */}
        <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={handleOpenAll} disabled={updating}>
            Tümünü Aç
          </Button>
          <Button variant="outlined" onClick={handleCloseAll} disabled={updating}>
            Tümünü Kapat
          </Button>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Notification Switches */}
        <Grid container spacing={2}>
          {localNotifications.map((notification) => (
            <Grid item xs={12} sm={6} key={notification.Id}>
              <Box
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notification.available}
                      onChange={() => handleNotificationToggle(notification)}
                      disabled={updating}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight="medium">
                        {notification.Description}
                      </Typography>
                    </Box>
                  }
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Save Button */}
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={updating}
            startIcon={updating ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 150 }}>
            Güncelle{' '}
          </Button>
        </Box>

        {localNotifications.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">Bildirim türü bulunamadı.</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanyUserNotifications;
