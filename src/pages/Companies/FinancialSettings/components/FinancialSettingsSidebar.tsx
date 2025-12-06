import { List, ListItem, ListItemButton, ListItemText, Paper, useTheme } from '@mui/material';
import React from 'react';
import { FinancialSettingsSection } from '../financial-settings.types';

interface FinancialSettingsSidebarProps {
  onSectionChange: (section: FinancialSettingsSection) => void;
  activeSection: FinancialSettingsSection;
}

interface SidebarSection {
  id: FinancialSettingsSection;
  label: string;
}

const sidebarSections: SidebarSection[] = [
  { id: 'finance-company-features', label: 'Finans Şirketi Özellikleri' },
  { id: 'invoice-finance-settings', label: 'Fatura Finansmanı' },
  { id: 'cheque-finance-settings', label: 'Çek Finansmanı' },
  { id: 'supplier-finance-settings', label: 'Tedarikçi Finansmanı' },
  { id: 'spot-loan-settings', label: 'Faturalı Spot Kredi' },
  { id: 'spot-loan-without-invoice-settings', label: 'Faturasız Spot Kredi' },
  { id: 'receiver-finance-settings', label: 'Alacak Finansmanı' },
  { id: 'commercial-loan-settings', label: 'Taksitli Ticari Kredi' },
  { id: 'rotative-credit-settings', label: 'Rotatif Kredi' },
];

const FinancialSettingsSidebar: React.FC<FinancialSettingsSidebarProps> = ({ onSectionChange, activeSection }) => {
  const theme = useTheme();

  const handleSectionClick = (sectionId: FinancialSettingsSection) => {
    onSectionChange(sectionId);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        height: '100%',
        minHeight: '400px',

        backgroundColor: theme.palette.background.paper,
      }}>
      <List sx={{ p: 0 }}>
        {sidebarSections.map((section) => {
          const isActive = activeSection === section.id;

          return (
            <ListItem key={section.id} disablePadding>
              <ListItemButton
                onClick={() => handleSectionClick(section.id)}
                sx={{
                  py: 1,
                  px: 2,
                  backgroundColor: isActive ? theme.palette.primary.main : 'transparent',
                  color: isActive ? theme.palette.primary.contrastText : theme.palette.text.primary,
                  borderRight: isActive ? `3px solid ${theme.palette.primary.dark}` : 'none',
                  '&:hover': {
                    backgroundColor: isActive ? theme.palette.primary.main : theme.palette.action.hover,
                  },
                }}>
                <ListItemText
                  primary={section.label}
                  primaryTypographyProps={{
                    fontWeight: 400,
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
};

export default FinancialSettingsSidebar;
