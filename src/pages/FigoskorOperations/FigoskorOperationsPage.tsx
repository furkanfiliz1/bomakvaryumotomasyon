import { PageHeader } from '@components';
import { Box, Button, Card, CardActions, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Figoskor Operations Main Dashboard Page
 * Matches legacy FigoskorOperations component exactly
 * Shows overview card for customer management
 */
const FigoskorOperationsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToCustomers = () => {
    navigate('/figoskor-operations/customers');
  };

  return (
    <>
      <PageHeader title="Figoskor İşlemleri" subtitle="Müşteri, firma ve rapor işlemleri" />

      <Box mx={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': {
                  boxShadow: 3,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.2s ease-in-out',
                },
              }}>
              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography
                  variant="h6"
                  component="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: 'text.primary',
                    mb: 1,
                  }}>
                  Müşteriler
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Listele, oluştur, düzenle
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleNavigateToCustomers}
                  sx={{
                    mt: 'auto',
                    minWidth: 80,
                  }}>
                  Görüntüle
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default FigoskorOperationsPage;
