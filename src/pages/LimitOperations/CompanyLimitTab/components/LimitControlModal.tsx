/**
 * Limit Control Modal Component
 * Modal for activity type selection when score validation requires it
 * Matches legacy LimitControlModal.js functionality exactly
 */

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import type { EnumOption } from '../company-limit-tab.types';

interface LimitControlModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { activityType: string; commentText: string }) => Promise<void>;
  modalType: 'notHaveScore' | 'negativeScore';
  activityTypes: EnumOption[];
  defaultActivityType?: string;
}

/**
 * Get modal messages based on type - matching legacy language texts
 */
const getModalMessages = (modalType: 'notHaveScore' | 'negativeScore') => {
  switch (modalType) {
    case 'notHaveScore':
      return {
        title: 'Skoru Olmayan Firma',
        message: 'Skoru olmayan şirket için limit tanımlanacak. Sebep yazınız.',
      };
    case 'negativeScore':
      return {
        title: 'Olumsuz Skor',
        message: 'Skoru negatif olan şirket için limit tanımlanacak. Sebep yazınız.',
      };
    default:
      return {
        title: 'Bilgi',
        message: 'Aktivite tipi seçimi gereklidir.',
      };
  }
};

/**
 * Limit Control Modal Component
 */
export const LimitControlModal: React.FC<LimitControlModalProps> = ({
  open,
  onClose,
  onSubmit,
  modalType,
  activityTypes,
  defaultActivityType,
}) => {
  const [activityType, setActivityType] = useState(defaultActivityType || '');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ activityType?: string; commentText?: string }>({});

  const modalMessages = getModalMessages(modalType);

  /**
   * Validate form fields
   */
  const validateForm = (): boolean => {
    const newErrors: { activityType?: string; commentText?: string } = {};

    if (!activityType || activityType === '') {
      newErrors.activityType = 'Aktivite tipi seçimi zorunludur';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        activityType,
        commentText: commentText.trim(),
      });

      // Reset form
      setActivityType(defaultActivityType || '');
      setCommentText('');
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Limit control modal submit error:', error);
      // Error handling is done by parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle cancel
   */
  const handleCancel = () => {
    // Reset form
    setActivityType(defaultActivityType || '');
    setCommentText('');
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="sm" fullWidth disableEscapeKeyDown>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div">
          {modalMessages.title}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {modalMessages.message}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Activity Type Selection */}
          <FormControl fullWidth error={!!errors.activityType}>
            <InputLabel id="activity-type-label">Aktivite Tipi</InputLabel>
            <Select
              labelId="activity-type-label"
              value={activityType}
              label="Aktivite Tipi"
              onChange={(e) => setActivityType(e.target.value)}
              disabled>
              <MenuItem value="">
                <em>Seçiniz</em>
              </MenuItem>
              {activityTypes.map((option) => (
                <MenuItem key={option.Value} value={option.Value}>
                  {option.Description}
                </MenuItem>
              ))}
            </Select>
            {errors.activityType && (
              <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                {errors.activityType}
              </Typography>
            )}
          </FormControl>

          {/* Comment Text */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Yorum"
            placeholder="Limit tanımı için gerekçenizi yazın..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            error={!!errors.commentText}
            helperText={errors.commentText}
            disabled={isSubmitting}
            inputProps={{ maxLength: 500 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={handleCancel} variant="outlined" color="inherit" disabled={isSubmitting}>
          İptal
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={isSubmitting}>
          {isSubmitting ? 'İşleniyor...' : 'Devam Et'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
