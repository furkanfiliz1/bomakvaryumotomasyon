import React from 'react';
import { Card, Typography, List, ListItem, ListItemText } from '@mui/material';

interface ReviewRequiredFieldsListProps {
  requiredFields: string[];
}

/**
 * Review Required Fields List Component
 * Following ReceivableAdd ReviewRequiredFieldsList pattern
 */
const ReviewRequiredFieldsList: React.FC<ReviewRequiredFieldsListProps> = ({ requiredFields }) => {
  if (requiredFields.length === 0) {
    return null;
  }

  return (
    <Card sx={{ p: 2, mt: 2, bgcolor: 'warning.light' }}>
      <Typography variant="h6" color="warning.dark" sx={{ mb: 1 }}>
        Gerekli Alanlar
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Aşağıdaki alanlar doldurulması zorunludur:
      </Typography>
      <List dense>
        {requiredFields.map((field, index) => (
          <ListItem key={index} sx={{ py: 0.5 }}>
            <ListItemText
              primary={field}
              primaryTypographyProps={{
                variant: 'body2',
                color: 'warning.dark',
              }}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default ReviewRequiredFieldsList;
