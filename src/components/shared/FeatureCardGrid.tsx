import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';
import React from 'react';

export interface FeatureCardProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick: () => void;
  icon?: React.ReactNode;
  buttonId?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, buttonText, onButtonClick, icon, buttonId }) => (
  <Card
    onClick={onButtonClick}
    sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: 1,
      border: 1,
      borderColor: 'divider',
      cursor: 'pointer',
      '&:hover': {
        boxShadow: 2,
        transform: 'translateY(-2px)',
        transition: 'all 0.2s ease-in-out',
      },
    }}>
    <CardContent sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        {title}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          minHeight: '45px',
          display: 'flex',
          alignItems: 'center',
          mb: 2,
          flexGrow: 1,
        }}>
        {description}
      </Typography>
      <Box sx={{ mt: 'auto' }}>
        <Button variant="outlined" size="small" onClick={onButtonClick} startIcon={icon} id={buttonId}>
          {buttonText}
        </Button>
      </Box>
    </CardContent>
  </Card>
);

export interface FeatureCardGridProps {
  cards: Omit<FeatureCardProps, 'key'>[];
}

export const FeatureCardGrid: React.FC<FeatureCardGridProps> = ({ cards }) => (
  <Box sx={{ p: 0, mx: 2 }}>
    <Grid container spacing={2} alignItems="stretch">
      {cards.map((card, index) => (
        <Grid item xs={12} md={6} lg={4} key={index}>
          <FeatureCard {...card} />
        </Grid>
      ))}
    </Grid>
  </Box>
);
