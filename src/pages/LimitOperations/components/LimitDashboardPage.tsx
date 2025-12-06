import { PageHeader } from '@components';
import { Alert, Box, Button, Card, CircularProgress, Grid, Skeleton, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { StatusCardConfig, formatCount, getStatusCount, limitIncreaseCards, newCustomerCards } from '../helpers';
import { useGetOnboardingStatusCountQuery } from '../limit-operations.api';
import { OnboardingStatusCount } from '../limit-operations.types';

// Loading skeleton for status cards
const StatusCardSkeleton = () => {
  return (
    <Grid item xs={12} sm={6} md={2}>
      <Card sx={{ height: '180px', p: 3 }}>
        <Skeleton variant="text" height={24} sx={{ mb: 2 }} />
        <Skeleton variant="text" height={20} width="60%" sx={{ mb: 3 }} />
        <Skeleton
          variant="rectangular"
          width={80}
          height={48}
          sx={{
            borderRadius: 1,
            mx: 'auto',
          }}
        />
      </Card>
    </Grid>
  );
};

// Enhanced status card component matching legacy design
const StatusCard = ({ card, count, isLoading }: { card: StatusCardConfig; count: number; isLoading: boolean }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(card.navigateUrl);
  };

  return (
    <Grid item xs={12} sm={6} md={2}>
      <Card
        sx={{
          height: '100%',
          minHeight: '180px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: `1px solid ${theme.palette.divider}`,
          borderRadius: 0,
          boxShadow: 'none',
        }}>
        <Box
          sx={{
            padding: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            flexGrow: 1,
          }}>
          <Typography
            variant="body1"
            sx={{
              fontWeight: 600,
              marginBottom: 2,
              color: theme.palette.text.primary,
              minHeight: '48px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.95rem',
            }}>
            {card.title}
          </Typography>

          <Box sx={{ marginTop: 'auto' }}>
            <Button
              id={card.id}
              variant="outlined"
              disabled={isLoading}
              onClick={handleClick}
              sx={{
                minWidth: '80px',
                height: '48px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderColor: theme.palette.error.main,
                color: theme.palette.error[700],
                '&:hover': {
                  borderColor: theme.palette.error.dark,
                  backgroundColor: 'rgba(211, 47, 47, 0.04)',
                  color: theme.palette.error.dark,
                },
                '&:disabled': {
                  backgroundColor: theme.palette.neutral[100],
                  color: theme.palette.neutral[500],
                  borderColor: theme.palette.neutral[300],
                },
              }}>
              {isLoading ? <CircularProgress size={20} color="inherit" /> : formatCount(count)}
            </Button>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
};

// Enhanced section component matching legacy design
const DashboardSection = ({
  title,
  cards,
  statusCounts,
  isLoading,
}: {
  title: string;
  cards: StatusCardConfig[];
  statusCounts: OnboardingStatusCount[];
  isLoading: boolean;
}) => {
  const theme = useTheme();

  return (
    <Box sx={{ mb: 5 }}>
      {title && (
        <Typography
          variant="h5"
          component="h3"
          sx={{
            py: 3,
            color: theme.palette.text.secondary,
            fontSize: '1.5rem',
            fontWeight: 400,
          }}>
          {title}
        </Typography>
      )}

      <Card
        sx={{
          p: 3,
          backgroundColor: 'white',
          boxShadow: theme.shadows[1],
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}>
        <Grid container sx={{ height: '100%' }}>
          {isLoading
            ? cards.map((card) => <StatusCardSkeleton key={card.id} />)
            : cards.map((card) => (
                <StatusCard
                  key={card.id}
                  card={card}
                  count={getStatusCount(statusCounts, card.statusType)}
                  isLoading={isLoading}
                />
              ))}
        </Grid>
      </Card>
    </Box>
  );
};

const LimitDashboardPage = () => {
  const { data: statusCounts = [], error, isLoading } = useGetOnboardingStatusCountQuery();

  if (error) {
    return (
      <Box component="main" sx={{ padding: 3 }}>
        <Alert
          severity="error"
          sx={{
            mt: 3,
            borderRadius: 2,
            '& .MuiAlert-message': {
              fontSize: '1rem',
            },
          }}>
          Veri yüklenirken hata oluştu. Lütfen sayfayı yenileyin.
        </Alert>
      </Box>
    );
  }

  return (
    <Box component="main">
      {/* Header Section matching legacy design */}
      <PageHeader
        title="Fatura Finansman Statü Takibi"
        subtitle="Fatura Finansmanı müşterilerinin statü bazlı dağılımını görüntüleyin"
      />

      {/* Dashboard Content */}
      <Box sx={{ p: 3 }}>
        {/* New Customer Section */}
        <DashboardSection
          title="Yeni Müşteri"
          cards={newCustomerCards}
          statusCounts={statusCounts}
          isLoading={isLoading}
        />

        {/* Limit Increase Section */}
        <DashboardSection
          title="Limit Artış"
          cards={limitIncreaseCards}
          statusCounts={statusCounts}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default LimitDashboardPage;
