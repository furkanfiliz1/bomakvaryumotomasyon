import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Grid } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Form } from '../../../components/common/Form';
import { useUpdateCompanyMutation, useUpdateScoreCompanyByIdentifierMutation } from '../companies.api';
import { Company } from '../companies.types';
import type { CompanyFormData } from '../hooks';
import { useCompanyGeneralForm } from '../hooks';
import { PassiveStatusReasonDialog } from './PassiveStatusReasonDialog';

interface CompanyGeneralTabProps {
  companyData: Company;
}

const CompanyGeneralTab: React.FC<CompanyGeneralTabProps> = ({ companyData }) => {
  const [updateCompany, { isLoading: isUpdating, error, isSuccess }] = useUpdateCompanyMutation();
  const [updateScoreCompany] = useUpdateScoreCompanyByIdentifierMutation();
  const notice = useNotice();
  const [isPassiveReasonDialogOpen, setIsPassiveReasonDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ newStatus: number; previousStatus: number } | null>(
    null,
  );

  const {
    form,
    schema: dynamicSchema,
    hasScoreCompany,
    scoreCompanyId,
    watchStatus,
  } = useCompanyGeneralForm(companyData);

  useErrorListener(error ? [error as Error] : []);

  const { handleSubmit, setValue } = form;

  const onSubmit = async (values: CompanyFormData) => {
    try {
      // Transform data for API
      const updateData = {
        ...values,
        CityId: values.city ? Number(values.city) : undefined,
        DistrictId: values.DistrictId ? Number(values.DistrictId) : undefined,
        PassiveStatusReason: values.PassiveStatusReason || undefined,
      };

      await updateCompany({
        companyId: companyData.Id.toString(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: updateData as any,
      }).unwrap();

      // Update score company sector if applicable
      if (
        hasScoreCompany &&
        scoreCompanyId !== null &&
        values.companySectorId !== null &&
        typeof values.companySectorId !== 'undefined'
      ) {
        await updateScoreCompany({
          CompanyId: scoreCompanyId,
          CompanySectorId: Number(values.companySectorId),
        }).unwrap();
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handlePassiveReasonSubmit = (reasonValue: string) => {
    console.log('handlePassiveReasonSubmit çağrıldı, reasonValue:', reasonValue);
    // Set the passive status reason value in the form
    setValue('PassiveStatusReason', reasonValue);
    setIsPassiveReasonDialogOpen(false);
    setPendingStatusChange(null);

    // Now submit the form with the reason set
    const formValues = form.getValues();
    onSubmit({ ...formValues, PassiveStatusReason: reasonValue });
  };

  // Monitor status changes - open dialog when changing from active to passive
  useEffect(() => {
    // Only open dialog if status changes from 1 to 0 and no reason selected yet
    if (watchStatus === 0 && !isPassiveReasonDialogOpen && !form.getValues('PassiveStatusReason')) {
      setIsPassiveReasonDialogOpen(true);
      setPendingStatusChange({ newStatus: 0, previousStatus: 1 });
    }
  }, [watchStatus, companyData.Status, isPassiveReasonDialogOpen, form]);

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket bilgileri başarıyla güncellendi.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  return (
    <Box>
      {/* Main Form Section */}

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={form} schema={dynamicSchema as any} />

      {/* Action Buttons */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" color="primary" onClick={handleSubmit(onSubmit)}>
              {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Passive Status Reason Dialog */}
      <PassiveStatusReasonDialog
        open={isPassiveReasonDialogOpen}
        onClose={() => {
          setIsPassiveReasonDialogOpen(false);
          setPendingStatusChange(null);
          // Revert status back to active if user cancels
          if (pendingStatusChange?.previousStatus === 1) {
            setValue('Status', 1);
          }
        }}
        onSubmit={handlePassiveReasonSubmit}
      />
    </Box>
  );
};

export default CompanyGeneralTab;
