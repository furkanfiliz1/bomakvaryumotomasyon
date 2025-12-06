import React, { useState } from 'react';
import { Tabs, Tab, Box, styled, SxProps, Theme, useTheme } from '@mui/material';

export interface TabItem {
  label: string;
  value: number;
  disabled?: boolean;
}

export interface CustomTabsProps {
  tabs: TabItem[];
  defaultValue?: number;
  onChange?: (value: number) => void;
  variant?: 'standard' | 'scrollable' | 'fullWidth';
  orientation?: 'horizontal' | 'vertical';
  sx?: SxProps<Theme>;
}

const StyledTabs = styled(Tabs)(({ theme }) => ({
  '& .MuiTabs-root': {
    minHeight: 'auto',
  },
  '& .MuiTabs-flexContainer': {
    justifyContent: 'space-between',
    padding: '4px',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '14px',
    minHeight: '40px',
    padding: theme.spacing(1, 2),
    borderRadius: '20px',
    color: theme.palette.text.secondary,
    margin: theme.spacing(0, 0.25),
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: '#F1F5F9',
      color: theme.palette.text.primary,
    },
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
      fontWeight: 600,
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: '#FFFFFF',
      },
    },
    '&.Mui-disabled': {
      color: theme.palette.text.disabled,
      backgroundColor: '#F1F5F9',
      opacity: 0.6,
    },
  },
}));

const CustomTabs: React.FC<CustomTabsProps> = ({
  tabs,
  defaultValue,
  onChange,
  variant = 'standard',
  orientation = 'horizontal',
  sx = {},
}) => {
  const [value, setValue] = useState(defaultValue || tabs[0]?.value);
  const theme = useTheme();

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#FFF',
        borderRadius: '24px',
        border: `1px solid ${theme.palette.grey.A300}`,
        ...sx,
      }}>
      <StyledTabs value={value} onChange={handleChange} variant={variant} orientation={orientation}>
        {tabs.map((tab) => (
          <Tab key={tab.value} label={tab.label} value={tab.value} disabled={tab.disabled} />
        ))}
      </StyledTabs>
    </Box>
  );
};

export default CustomTabs;
