import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import InventoryIcon from '@mui/icons-material/Inventory';
import WarningIcon from '@mui/icons-material/Warning';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: 'revenue' | 'expense' | 'profit' | 'cash' | 'sales' | 'purchases' | 'stock' | 'warning';
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard = ({ title, value, subtitle, icon, color = 'primary', trend }: StatCardProps) => {
  const theme = useTheme();

  const getIcon = () => {
    switch (icon) {
      case 'revenue':
        return <TrendingUpIcon sx={{ fontSize: 40 }} />;
      case 'expense':
        return <TrendingDownIcon sx={{ fontSize: 40 }} />;
      case 'profit':
        return <AttachMoneyIcon sx={{ fontSize: 40 }} />;
      case 'cash':
        return <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />;
      case 'sales':
        return <ShoppingCartIcon sx={{ fontSize: 40 }} />;
      case 'purchases':
        return <ReceiptIcon sx={{ fontSize: 40 }} />;
      case 'stock':
        return <InventoryIcon sx={{ fontSize: 40 }} />;
      case 'warning':
        return <WarningIcon sx={{ fontSize: 40 }} />;
      default:
        return null;
    }
  };

  const getColorValue = () => {
    switch (color) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        position: 'relative',
        overflow: 'visible',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          transform: 'translateY(-4px)',
        },
      }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, color: getColorValue(), mb: 0.5 }}>
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          {icon && (
            <Box
              sx={{
                bgcolor: `${getColorValue()}15`,
                color: getColorValue(),
                p: 1.5,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              {getIcon()}
            </Box>
          )}
        </Box>
        {trend && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            {trend.isPositive ? (
              <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
            ) : (
              <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main', mr: 0.5 }} />
            )}
            <Typography
              variant="caption"
              sx={{
                color: trend.isPositive ? 'success.main' : 'error.main',
                fontWeight: 600,
              }}>
              {Math.abs(trend.value)}%
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
              geçen aya göre
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
