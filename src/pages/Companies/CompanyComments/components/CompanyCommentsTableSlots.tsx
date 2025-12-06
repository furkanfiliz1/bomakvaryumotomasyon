import React from 'react';
import { Avatar, Chip, Typography, Box } from '@mui/material';
import type { CompanyComment } from '../company-comments.types';
import { formatCommentText, getCommentStatusColor, getUserInitials } from '../helpers';

/**
 * Table slots for Company Comments table
 * Following OperationPricing patterns and project standards
 */

// User Name Slot with Avatar
export const UserNameSlot: React.FC<{ row: CompanyComment }> = ({ row }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>{getUserInitials(row.UserName)}</Avatar>
    <Typography variant="body2" noWrap>
      {row.UserName || '-'}
    </Typography>
  </Box>
);

// Comment Text Slot with proper formatting
export const CommentTextSlot: React.FC<{ row: CompanyComment }> = ({ row }) => (
  <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
    {formatCommentText(row.CommentText)}
  </Typography>
);

// Activity Status Slot with colored chip
export const ActivityStatusSlot: React.FC<{ row: CompanyComment }> = ({ row }) => (
  <Chip
    label={row.ActivityStatus || '-'}
    color={getCommentStatusColor(row.ActivityStatus)}
    size="small"
    variant="outlined"
  />
);
