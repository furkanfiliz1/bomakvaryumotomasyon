import { Button, useNotice } from '@components';
import { Delete as DeleteIcon, Visibility } from '@mui/icons-material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteLegalProceedingMutation } from '../limit-operations.api';
import type { LegalProceedingsItem } from '../limit-operations.types';

interface LegalProceedingsTableRowActionsProps {
  item: LegalProceedingsItem;
  onDeleted?: () => void;
}

/**
 * Table row actions for Legal Proceedings items
 * Provides detail and delete action buttons
 */
export const LegalProceedingsTableRowActions: React.FC<LegalProceedingsTableRowActionsProps> = ({
  item,
  onDeleted,
}) => {
  const navigate = useNavigate();
  const notice = useNotice();
  const [deleteLegalProceeding, { isLoading: isDeleting }] = useDeleteLegalProceedingMutation();

  const handleDelete = async () => {
    try {
      await notice({
        type: 'confirm',
        variant: 'error',
        title: 'Kanuni Takip Kaydını Sil',
        message: 'Bu kanuni takip kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
        buttonTitle: isDeleting ? 'Siliniyor...' : 'Sil',
        catchOnCancel: true,
      });

      await deleteLegalProceeding(item.Id).unwrap();

      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Kanuni takip kaydı başarıyla silindi.',
      });

      // Trigger parent component refresh if callback provided
      onDeleted?.();
    } catch (error) {
      // User cancelled or API error occurred
      if (error && typeof error === 'object' && 'data' in error) {
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Kanuni takip kaydı silinirken bir hata oluştu.',
        });
      }
    }
  };

  return (
    <>
      <Button
        id={`legal-proceedings-detail-${item.Id}`}
        size="small"
        variant="outlined"
        color="primary"
        startIcon={<Visibility />}
        onClick={() => navigate(`/limit-operations/legal-proceedings/${item.Id}/edit`)}
        sx={{ mr: 1 }}>
        Detay
      </Button>
      <Button
        id={`legal-proceedings-delete-${item.Id}`}
        size="small"
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={handleDelete}
        disabled={isDeleting}>
        Sil
      </Button>
    </>
  );
};

export default LegalProceedingsTableRowActions;
