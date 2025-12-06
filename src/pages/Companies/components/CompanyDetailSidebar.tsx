import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Paper, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface CompanyDetailSidebarProps {
  companyId: string;
  activeTab: string;
}

interface SidebarItem {
  id: string;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { id: 'genel', label: 'Genel', path: 'genel' },
  { id: 'detay', label: 'Detay', path: 'detay' },
  { id: 'dokuman', label: 'Doküman', path: 'dokuman' },
  { id: 'roller', label: 'Roller', path: 'roller' },
  { id: 'kullanici', label: 'Kullanıcı', path: 'kullanici' },
  { id: 'servis-saglayici', label: 'Servis Sağlayıcı', path: 'servis-saglayici' },
  { id: 'ayarlar', label: 'Ayarlar', path: 'ayarlar' },
  { id: 'tarihce', label: 'Tarihçe', path: 'tarihce' },
];

const CompanyDetailSidebar: React.FC<CompanyDetailSidebarProps> = ({ companyId, activeTab }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  const handleItemClick = (path: string) => {
    navigate(`/companies/${companyId}/${path}`);
  };

  return (
    <Paper
      elevation={1}
      sx={{
        height: 'fit-content',
        minHeight: '500px',
        backgroundColor: theme.palette.background.paper,
      }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" color="text.primary">
          Şirket Detayları
        </Typography>
      </Box>

      <List sx={{ p: 0 }}>
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
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
                  primary={item.label}
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

export default CompanyDetailSidebar;
