import { Icon } from '@components';
import { ExpandMore as ChevronDownIcon, ChevronRight as ChevronRightIcon } from '@mui/icons-material';
import {
  Box,
  Card,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import React from 'react';
import type { StepDefinition } from '../customer-request-branch-detail.types';

export interface StepNavigationSidebarProps {
  steps: StepDefinition[];
  activeStep: string;
  onStepSelect: (stepId: string) => void;
}

/**
 * Step Navigation Sidebar Component
 * Displays accordion-style navigation with step statuses
 * Matches legacy sidebar exactly
 */
export const StepNavigationSidebar: React.FC<StepNavigationSidebarProps> = ({ steps, activeStep, onStepSelect }) => {
  // Status badge styling matching legacy system
  const getStatusChip = (status: string | null, activeStep: string) => {
    // If status is null, don't show any chip (for Summary & Approval step)
    if (status === null) {
      return null;
    }

    let color: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';

    switch (status) {
      case 'Tamamlandı':
        color = 'success';
        break;
      case 'Başlandı':
        color = 'warning';
        break;
      case 'Opsiyonel':
        color = 'primary';
        break;
      case 'Başlanmadı':
      default:
        color = 'default';
        break;
    }

    return (
      <Chip
        label={status}
        color={color}
        size="small"
        sx={{
          fontWeight: 'bold',
          fontSize: '0.7rem',
          width: 'fit-content',
          color: color === 'primary' ? 'white' : activeStep === status ? 'white' : 'inherit',
          ...(color === 'primary' && {
            backgroundColor: 'primary.main',
          }),
        }}
      />
    );
  };

  return (
    <Card>
      <CardHeader title="Bölümler" titleTypographyProps={{ variant: 'h6', fontWeight: 'bold' }} />
      <List disablePadding>
        {steps.map((step, index) => (
          <ListItem key={step.id} disablePadding>
            <ListItemButton
              selected={activeStep === step.id}
              onClick={() => onStepSelect(step.id)}
              sx={{
                minHeight: 72,
                '&.Mui-selected': {
                  backgroundColor: 'primary.500',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.700',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}>
              {/* Step Number */}
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  backgroundColor: activeStep === step.id ? 'white' : 'primary.main',
                  color: activeStep === step.id ? 'primary.main' : 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  mr: 2,
                  flexShrink: 0,
                }}>
                {index + 1}
              </Box>

              {/* Step Icon */}
              <ListItemIcon sx={{ minWidth: 'auto', mr: 1 }}>
                <Icon
                  icon={step.icon as keyof typeof import('@components').IconTypes}
                  size={20}
                  color={activeStep === step.id ? 'white' : 'inherit'}
                />
              </ListItemIcon>

              {/* Step Title and Status */}
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      sx={{
                        color: activeStep === step.id ? 'white' : 'inherit',
                        lineHeight: 1.2,
                      }}>
                      {step.title}
                    </Typography>
                    {getStatusChip(step.status, activeStep)}
                  </Box>
                }
                sx={{ margin: 0 }}
              />

              {/* Expand/Collapse Indicator */}
              <Box sx={{ ml: 1, color: activeStep === step.id ? 'white' : 'inherit' }}>
                {activeStep === step.id ? <ChevronDownIcon /> : <ChevronRightIcon />}
              </Box>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Card>
  );
};
