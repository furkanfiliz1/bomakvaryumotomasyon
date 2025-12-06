import {
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
import type { ActivityType } from '../company-history-tab.types';

interface AddCommentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { activityType: string; commentText: string }) => void;
  activityTypes: ActivityType[];
  loading?: boolean;
}

/**
 * Add Comment Dialog Component
 * Matches legacy modal functionality exactly
 */
export const AddCommentDialog: React.FC<AddCommentDialogProps> = ({
  open,
  onClose,
  onSubmit,
  activityTypes,
  loading = false,
}) => {
  const [activityType, setActivityType] = useState('3'); // Default to "Genel Yorum" matching legacy
  const [commentText, setCommentText] = useState('');

  const handleSubmit = () => {
    if (!commentText.trim()) return;

    onSubmit({
      activityType,
      commentText: commentText.trim(),
    });

    // Reset form after submit
    setActivityType('3');
    setCommentText('');
  };

  const handleClose = () => {
    // Reset form on close
    setActivityType('3');
    setCommentText('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Yorum Ekle</DialogTitle>
      <DialogContent>
        <div style={{ padding: '4px' }}>
          <div style={{ marginBottom: '16px' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Aktivite Türü
            </Typography>
            <FormControl fullWidth size="small">
              <InputLabel>Seçiniz</InputLabel>
              <Select
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                label="Seçiniz"
                disabled // Matches legacy - this field is disabled
              >
                {activityTypes.map((type) => (
                  <MenuItem key={type.Value} value={type.Value}>
                    {type.Description}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Yorum Ekle
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Yorumunuzu buraya yazın..."
              variant="outlined"
              size="small"
            />
          </div>
        </div>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button variant="outlined" onClick={handleClose} disabled={loading}>
          Vazgeç
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={loading || !commentText.trim()} color="primary">
          Kaydet
        </Button>
      </DialogActions>
    </Dialog>
  );
};
