import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { usePostActivityLogMutation } from '../company-comments.api';
import type { ActivityType } from '../company-comments.types';

interface AddCommentModalProps {
  open: boolean;
  onClose: () => void;
  companyId: number;
  activityTypes: ActivityType[];
  onSuccess?: () => void;
}

export const AddCommentModal: React.FC<AddCommentModalProps> = ({
  open,
  onClose,
  companyId,
  activityTypes,
  onSuccess,
}) => {
  const [activityType, setActivityType] = useState('3'); // Default to value from original
  const [commentText, setCommentText] = useState('');

  const [postActivityLog, { isLoading }] = usePostActivityLogMutation();

  const handleSubmit = async () => {
    if (!commentText.trim()) {
      return;
    }

    try {
      await postActivityLog({
        activityType,
        commentText: commentText.trim(),
        companyId,
      }).unwrap();

      // Reset form
      setActivityType('3');
      setCommentText('');

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setActivityType('3');
    setCommentText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yorum Ekle</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Aktivite Tipi
            </Typography>
            <TextField fullWidth select value={activityType} onChange={(e) => setActivityType(e.target.value)} disabled>
              {activityTypes.map((type) => (
                <MenuItem key={type.Value} value={type.Value}>
                  {type.Description}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Yorum
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Yorumunuzu yazın..."
              disabled={isLoading}
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Vazgeç
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading || !commentText.trim()}>
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};
