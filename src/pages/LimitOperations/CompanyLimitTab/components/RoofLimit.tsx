/**
 * Roof Limit Component
 * Manages roof (peak) limit definitions for different product types
 * Matches legacy RoofLimit.js functionality exactly
 */

import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Delete, Refresh } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, CardHeader, Grid, IconButton, Typography, useTheme } from '@mui/material';
import React, { useState } from 'react';
import InputCurrencyWithoutForm from '../../../../components/common/Form/InputCurrencyWithoutForm';
import {
  useCreatePeakLimitMutation,
  useDeletePeakLimitDetailMutation,
  useUpdatePeakLimitDetailMutation,
} from '../company-limit-tab.api';
import type { PeakLimitCreateRequest, PeakLimitUpdateRequest, RoofLimitProps } from '../company-limit-tab.types';
import { handleScoreModalClose, translateProductTypeName } from '../helpers';
import { useRoofLimitForm } from '../hooks';
import { LimitControlModal } from './LimitControlModal';

/**
 * Roof Limit Component
 * Allows adding/editing/deleting roof limits for different product types
 * Includes score validation and limit control modals
 */
export const RoofLimit: React.FC<RoofLimitProps> = ({
  creditRiskLoanDecision,
  figoScoreLoanDecision,
  roofLimitData,
  getGuarantedList,
  onChangeRoofLimitField,
  productTypes,
  activityTypes,
  companyId,
}) => {
  // Form management for adding new roof limits
  const { form, schema, resetForm } = useRoofLimitForm();

  const theme = useTheme();

  // Notification system
  const notice = useNotice();

  // Modal state for limit control - matching legacy LimitControlModal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'notHaveScore' | 'negativeScore'>('notHaveScore');
  const [pendingAction, setPendingAction] = useState<{
    type: 'add' | 'update';
    formData?: Record<string, unknown>;
    limitId?: number;
  } | null>(null);

  // API mutations
  const [createPeakLimit, { isLoading: isCreating, error: createError }] = useCreatePeakLimitMutation();
  const [updatePeakLimitDetail, { isLoading: isUpdating, error: updateError }] = useUpdatePeakLimitDetailMutation();
  const [deletePeakLimitDetail, { isLoading: isDeleting, error: deleteError }] = useDeletePeakLimitDetailMutation();

  // Error handling for all mutations
  useErrorListener([createError, updateError, deleteError]);

  const isLoading = isCreating || isUpdating || isDeleting;

  /**
   * Handle score control - validates score before action
   * Matches legacy controlScore method logic
   */
  const handleControlScore = async (
    actionType: 'add' | 'update',
    formData?: Record<string, unknown>,
    limitId?: number,
  ) => {
    // Check score conditions matching legacy logic
    if (creditRiskLoanDecision !== null && figoScoreLoanDecision === null) {
      // Credit risk exists but no FigoScore - show error with confirmation
      try {
        await notice({
          type: 'confirm',
          variant: 'error',
          title: 'Başarısız',
          message: 'FigoScore skoru bulunmamaktadır',
          buttonTitle: 'Devam Et',
          catchOnCancel: true,
        });

        // User confirmed - execute action directly without ActivityType
        if (actionType === 'add' && formData) {
          await executeAddAction(formData);
        } else if (actionType === 'update' && limitId !== undefined) {
          await executeUpdateAction(limitId);
        }
      } catch {
        // User cancelled - do nothing
        return;
      }
    } else if (creditRiskLoanDecision === null && figoScoreLoanDecision === null) {
      // No scores at all - show modal with ActivityType 10
      setModalType('notHaveScore');
      setPendingAction({ type: actionType, formData, limitId });
      setIsModalOpen(true);
    } else if (figoScoreLoanDecision === 2) {
      // Negative FigoScore - show modal with ActivityType 11
      setModalType('negativeScore');
      setPendingAction({ type: actionType, formData, limitId });
      setIsModalOpen(true);
    } else {
      // Valid scores - execute action directly
      if (actionType === 'add' && formData) {
        await executeAddAction(formData);
      } else if (actionType === 'update' && limitId !== undefined) {
        await executeUpdateAction(limitId);
      }
    }
  };

  /**
   * Execute add action with optional activity details from modal
   * No score validation - validation happens in handleControlScore
   */
  const executeAddAction = async (formData: Record<string, unknown>, activityType?: string, commentText?: string) => {
    try {
      const payload: PeakLimitCreateRequest = {
        CompanyId: Number(companyId),
        ProductType: Number(formData.selectedProduct),
        Amount: Number(formData.TotalLimit),
        ActivityType: activityType || null,
        CommentText: commentText || '',
      };

      await createPeakLimit(payload).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çatı limit başarıyla eklendi',
      });

      getGuarantedList();
      resetForm();
    } catch (error) {
      console.error('Add roof limit error:', error);
    }
  };

  /**
   * Execute update action with optional activity details from modal
   * No score validation - validation happens in handleControlScore
   */
  const executeUpdateAction = async (limitId: number, activityType?: string, commentText?: string) => {
    try {
      const limitToUpdate = roofLimitData.find((limit) => limit.Id === limitId);
      if (!limitToUpdate) return;

      const payload: PeakLimitUpdateRequest = {
        Id: limitId,
        Amount: limitToUpdate.Amount,
        ActivityType: activityType || null,
        CommentText: commentText || '',
      };

      await updatePeakLimitDetail({ id: limitId, data: payload }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Çatı limit başarıyla güncellendi',
      });

      getGuarantedList();
    } catch (error) {
      console.error('Update roof limit error:', error);
    }
  };

  /**
   * Handle form submission for adding new roof limit
   */
  const handleAddRoofLimit = async (formData: Record<string, unknown>) => {
    handleControlScore('add', formData);
  };

  /**
   * Handle updating existing roof limit
   */
  const handleUpdateRoofLimit = async (limitId: number) => {
    handleControlScore('update', undefined, limitId);
  };

  /**
   * Handle deleting roof limit
   */
  const handleDeleteRoofLimit = async (limitId: number) => {
    try {
      await deletePeakLimitDetail(limitId).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Tavan limit başarıyla silindi',
      });

      getGuarantedList();
    } catch (error) {
      console.error('Delete roof limit error:', error);
    }
  };

  /**
   * Handle modal submission - directly execute pending actions
   */
  const handleModalSubmit = async (data: { activityType: string; commentText: string }) => {
    if (!pendingAction) return;

    try {
      const { type, formData, limitId } = pendingAction;

      if (type === 'add' && formData) {
        await executeAddAction(formData, data.activityType, data.commentText);
      } else if (type === 'update' && limitId !== undefined) {
        await executeUpdateAction(limitId, data.activityType, data.commentText);
      }

      // Reset modal state after successful execution
      setPendingAction(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Modal submit error:', error);
      // Keep modal open on error so user can retry
    }
  };

  /**
   * Handle modal close using shared helper
   */
  const handleModalClose = () => {
    handleScoreModalClose({
      setPendingAction,
      setIsModalOpen,
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardHeader title="Çatı Limit Tanımları" />
      <CardContent>
        {/* Add New Roof Limit Form */}
        <Form form={form} schema={schema} space={2} childCol={4}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'end',
            }}>
            <LoadingButton
              sx={{ width: '100px', height: '40px' }}
              loading={isLoading}
              variant="contained"
              color="primary"
              onClick={form.handleSubmit(handleAddRoofLimit)}>
              Limit Ekle
            </LoadingButton>
          </Box>
        </Form>

        {/* Existing Roof Limits */}
        {roofLimitData && roofLimitData.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              {roofLimitData.map((limit, index) => (
                <Grid item xs={12} md={6} key={limit.Id || index}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {translateProductTypeName(limit.ProductType, productTypes)}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
                        {/* Editable Amount Input */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" color="text.secondary" gutterBottom>
                            Toplam Limit
                          </Typography>
                          <InputCurrencyWithoutForm
                            value={limit.Amount || 0}
                            onChange={(value) => {
                              onChangeRoofLimitField(Number(value), index);
                            }}
                            currency="TRY"
                            name={`roofLimit_${limit.Id}`}
                            id={`roofLimit_${limit.Id}`}
                            maxLength={100}
                            style={{
                              width: '100%',
                            }}
                          />
                        </Box>

                        {/* Update Button */}
                        <IconButton
                          color="info"
                          onClick={() => handleUpdateRoofLimit(limit.Id)}
                          disabled={isLoading}
                          sx={{
                            border: '1px solid',
                            borderColor: theme.palette.info.dark,
                            borderRadius: 1,
                            height: 40,
                            width: 40,
                          }}>
                          <Refresh fontSize="small" sx={{ color: theme.palette.info.dark }} />
                        </IconButton>

                        {/* Delete Button */}
                        <IconButton
                          onClick={() => handleDeleteRoofLimit(limit.Id)}
                          disabled={isLoading}
                          sx={{
                            border: '1px solid',
                            borderColor: theme.palette.error[700],
                            borderRadius: 1,
                            height: 40,
                            width: 40,
                            color: theme.palette.error[700],
                          }}>
                          <Delete
                            fontSize="small"
                            sx={{
                              color: theme.palette.error[700],
                            }}
                          />
                        </IconButton>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </CardContent>

      {/* Limit Control Modal */}
      <LimitControlModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        modalType={modalType}
        activityTypes={activityTypes || []}
        defaultActivityType={modalType === 'notHaveScore' ? '10' : '11'}
      />
    </Card>
  );
};
