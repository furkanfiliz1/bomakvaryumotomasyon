import { List, ListItem, ListItemButton, ListItemText, Paper, useTheme } from '@mui/material';
import React from 'react';

interface CompanyDetailInfoSidebarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

interface SidebarSection {
  id: string;
  label: string;
}

const sidebarSections: SidebarSection[] = [
  { id: 'detail-info', label: 'Detay Bilgiler' },
  { id: 'leading-channel', label: 'Geliş Kanalı' },
  { id: 'customer-representative', label: 'Müşteri Temsilcisi' },
  { id: 'customer-acquisition', label: 'Müşteri Kazanım' },
  { id: 'group-company', label: 'Grup Şirketi' },
  { id: 'transaction-history', label: 'İşlem Geçmişi' },
  { id: 'wallet', label: 'Cüzdan' },
];

const CompanyDetailInfoSidebar: React.FC<CompanyDetailInfoSidebarProps> = ({ onSectionChange, activeSection }) => {
  const theme = useTheme();

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        height: 'fit-content',
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
                  py: 1.5,
                  px: 3,
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
                    fontWeight: isActive ? 600 : 400,
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

export default CompanyDetailInfoSidebar;
