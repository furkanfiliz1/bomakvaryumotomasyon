import { useErrorListener } from '@hooks';
import {
  Description as DescriptionIcon,
  History as HistoryIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';
import {
  Alert,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useGetAllowanceLogsQuery } from '../discount-operations.api';
import { AllowanceLogType } from '../discount-operations.types';

interface TransactionHistoryTabProps {
  allowanceId: number;
}

const TransactionHistoryTab: React.FC<TransactionHistoryTabProps> = ({ allowanceId }) => {
  const theme = useTheme();
  const {
    data: logsData,
    isLoading,
    error,
  } = useGetAllowanceLogsQuery({
    AllowanceId: allowanceId,
    sort: 'InsertDatetime',
    sortType: 'Desc', // Show most recent first
  });

  useErrorListener([error]);

  // Helper function to get transaction priority (for visual importance)
  const getTransactionPriority = (type: AllowanceLogType): 'high' | 'medium' | 'low' => {
    switch (type) {
      case AllowanceLogType.ISKONTO_OLUSTURMA:
      case AllowanceLogType.TEDARIKCI_TEKLIF_KABULU:
      case AllowanceLogType.ODEME_BILGISI_AKTARMA:
        return 'high';
      case AllowanceLogType.YETKILI_KABULU:
      case AllowanceLogType.ALICI_SON_ONAYI:
      case AllowanceLogType.YENI_TEKLIF:
        return 'medium';
      default:
        return 'low';
    }
  };

  // Helper function to get status color for transaction types
  const getTransactionTypeColor = (
    type: AllowanceLogType,
  ): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
    switch (type) {
      case AllowanceLogType.ISKONTO_OLUSTURMA:
        return 'primary';
      case AllowanceLogType.YETKILI_KABULU:
        return 'success';
      case AllowanceLogType.ALICI_ILK_ONAYI:
      case AllowanceLogType.ALICI_SON_ONAYI:
        return 'info';
      case AllowanceLogType.YENI_TEKLIF:
        return 'warning';
      case AllowanceLogType.TEDARIKCI_TEKLIF_KABULU:
        return 'success';
      case AllowanceLogType.TEDARIKCI_ABF_ONAYLAMA:
        return 'success';
      case AllowanceLogType.ODEME_BILGISI_AKTARMA:
      case AllowanceLogType.ODEME_BILGISI_GUNCELLEME:
        return 'secondary';
      case AllowanceLogType.ISKONTOYA_AIT_FINANSORLER:
        return 'info';
      default:
        return 'default';
    }
  };

  // Helper function to get transaction type icon
  const getTransactionIcon = (type: AllowanceLogType) => {
    switch (type) {
      case AllowanceLogType.ISKONTO_OLUSTURMA:
        return <HistoryIcon />;
      case AllowanceLogType.YETKILI_KABULU:
      case AllowanceLogType.ALICI_ILK_ONAYI:
      case AllowanceLogType.ALICI_SON_ONAYI:
      case AllowanceLogType.TEDARIKCI_TEKLIF_KABULU:
      case AllowanceLogType.TEDARIKCI_ABF_ONAYLAMA:
        return <PersonIcon />;
      case AllowanceLogType.YENI_TEKLIF:
        return <DescriptionIcon />;
      case AllowanceLogType.ODEME_BILGISI_AKTARMA:
      case AllowanceLogType.ODEME_BILGISI_GUNCELLEME:
        return <ScheduleIcon />;
      case AllowanceLogType.ISKONTOYA_AIT_FINANSORLER:
        return <DescriptionIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Stack spacing={2} alignItems="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            İşlem tarihçesi yükleniyor...
          </Typography>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 2,
          '& .MuiAlert-message': {
            fontSize: '0.875rem',
          },
        }}>
        İşlem tarihçesi yüklenirken bir hata oluştu. Lütfen sayfayı yenileyerek tekrar deneyin.
      </Alert>
    );
  }

  if (!logsData?.Logs || logsData.Logs.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
          borderRadius: 2,
          border: `1px solid ${theme.palette.grey[200]}`,
        }}>
        <Stack spacing={2} alignItems="center" sx={{ textAlign: 'center', p: 3 }}>
          <Avatar
            sx={{
              width: 64,
              height: 64,
              bgcolor: theme.palette.grey[300],
              color: theme.palette.grey[600],
            }}>
            <HistoryIcon fontSize="large" />
          </Avatar>
          <Typography variant="h6" color="text.secondary">
            İşlem Tarihçesi Bulunamadı
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bu iskonto işlemi için henüz kayıtlı işlem tarihçesi bulunmamaktadır.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {/* Timeline Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon color="primary" />
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          İşlem Tarihçesi
        </Typography>
        <Chip label={`${logsData.Logs.length} İşlem`} size="small" color="primary" variant="outlined" />
      </Box>

      {/* Timeline Line */}
      <Box
        sx={{
          position: 'absolute',
          left: 24,
          top: 80,
          bottom: 0,
          width: 2,
          bgcolor: theme.palette.grey[300],
          zIndex: 0,
        }}
      />

      {/* Timeline Items */}
      <Stack spacing={2}>
        {logsData.Logs.map((log) => {
          const priority = getTransactionPriority(log.Type);
          const nodeColor =
            priority === 'high'
              ? theme.palette.success.main
              : priority === 'medium'
                ? theme.palette.primary.main
                : theme.palette.grey[500];

          return (
            <Box key={log.Id} sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              {/* Timeline Node */}
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: nodeColor,
                  color: 'white',
                  boxShadow: `0 0 0 4px ${theme.palette.background.default}`,
                  border: `2px solid ${nodeColor}`,
                  zIndex: 1,
                }}>
                {getTransactionIcon(log.Type)}
              </Avatar>

              {/* Content Card */}
              <Card
                sx={{
                  flex: 1,
                  boxShadow: theme.shadows[2],
                  borderRadius: 2,
                  border: `1px solid ${theme.palette.grey[200]}`,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: theme.shadows[4],
                    transform: 'translateY(-2px)',
                  },
                }}>
                <CardContent sx={{ p: 2 }}>
                  {/* Header Section */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {log.TypeDescription}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${log.Type}`}
                      size="small"
                      color={getTransactionTypeColor(log.Type)}
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Description Section */}
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <DescriptionIcon fontSize="small" color="action" />
                      <Typography
                        variant="body1"
                        sx={{
                          pl: 0.5,
                          lineHeight: 1.6,
                          color: theme.palette.text.primary,
                        }}>
                        {log.Description || 'Açıklama mevcut değil'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default TransactionHistoryTab;
