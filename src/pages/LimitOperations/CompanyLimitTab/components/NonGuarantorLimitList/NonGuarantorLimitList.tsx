/**
 * Non-Guarantor Limit List Component
 * Manages non-guarantor (garantörsüz) limit definitions with accordion structure
 * Matches legacy NonGuarantorLimitList.js functionality exactly
 * Key difference: Uses createLimitCardGroups business logic instead of controlScore
 */

import { useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Card, Typography } from '@mui/material';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateNonGuarantorLimitMutation,
  useDeleteNonGuarantorLimitMutation,
  useUpdateNonGuarantorLimitMutation,
} from '../../company-limit-tab.api';
import type {
  EnumOption,
  FinancerCompany,
  NonGuarantorCompanyListItem,
  NonGuarantorLimitCreateRequest,
  NonGuarantorLimitUpdateRequest,
} from '../../company-limit-tab.types';
import type { NonGuarantorLimitFormData } from '../../helpers';
import { createNonGuarantorLimitFormSchema } from '../../helpers';
import { NonGuarantorLimitEmptyState, NonGuarantorLimitForm, NonGuarantorLimitTable } from './index';

interface NonGuarantorLimitListProps {
  getNonGuarantedList: () => void;
  withoutGuarantorLimitListData: NonGuarantorCompanyListItem[];
  withoutGuarantorLimitData?: NonGuarantorCompanyListItem[] | null;
  onChangeNonGuarantorLimitField: (name: string, value: unknown, index: number) => void;
  getFinancersLimit: () => void;
  productTypes?: EnumOption[];
  financerCompanies?: FinancerCompany[];
  companyId: string;
}

/**
 * Limit card group structure - matching legacy createLimitCardGroups exactly
 */
interface LimitCardGroup {
  description: string;
  values: NonGuarantorCompanyListItem[];
}

/**
 * Non-Guarantor Limit List Component
 */
export const NonGuarantorLimitList: React.FC<NonGuarantorLimitListProps> = ({
  getNonGuarantedList,
  withoutGuarantorLimitListData,
  withoutGuarantorLimitData,
  onChangeNonGuarantorLimitField,
  getFinancersLimit,
  productTypes,
  financerCompanies,
  companyId,
}) => {
  // Notification system
  const notice = useNotice();

  // State for limit card groups - matching legacy createLimitCardGroups
  const [limitCardGroups, setLimitCardGroups] = useState<LimitCardGroup[]>([]);

  // Create form schema using external schema helper
  const nonGuarantorLimitFormSchema = useMemo(
    () => createNonGuarantorLimitFormSchema(productTypes, financerCompanies),
    [productTypes, financerCompanies],
  );

  // Form setup for adding new non-guarantor limit
  const form = useForm<NonGuarantorLimitFormData>({
    defaultValues: {
      selectedProduct: '',
      selectedFinancer: '',
      totalLimit: 0,
    },
    resolver: yupResolver(nonGuarantorLimitFormSchema),
    mode: 'onSubmit', // Change to onSubmit to avoid validation during reset
  });

  // API mutations
  const [createNonGuarantorLimit, { isLoading: isCreating, error: createError }] = useCreateNonGuarantorLimitMutation();
  const [updateNonGuarantorLimit, { isLoading: isUpdating, error: updateError }] = useUpdateNonGuarantorLimitMutation();
  const [deleteNonGuarantorLimit, { isLoading: isDeleting, error: deleteError }] = useDeleteNonGuarantorLimitMutation();

  // Error handling for all mutations
  useErrorListener([createError, updateError, deleteError]);

  const isLoading = isCreating || isUpdating || isDeleting;

  /**
   * Handle showing error messages using notice system
   */
  const handleShowErrorMessage = (message: string) => {
    notice({
      variant: 'error',
      title: 'Hata',
      message,
    });
  };

  /**
   * Create limit card groups - matching legacy createLimitCardGroups exactly
   * This groups the limits by product type description
   */
  const createLimitCardGroups = useCallback(
    (productTypesData: EnumOption[]) => {
      const newLimitData: LimitCardGroup[] = [];

      for (const limit of withoutGuarantorLimitListData) {
        const matchingProductType = productTypesData.find(
          (productType) => String(limit.ProductType) === productType.Value,
        );

        if (matchingProductType) {
          const existingLimitDataIndex = newLimitData.findIndex(
            (item) => item.description === matchingProductType.Description,
          );

          if (existingLimitDataIndex >= 0) {
            newLimitData[existingLimitDataIndex].values.push(limit);
          } else {
            newLimitData.push({
              description: matchingProductType.Description,
              values: [limit],
            });
          }
        }
      }

      setLimitCardGroups(newLimitData);
    },
    [withoutGuarantorLimitListData],
  );

  /**
   * Handle form submission for adding new non-guarantor limit
   */
  const handleAddNonGuarantorLimit = async () => {
    try {
      // Get form values
      const formValues = form.getValues();

      // Validation checks matching legacy
      if (!formValues.selectedProduct || !formValues.selectedFinancer || formValues.totalLimit === 0) {
        notice({
          variant: 'error',
          title: 'Başarısız',
          message: 'Tüm alanları doldurmanız gerekmektedir',
        });
        return;
      }

      const payload: NonGuarantorLimitCreateRequest = {
        CompanyId: Number(companyId),
        ProductType: Number(formValues.selectedProduct),
        FinancerCompanyId: Number(formValues.selectedFinancer),
        TotalLimit: Number(formValues.totalLimit),
      };

      await createNonGuarantorLimit(payload).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem gerçekleştirildi',
      });

      // Reset form to default values - matching legacy
      form.reset({
        selectedProduct: '',
        selectedFinancer: '',
        totalLimit: 0,
      });
      getNonGuarantedList();
    } catch (error) {
      console.error('Add non-guarantor limit error:', error);
    }
  };

  /**
   * Handle updating non-guarantor limit definition
   */
  const handleUpdateNonGuarantorLimit = async (limitId: number) => {
    try {
      // Find the limit to update
      const limitToUpdate = withoutGuarantorLimitListData.find((limit) => limit.Id === limitId);
      if (!limitToUpdate) return;

      const payload: NonGuarantorLimitUpdateRequest = {
        TotalLimit: limitToUpdate.TotalLimit,
        Id: limitId,
      };

      await updateNonGuarantorLimit({ id: limitId, data: payload }).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem gerçekleştirildi',
      });

      getNonGuarantedList();
    } catch (error) {
      console.error('Update non-guarantor limit error:', error);
    }
  };

  /**
   * Handle deleting non-guarantor limit
   */
  const handleDeleteNonGuarantorLimit = async (limitId: number) => {
    try {
      await deleteNonGuarantorLimit(limitId).unwrap();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İşlem gerçekleştirildi',
      });

      getNonGuarantedList();
    } catch (error) {
      console.error('Delete non-guarantor limit error:', error);
    }
  };

  /**
   * Handle error display from withoutGuarantorLimitData - matching legacy componentWillReceiveProps
   */
  useEffect(() => {
    if (withoutGuarantorLimitData && withoutGuarantorLimitData.length > 0) {
      let errorMessage = '';

      for (const limit of withoutGuarantorLimitData) {
        if (limit.ErrorMessage && limit.ErrorMessage !== '') {
          errorMessage = `${errorMessage}${limit.FinancerName}: ${limit.ErrorMessage}<br>`;
        }
      }

      if (errorMessage !== '') {
        notice({
          variant: 'error',
          title: 'Başarısız',
          message: errorMessage.replace('<br>', '\n'),
        });
      }
    }
  }, [withoutGuarantorLimitData, notice]);

  /**
   * Update limit card groups when data changes - matching legacy componentDidUpdate
   */
  useEffect(() => {
    if (productTypes && productTypes.length > 0) {
      createLimitCardGroups(productTypes);
    }
  }, [productTypes, withoutGuarantorLimitListData, createLimitCardGroups]);

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
          <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 500, color: 'primary.main' }}>
            Garantörsüz Limit Listesi
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          {/* Add New Non-Guarantor Limit Form - Using separated component */}
          <NonGuarantorLimitForm
            form={form}
            schema={nonGuarantorLimitFormSchema}
            onSubmit={handleAddNonGuarantorLimit}
            onGetFinancersLimit={getFinancersLimit}
            isLoading={isLoading}
          />

          <hr />

          {/* Non-Guarantor Limits List - Using separated components */}
          {withoutGuarantorLimitListData.length > 0 ? (
            limitCardGroups.map((group) => (
              <NonGuarantorLimitTable
                key={group.description}
                group={group}
                onUpdate={handleUpdateNonGuarantorLimit}
                onDelete={handleDeleteNonGuarantorLimit}
                onFieldChange={onChangeNonGuarantorLimitField}
                onShowErrorMessage={handleShowErrorMessage}
                isLoading={isLoading}
              />
            ))
          ) : (
            <NonGuarantorLimitEmptyState />
          )}
        </AccordionDetails>
      </Accordion>
    </Card>
  );
};
