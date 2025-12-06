import { Box, Button, Stack, Typography } from '@mui/material';
import React from 'react';

interface InvoiceTypeOption {
  id: number;
  label: string;
}

interface InvoiceTypeSelectorProps {
  options: InvoiceTypeOption[];
  selectedTypes: number[];
  onChange: (typeId: number, checked: boolean) => void;
  label?: string;
}

/**
 * Invoice Type Selector Component
 * Following reference project InvoiceTypes.js pattern with button toggle style
 * - If "Hepsi" (id: 0) is selected, other options are disabled
 * - If any other option is selected, "Hepsi" is automatically deselected
 */
const InvoiceTypeSelector: React.FC<InvoiceTypeSelectorProps> = ({ options, selectedTypes, onChange, label }) => {
  const handleToggle = (typeId: number) => {
    const isSelected = selectedTypes?.includes(typeId);
    const isAllOption = typeId === 0;
    const hasAllSelected = selectedTypes?.includes(0);

    // If clicking "Hepsi"
    if (isAllOption) {
      if (isSelected) {
        // Deselect "Hepsi"
        onChange(typeId, false);
      } else {
        // Select "Hepsi" and deselect all others
        // First deselect all others
        selectedTypes?.forEach((id) => {
          if (id !== 0) {
            onChange(id, false);
          }
        });
        // Then select "Hepsi"
        onChange(typeId, true);
      }
    } else {
      // If clicking any other option
      if (hasAllSelected) {
        // Deselect "Hepsi" first
        onChange(0, false);
      }
      // Toggle the clicked option
      onChange(typeId, !isSelected);
    }
  };

  return (
    <Box>
      {label && (
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 500 }}>
          {label}
        </Typography>
      )}
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        {options.map((option) => {
          const isSelected = selectedTypes?.includes(option.id) || false;

          return (
            <Button
              key={option.id}
              variant="outlined"
              onClick={() => handleToggle(option.id)}
              sx={{
                minWidth: '150px',
                borderWidth: 2,
                borderColor: isSelected ? 'success.main' : 'grey.300',
                color: isSelected ? 'success.main' : 'text.secondary',
                bgcolor: isSelected ? 'success.50' : 'transparent',
                fontWeight: isSelected ? 600 : 400,
                textTransform: 'none',
                '&:hover': {
                  borderWidth: 2,
                  borderColor: isSelected ? 'success.dark' : 'grey.400',
                  bgcolor: isSelected ? 'success.100' : 'grey.50',
                },
              }}>
              {option.label}
            </Button>
          );
        })}
      </Stack>
    </Box>
  );
};

export default InvoiceTypeSelector;
