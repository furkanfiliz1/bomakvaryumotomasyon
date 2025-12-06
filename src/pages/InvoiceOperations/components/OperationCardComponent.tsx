import React from 'react';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { OperationCard } from '../invoice-operations.types';

export interface OperationCardComponentProps {
  card: OperationCard;
}

/**
 * Individual operation card component
 * Matches legacy card styling and functionality exactly
 */
export const OperationCardComponent: React.FC<OperationCardComponentProps> = ({ card }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!card.disabled) {
      navigate(card.route);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: card.disabled ? 'default' : 'pointer',
        opacity: card.disabled ? 0.6 : 1,
        '&:hover': {
          transform: card.disabled ? 'none' : 'translateY(-2px)',
          transition: 'transform 0.2s ease-in-out',
        },
      }}>
      <CardActionArea onClick={handleCardClick} disabled={card.disabled} sx={{ height: '100%' }}>
        <CardContent
          sx={{
            p: 3,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            height: '100%',
          }}>
          <Typography
            variant="h6"
            component="h3"
            sx={{
              mb: 1,
              fontWeight: 600,
              color: 'primary.main',
            }}>
            {card.title}
          </Typography>

          {card.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 'auto' }}>
              {card.description}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};
