import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, useTheme } from '@mui/material';

interface CompanySettingsSidebarProps {
  onSectionChange: (section: string) => void;
  activeSection: string;
}

interface SidebarSection {
  id: string;
  label: string;
}

const sidebarSections: SidebarSection[] = [
  { id: 'system-settings', label: 'Sistem Ayarları' },
  { id: 'limit-settings', label: 'Fatura Limitleri' },
];

const CompanySettingsSidebar: React.FC<CompanySettingsSidebarProps> = ({ onSectionChange, activeSection }) => {
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
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="text.primary">
          Şirket Ayarları
        </Typography>
      </Box>

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

export default CompanySettingsSidebar;
