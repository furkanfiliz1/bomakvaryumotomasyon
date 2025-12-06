import { Icon, IconTypes } from '@components';
import { ChevronRight } from '@mui/icons-material';
import { Alert, Box, Button, Card, CircularProgress, Grid, Typography, useTheme } from '@mui/material';
import { currencyFormatter } from '@utils';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import {
  useGetDailyCompanyActivityCountByAllowanceStatusQuery,
  useGetDailyCompanyIntegrationCountQuery,
  useGetDailyInvoiceStatsQuery,
  useGetDailyPaymentStatsQuery,
  useGetDailyRegisteredCompaniesQuery,
} from './dashboard.api';

interface DashboardCard {
  title: string;
  value: string;
  subtitle: string;
  buttonText?: string;
  icon: keyof typeof IconTypes;
  overlayColor: string;
  isLoading?: boolean;
  buttonLink?: string;
}

const DashboardPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Today's date in YYYY-MM-DD format
  const today = dayjs().format('YYYY-MM-DD');

  // Fetch real data from APIs
  const {
    data: dailyRegisteredCompanies,
    isLoading: isLoadingRegistrations,
    error: errorRegistrations,
  } = useGetDailyRegisteredCompaniesQuery();
  const {
    data: dailyIntegrationCount,
    isLoading: isLoadingIntegrations,
    error: errorIntegrations,
  } = useGetDailyCompanyIntegrationCountQuery();
  const {
    data: dailyActivityCount,
    isLoading: isLoadingActivity,
    error: errorActivity,
  } = useGetDailyCompanyActivityCountByAllowanceStatusQuery();
  const {
    data: dailyPaymentStats,
    isLoading: isLoadingPayments,
    error: errorPayments,
  } = useGetDailyPaymentStatsQuery();
  const {
    data: dailyInvoiceStats,
    isLoading: isLoadingInvoices,
    error: errorInvoices,
  } = useGetDailyInvoiceStatsQuery();

  // Check if there are any errors
  const hasErrors = errorRegistrations || errorIntegrations || errorActivity || errorPayments || errorInvoices;

  // Helper function to safely get value or show fallback
  const getSafeValue = (data: { Count?: number } | undefined, fallback: string = '0', isLoading: boolean = false) => {
    if (isLoading) return '...';
    if (!data || 'error' in data) return fallback;
    return data.Count !== undefined ? String(data.Count) : fallback;
  };

  // Helper function to get overlay colors
  const getOverlayColor = (overlayColor: string) => {
    switch (overlayColor) {
      case 'primary':
        return theme.palette.primary[100];
      case 'success':
        return theme.palette.success[100];
      case 'warning':
        return theme.palette.warning[100];
      case 'info':
        return theme.palette.info.lighter;
      case 'error':
        return theme.palette.error[100];
      default:
        return theme.palette.grey[100];
    }
  };

  // Helper function to get icon colors
  const getIconColor = (overlayColor: string) => {
    switch (overlayColor) {
      case 'primary':
        return theme.palette.primary[600];
      case 'success':
        return theme.palette.success[600];
      case 'warning':
        return theme.palette.warning[600];
      case 'info':
        return theme.palette.info.main;
      case 'error':
        return theme.palette.error[600];
      default:
        return theme.palette.grey[600];
    }
  };

  const dashboardStatsRow1: DashboardCard[] = [
    {
      title: 'Bugün üye olan firma sayısı',
      value: getSafeValue(dailyRegisteredCompanies, '0', isLoadingRegistrations),
      subtitle: 'Firma üye oldu.',
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'users-plus',
      overlayColor: 'primary',
      isLoading: isLoadingRegistrations,
      buttonLink: `/companies/all?startDate=${today}&endDate=${today}&type=1&page=1&pageSize=50&sort=InsertDateTime&sortType=Desc&GetByIntegrators=false`,
    },
    {
      title: 'Bugün entegratör bağlayan firma sayısı',
      value: getSafeValue(dailyIntegrationCount, '0', isLoadingIntegrations),
      subtitle: 'Firma entegratör bağladı.',
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'link-01',
      overlayColor: 'primary',
      isLoading: isLoadingIntegrations,
      buttonLink: '/companies/all',
    },
    {
      title: 'Bugün işlem geçiren firma sayısı',
      value: getSafeValue(dailyActivityCount, '0', isLoadingActivity),
      subtitle: 'Firma işlem geçirdi.',
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'activity',
      overlayColor: 'primary',
      isLoading: isLoadingActivity,
      buttonLink: '/iskonto-islemleri',
    },
  ];

  const dashboardStatsRow2: DashboardCard[] = [
    {
      title: 'Günlük toplam işlem adedi ve ücreti',
      value: isLoadingPayments
        ? '...'
        : `${dailyPaymentStats?.Count || 0} | ${currencyFormatter(dailyPaymentStats?.TotalAmount || 0, 'TRY')}`,
      subtitle: 'Günlük toplam işlem adedi ve ücreti',
      buttonText: 'Bugünün İşlem ücretlerini gör ',
      icon: 'bar-chart-01',
      overlayColor: 'warning',
      isLoading: isLoadingPayments,
      buttonLink: `/pricing/operasyon-ucretlendirme?page=1&pageSize=25&startPaymentDate=${today}&endPaymentDate=${today}`,
    },
    {
      title: 'Tedarikçi Finansmanı',
      value: isLoadingPayments
        ? '...'
        : `${dailyPaymentStats?.SupplierFinancing?.Count || 0} | ${currencyFormatter(
            dailyPaymentStats?.SupplierFinancing?.Amount || 0,
            'TRY',
          )}`,
      subtitle: `%${(dailyPaymentStats?.SupplierFinancing?.Percentage || 0).toFixed(2)}`,
      icon: 'truck-01',
      overlayColor: 'warning',
      isLoading: isLoadingPayments,
    },
    {
      title: 'Fatura Finansmanı',
      value: isLoadingPayments
        ? '...'
        : `${dailyPaymentStats?.SMBFinancing?.Count || 0} | ${currencyFormatter(
            dailyPaymentStats?.SMBFinancing?.Amount || 0,
            'TRY',
          )}`,
      subtitle: `%${(dailyPaymentStats?.SMBFinancing?.Percentage || 0).toFixed(2)}`,
      icon: 'receipt',
      overlayColor: 'warning',
      isLoading: isLoadingPayments,
    },
  ];

  const dashboardStatsRow3: DashboardCard[] = [
    {
      title: 'Bugün yüklenen fatura adedi ve tutarı',
      value: isLoadingInvoices
        ? '...'
        : `${dailyInvoiceStats?.Count || 0} | ${currencyFormatter(dailyInvoiceStats?.TotalAmount || 0, 'TRY')}`,
      subtitle: 'Bugün yüklenen fatura adedi ve tutarı',
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'upload-01',
      overlayColor: 'success',
      isLoading: isLoadingInvoices,
      buttonLink: `/invoice-operations/invoice-report?page=1&pageSize=50&notifyBuyer=1&isDeleted=0&sort=InsertDatetime&sortType=Asc&startDate=${today}&endDate=${today}&status=1&currencyId=1`,
    },
    {
      title: 'Tedarikçi Finansmanı',
      value: isLoadingInvoices
        ? '...'
        : `${dailyInvoiceStats?.SupplierFinancing?.Count || 0} | ${currencyFormatter(
            dailyInvoiceStats?.SupplierFinancing?.TotalAmount || 0,
            'TRY',
          )}`,
      subtitle: `%${(dailyInvoiceStats?.SupplierFinancing?.Percentage || 0).toFixed(2)}`,
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'truck-01',
      overlayColor: 'success',
      isLoading: isLoadingInvoices,
      buttonLink: `/invoice-operations/invoice-report?page=1&pageSize=50&notifyBuyer=1  &isDeleted=0&sort=InsertDatetime&sortType=Asc&startDate=${today}&endDate=${today}&status=1&currencyId=1`,
    },
    {
      title: 'Fatura Finansmanı',
      value: isLoadingInvoices
        ? '...'
        : `${dailyInvoiceStats?.SMBFinancing?.Count || 0} | ${currencyFormatter(
            dailyInvoiceStats?.SMBFinancing?.TotalAmount || 0,
            'TRY',
          )}`,
      subtitle: `%${(dailyInvoiceStats?.SMBFinancing?.Percentage || 0).toFixed(2)}`,
      buttonText: 'Bugünün Kayıtlarını Gör ',
      icon: 'receipt',
      overlayColor: 'success',
      isLoading: isLoadingInvoices,
      buttonLink: `/invoice-operations/invoice-report?page=1&pageSize=50&notifyBuyer=0&isDeleted=0&sort=InsertDatetime&sortType=Asc&startDate=${today}&endDate=${today}&status=1&currencyId=1`,
    },
  ];

  const renderCard = (stat: DashboardCard, index: number) => (
    <Grid item xs={12} md={4} key={index}>
      <Card
        sx={{
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
          '&::before': {
            content: '""',
            position: 'absolute',
            opacity: 0.5,
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: getIconColor(stat.overlayColor),
          },
        }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            mb: 2,
          }}>
          <Box
            sx={{
              bgcolor: getOverlayColor(stat.overlayColor),
              borderRadius: 2,
              width: 30,
              height: 30,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              mr: 1,
              border: `1px solid ${getIconColor(stat.overlayColor)}20`,
            }}>
            {stat.isLoading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <Icon icon={stat.icon} size={16} color={getIconColor(stat.overlayColor)} />
            )}
          </Box>
          <Typography variant="h6" fontWeight={500} color={theme.palette.dark[800]} sx={{ flex: 1 }}>
            {stat.title}
          </Typography>
        </Box>
        <Typography
          variant="h4"
          sx={{
            color: theme.palette.neutral[600],
            fontWeight: 600,
            mb: 1,
          }}>
          {stat.value}
        </Typography>
        <Typography variant="body2" color={theme.palette.neutral[600]} mb={2} sx={{ flexGrow: 1 }}>
          {stat.subtitle}
        </Typography>
        {stat.buttonText && (
          <Button
            variant="outlined"
            size="small"
            disabled={stat.isLoading}
            onClick={() => {
              if (stat.buttonLink) {
                navigate(stat.buttonLink);
              }
            }}
            sx={{
              borderColor: theme.palette.neutral[300],
              color: theme.palette.neutral[600],
              '&:hover': { borderColor: theme.palette.neutral[400] },
              alignSelf: 'flex-start',
            }}>
            {stat.buttonText}
            <ChevronRight fontSize="small" />
          </Button>
        )}
      </Card>
    </Grid>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}

      {/* Dashboard Stats - Row 1 */}
      <Grid container spacing={2} mb={3}>
        {dashboardStatsRow1.map((stat, index) => renderCard(stat, index))}
      </Grid>

      {/* Dashboard Stats - Row 2 */}
      <Grid container spacing={2} mb={3}>
        {dashboardStatsRow2.map((stat, index) => renderCard(stat, index))}
      </Grid>

      {/* Dashboard Stats - Row 3 */}
      <Grid container spacing={2}>
        {dashboardStatsRow3.map((stat, index) => renderCard(stat, index))}
      </Grid>

      {/* Error Handling - Display error message if any API call fails */}
      {hasErrors && (
        <Alert severity="error" sx={{ mt: 3 }}>
          Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.
        </Alert>
      )}
    </Box>
  );
};

export default DashboardPage;
