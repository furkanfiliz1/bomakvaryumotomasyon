/**
 * Guarantor Limit List Component
 * Manages guarantor limit definitions with accordion structure
 * Matches legacy GuarantorLimitList.js functionality exactly
 */

import { Form, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { ExpandMore, List } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { currencyFormatter } from '@utils';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateGuarantorLimitMutation,
  useDeleteGuarantorLimitDetailMutation,
  useUpdateGuarantorLimitDetailMutation,
} from '../../company-limit-tab.api';
import type {
  EnumOption,
  FinancerCompany,
  GuarantorCompanyListItem,
  GuarantorLimitCreateRequest,
  GuarantorLimitUpdateRequest,
} from '../../company-limit-tab.types';
import type { GuarantorLimitFormData } from '../../helpers';
import {
  controlScore,
  createGuarantorLimitFormSchema,
  handleScoreModalClose,
  handleScoreModalSubmit,
  translateProductTypeName,
  validateScore,
} from '../../helpers';
import { LimitControlModal } from '../LimitControlModal';
import { RisksAllowanceModal } from '../RisksAllowanceModal';
import { GuarantorLimitTableRow } from './GuarantorLimitTableRow';

interface GuarantorLimitListProps {
  creditRiskLoanDecision: number | null | undefined;
  figoScoreLoanDecision: number | null | undefined;
  roofLimitData: GuarantorCompanyListItem[];
  getGuarantedList: () => void;
  withGuarantorLimitListData: GuarantorCompanyListItem[];
  onChangeGuarantorLimitField: (field: string, value: unknown) => void;
  activityTypes?: EnumOption[];
  financerCompanies?: FinancerCompany[];
  companyId: number; // Required for RisksAllowanceModal
}

/**
 * Guarantor Limit List Component
 */
export const GuarantorLimitList: React.FC<GuarantorLimitListProps> = ({
  creditRiskLoanDecision,
  figoScoreLoanDecision,
  roofLimitData,
  getGuarantedList,
  withGuarantorLimitListData,
  onChangeGuarantorLimitField,
  activityTypes,
  financerCompanies,
  companyId,
}) => {
  // Notification system
  const notice = useNotice();

  // Create form schema using external schema helper
  const guarantorLimitFormSchema = useMemo(
    () => createGuarantorLimitFormSchema(roofLimitData, financerCompanies),
    [roofLimitData, financerCompanies],
  );

  // Form setup for adding new guarantor limit
  const form = useForm<GuarantorLimitFormData>({
    defaultValues: {
      selectedProduct: '',
      selectedFinancer: '',
      totalLimit: 0,
    },
    resolver: yupResolver(guarantorLimitFormSchema),
    mode: 'onSubmit',
  });

  // Modal state for limit control - matching legacy LimitControlModal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'notHaveScore' | 'negativeScore'>('notHaveScore');
  const [pendingAction, setPendingAction] = useState<{
    type: 'add' | 'update';
    guarantorLimitId?: number;
    detailId?: number;
  } | null>(null);

  // Risks Allowance Modal state - matches legacy RisksAllowanceModal usage
  const [isRisksModalOpen, setIsRisksModalOpen] = useState(false);
  const [selectedFinancerId, setSelectedFinancerId] = useState(0);
  const [selectedProductType, setSelectedProductType] = useState(0);

  // API mutations
  const [createGuarantorLimit, { isLoading: isCreating, error: createError }] = useCreateGuarantorLimitMutation();
  const [updateGuarantorLimitDetail, { isLoading: isUpdating, error: updateError }] =
    useUpdateGuarantorLimitDetailMutation();
  const [deleteGuarantorLimitDetail, { isLoading: isDeleting, error: deleteError }] =
    useDeleteGuarantorLimitDetailMutation();

  // Error handling for all mutations
  useErrorListener([createError, updateError, deleteError]);

  const isLoading = isCreating || isUpdating || isDeleting;

  /**
   * Handle score control using shared helper
   */
  const handleControlScore = async (actionType: 'add' | 'update', guarantorLimitId?: number, detailId?: number) => {
    await controlScore(
      actionType,
      { creditRiskLoanDecision, figoScoreLoanDecision, notice },
      {
        onAdd: async (activityType?: string, commentText?: string) => {
          await executeAddAction(activityType, commentText);
        },
        onUpdate: async (guarantorLimitId?: number, detailId?: number, activityType?: string, commentText?: string) => {
          await executeUpdateAction(guarantorLimitId!, detailId!, activityType, commentText);
        },
      },
      {
        setModalType,
        setPendingAction,
        setIsModalOpen,
      },
      guarantorLimitId,
      detailId,
    );
  };

  /**
   * Execute add action with validation
   */
  const executeAddAction = async (activityType?: string, commentText?: string) => {
    try {
      // Get form values
      const formValues = form.getValues();

      // Validation checks matching legacy
      if (roofLimitData.length < 1 || roofLimitData === null) {
        notice({
          variant: 'error',
          title: 'Başarısız',
          message: 'Çatı limit tanımı gereklidir',
        });
        return;
      }

      if (!formValues.selectedProduct || !formValues.selectedFinancer || formValues.totalLimit === 0) {
        notice({
          variant: 'error',
          title: 'Başarısız',
          message: 'Tüm alanları doldurmanız gerekmektedir',
        });
        return;
      }

      const validation = validateScore({ creditRiskLoanDecision, figoScoreLoanDecision, notice });

      const payload: GuarantorLimitCreateRequest = {
        ActivityType: activityType || validation.activityType || null,
        CommentText: commentText || '',
        CompanyPeakLimitId: Number(formValues.selectedProduct),
        FinancerId: Number(formValues.selectedFinancer),
        TotalLimit: Number(formValues.totalLimit),
        IsHold: false,
      };

      await createGuarantorLimit(payload).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Garantörlü limit başarıyla eklendi',
      });

      // Reset form to default values
      form.reset({
        selectedProduct: 0,
        selectedFinancer: 0,
        totalLimit: 0,
      });
      getGuarantedList();
    } catch (error) {
      console.error('Add guarantor limit error:', error);
    }
  };

  /**
   * Execute update action
   */
  const executeUpdateAction = async (
    guarantorLimitId: number,
    detailId: number,
    activityType?: string,
    commentText?: string,
  ) => {
    try {
      const validation = validateScore({ creditRiskLoanDecision, figoScoreLoanDecision, notice });

      // Find the limit and detail to update
      const limitToUpdate = withGuarantorLimitListData.find((limit) => limit.Id === guarantorLimitId);
      if (!limitToUpdate) return;
      const detailToUpdate = limitToUpdate.LimitDetails?.find((detail) => detail.Id === detailId);
      if (!detailToUpdate) return;

      const payload: GuarantorLimitUpdateRequest = {
        ActivityType: activityType || validation.activityType || null,
        CommentText: commentText || '',
        TotalLimit: detailToUpdate.TotalLimit,
        Id: detailId,
        IsHold: detailToUpdate.IsHold || false,
      };

      await updateGuarantorLimitDetail({ id: detailId, data: payload }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Garantörlü limit başarıyla güncellendi',
      });

      getGuarantedList();
    } catch (error) {
      console.error('Update guarantor limit error:', error);
    }
  };

  /**
   * Handle deleting guarantor limit
   */
  const handleDeleteGuarantorLimit = async (detailId: number) => {
    try {
      await deleteGuarantorLimitDetail(detailId).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Garantörlü limit başarıyla silindi',
      });

      getGuarantedList();
    } catch (error) {
      console.error('Delete guarantor limit error:', error);
    }
  };

  /**
   * Handle modal submission using shared helper
   */
  const handleModalSubmit = async (data: { activityType: string; commentText: string }) => {
    await handleScoreModalSubmit(
      data,
      pendingAction,
      {
        onAdd: async (activityType?: string, commentText?: string) => {
          await executeAddAction(activityType, commentText);
        },
        onUpdate: async (guarantorLimitId?: number, detailId?: number, activityType?: string, commentText?: string) => {
          await executeUpdateAction(guarantorLimitId!, detailId!, activityType, commentText);
        },
      },
      {
        setPendingAction,
        setIsModalOpen,
      },
    );
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

  /**
   * Handle TotalLimit change for financer details
   * Updates local state immediately like legacy implementation
   */
  const handleTotalLimitChange = (limitId: number, detailId: number, totalLimit: number) => {
    // Update local state directly like legacy onChangeGuarantorLimitField
    onChangeGuarantorLimitField('TotalLimit', { limitId, detailId, totalLimit });
  };

  /**
   * Handle IsHold change for financer details
   * Only updates local state, no direct API call
   */
  const handleIsHoldChange = (limitId: number, detailId: number, isHold: boolean) => {
    // Update local state only through parent callback
    // The parent component will handle the state management
    // Backend update will be handled when user saves the form or performs bulk update
    onChangeGuarantorLimitField('IsHold', { limitId, detailId, isHold });
  };

  /**
   * Handle opening risks allowance modal
   */
  const handleShowRisksModal = (financerId: number, productType: number) => {
    setSelectedFinancerId(financerId);
    setSelectedProductType(productType);
    setIsRisksModalOpen(true);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
          sx={{
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.15)',
              color: 'primary.dark',
              '& .MuiSvgIcon-root': {
                color: 'primary.dark',
              },
            },
            '& .MuiAccordionSummary-content': {
              margin: '12px 0',
            },
          }}>
          <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600, color: 'primary.main' }}>
            Garantörlü Limit Listesi
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Add New Guarantor Limit Form */}
          <Box sx={{ mb: 3 }}>
            <Form form={form} schema={guarantorLimitFormSchema} space={2} childCol={3}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'end',
                }}>
                <LoadingButton
                  variant="contained"
                  onClick={() => handleControlScore('add')}
                  loading={isLoading}
                  sx={{ width: '100px', height: '40px' }}>
                  Limit Ekle
                </LoadingButton>
              </Box>
            </Form>
          </Box>

          {/* Guarantor Limits List */}
          {withGuarantorLimitListData.length > 0 ? (
            withGuarantorLimitListData.map((limit) => (
              <Paper key={limit.Id} sx={{ mb: 2, p: 3, backgroundColor: '#FAFAFA' }}>
                {/* Product Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 600 }}>
                    {limit.ProductType ? `${translateProductTypeName(limit.ProductType)} Listesi` : ''}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Toplam Limit
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {currencyFormatter(limit.Amount, 'TRY')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Riskler
                      </Typography>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color={limit.UsedLimit && limit.UsedLimit > 0 ? 'red' : 'text.primary'}>
                        {currencyFormatter(limit.UsedLimit, 'TRY')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Kalan Limit
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {currencyFormatter(limit.RemainingLimit, 'TRY')}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Financers Table */}
                <TableContainer component={Paper} sx={{ backgroundColor: 'white', overflowX: 'auto' }}>
                  <Table size="small" sx={{ tableLayout: 'fixed', minWidth: 930 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600, width: 120, minWidth: 120, maxWidth: 120 }}>
                          Finansör
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 100, minWidth: 100, maxWidth: 100 }}>
                          Garantörlük
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 160, minWidth: 160, maxWidth: 160 }}>
                          Tanımlanan Limit
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 140, minWidth: 140, maxWidth: 140 }}>
                          Riskler
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 130, minWidth: 130, maxWidth: 130 }}>
                          Kalan Limit
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, width: 80, minWidth: 80, maxWidth: 80 }}>Hold</TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            width: 120,
                            minWidth: 120,
                            maxWidth: 120,
                            position: 'sticky',
                            right: 0,
                            backgroundColor: 'white',
                            zIndex: 1,
                          }}
                          align="center">
                          İşlemler
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {limit.LimitDetails && limit.LimitDetails.length > 0 ? (
                        limit.LimitDetails.map((detail) => (
                          <GuarantorLimitTableRow
                            key={detail.Id}
                            limit={limit}
                            detail={detail}
                            onUpdateLimit={(limitId, detailId) => handleControlScore('update', limitId, detailId)}
                            onDeleteLimit={(detailId) => handleDeleteGuarantorLimit(detailId)}
                            onTotalLimitChange={handleTotalLimitChange}
                            onIsHoldChange={handleIsHoldChange}
                            onShowRisksModal={handleShowRisksModal}
                            isLoading={isLoading}
                          />
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} align="center" sx={{ py: 4, backgroundColor: '#EAECEF' }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                              <List fontSize="large" color="action" />
                              <Typography variant="body2" color="text.secondary">
                                Tercih edilen bankalarla ilgili belirlenen bir limit bulunmamaktadır.
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            ))
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#EAECEF' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <List fontSize="large" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Tercih edilen bankalarla ilgili belirlenen bir limit bulunmamaktadır.
                </Typography>
              </Box>
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Limit Control Modal */}
      <LimitControlModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        modalType={modalType}
        activityTypes={activityTypes || []}
        defaultActivityType={modalType === 'notHaveScore' ? '10' : '11'}
      />

      {/* Risks Allowance Modal */}
      <RisksAllowanceModal
        open={isRisksModalOpen}
        onClose={() => setIsRisksModalOpen(false)}
        companyId={companyId}
        selectedFinancerId={selectedFinancerId}
        selectedFinancerProductType={selectedProductType}
      />
    </Card>
  );
};
