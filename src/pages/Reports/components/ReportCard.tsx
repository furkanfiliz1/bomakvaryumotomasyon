import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { formatTurkishCurrency } from '../../../utils/currency';

interface ReportCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
}

export const ReportCard = ({ title, value, subtitle, color = 'primary', trend, trendValue }: ReportCardProps) => {
  const theme = useTheme();

  const colorMap = {
    primary: theme.palette.primary.main,
    success: theme.palette.success.main,
    error: theme.palette.error.main,
    warning: theme.palette.warning.main,
    info: theme.palette.info.main,
  };

  const trendColor = trend === 'up' ? 'success' : trend === 'down' ? 'error' : 'text.secondary';

  return (
    <Card sx={{ height: '100%', borderLeft: `4px solid ${colorMap[color]}` }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          {typeof value === 'number' ? formatTurkishCurrency(value) : value}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
        {trend && trendValue && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="body2" color={trendColor} sx={{ fontWeight: 600 }}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
