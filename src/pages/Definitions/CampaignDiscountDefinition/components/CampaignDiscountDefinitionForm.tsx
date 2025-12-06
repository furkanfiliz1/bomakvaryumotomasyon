/**
 * Campaign Discount Definition Create Form Component
 * Matches legacy CampaignDiscountDef.js renderPost() section exactly
 */

import { Form, LoadingButton, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Add } from '@mui/icons-material';
import { Box, Card, Stack, Typography } from '@mui/material';
import React from 'react';
import { useCreateCampaignDiscountMutation } from '../campaign-discount-definition.api';
import { DEFAULT_CAMPAIGN_TYPE } from '../helpers';
import { useCampaignDiscountDefinitionForm } from '../hooks';

interface CampaignDiscountDefinitionFormProps {
  onSuccess: () => void;
}

export const CampaignDiscountDefinitionForm: React.FC<CampaignDiscountDefinitionFormProps> = ({ onSuccess }) => {
  const notice = useNotice();
  const { form, schema, resetForm } = useCampaignDiscountDefinitionForm();

  const [createCampaignDiscount, { isLoading: isCreating, error: createError }] = useCreateCampaignDiscountMutation();

  // Handle errors with useErrorListener
  useErrorListener(createError);

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (!isValid) return;

    const formData = form.getValues();

    // Validate required fields (matching legacy validation)
    if (!formData.Month || !formData.Year || !formData.Ratio) {
      notice({
        variant: 'error',
        title: 'Uyarı',
        message: 'Ay, Yıl ve İndirim Oranı alanları zorunludur',
      });
      return;
    }

    try {
      await createCampaignDiscount({
        Month: String(formData.Month),
        Year: String(formData.Year),
        Ratio: parseFloat(String(formData.Ratio)),
        campaignType: DEFAULT_CAMPAIGN_TYPE,
      }).unwrap();

      notice({
        variant: 'success',
        message: 'Kampanya indirimi başarıyla oluşturuldu',
      });
      resetForm();
      onSuccess();
    } catch {
      // Error handled by useErrorListener
    }
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ py: 1, fontWeight: 'bold' }}>
        Kampanya İndirim Tanımlama
      </Typography>
      <Card sx={{ mb: 2, p: 2 }}>
        <Box>
          <Form form={form} schema={schema} childCol={2}>
            <Stack direction="row" justifyContent="flex-start" sx={{ mt: 3 }}>
              <LoadingButton
                id="create-campaign-discount-btn"
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                loading={isCreating}
                startIcon={<Add />}>
                Oluştur
              </LoadingButton>
            </Stack>
          </Form>
        </Box>
      </Card>
    </Box>
  );
};

export default CampaignDiscountDefinitionForm;
