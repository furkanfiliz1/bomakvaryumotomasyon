import { Box, Paper, Typography, Chip } from '@mui/material';
import { RecentActivity } from '../dashboard-analytics.types';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';

interface RecentActivitiesListProps {
  data: RecentActivity[];
}

export const RecentActivitiesList = ({ data }: RecentActivitiesListProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <TrendingUpIcon sx={{ color: 'success.main' }} />;
      case 'purchase':
        return <TrendingDownIcon sx={{ color: 'error.main' }} />;
      case 'expense':
        return <ReceiptIcon sx={{ color: 'warning.main' }} />;
      case 'collection':
        return <PaymentIcon sx={{ color: 'info.main' }} />;
      default:
        return null;
    }
  };

  const getActivityLabel = (type: string) => {
    switch (type) {
      case 'sale':
        return { text: 'Satış', color: 'success' as const };
      case 'purchase':
        return { text: 'Alış', color: 'error' as const };
      case 'expense':
        return { text: 'Gider', color: 'warning' as const };
      case 'collection':
        return { text: 'Tahsilat', color: 'info' as const };
      default:
        return { text: 'Diğer', color: 'default' as const };
    }
  };

  return (
    <Paper sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Son Aktiviteler
      </Typography>
      {data.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Henüz aktivite bulunmuyor
        </Typography>
      ) : (
        <Box>
          {data.map((activity, index) => {
            const label = getActivityLabel(activity.type);
            return (
              <Box
                key={activity.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  py: 2,
                  borderBottom: index < data.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                }}>
                <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>{getActivityIcon(activity.type)}</Box>
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip label={label.text} color={label.color} size="small" />
                    <Typography variant="caption" color="text.secondary">
                      {activity.date.toLocaleDateString('tr-TR')}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {activity.description}
                  </Typography>
                </Box>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    color: activity.type === 'sale' || activity.type === 'collection' ? 'success.main' : 'error.main',
                    ml: 2,
                  }}>
                  {activity.type === 'sale' || activity.type === 'collection' ? '+' : '-'}₺{activity.amount.toFixed(2)}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
};
