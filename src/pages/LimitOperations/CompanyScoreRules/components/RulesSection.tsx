// Rules Section Component - Following OperationPricing UI patterns exactly

import { LoadingButton } from '@mui/lab';
import { Box, Card, CardContent, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { CompanyScoreRulesFormData, ProductType } from '../company-score-rules.types';
import { isPartialAllowanceVisible } from '../helpers';

interface RulesSectionProps {
  form: UseFormReturn<CompanyScoreRulesFormData>;
  productType: ProductType;
  onSave: () => void;
  isLoading: boolean;
  updateRuleField: (field: keyof CompanyScoreRulesFormData, value: boolean | number) => void;
}

/**
 * Rules Section Component
 * Matches legacy rules rendering exactly with radio buttons for each rule
 */
export const RulesSection: React.FC<RulesSectionProps> = ({
  form,
  productType,
  onSave,
  isLoading,
  updateRuleField,
}) => {
  const formValues = form.watch();
  const showPartialAllowance = isPartialAllowanceVisible(productType);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Kural Setleri
          </Typography>
        </Box>

        {/* Partial Allowance Rule - Hidden for Spot Loan Without Invoice */}
        {showPartialAllowance && (
          <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Kısmi İskonto Talebi
              </Typography>
              <RadioGroup
                row
                value={formValues.PartialAllowance}
                onChange={(e) => updateRuleField('PartialAllowance', Number.parseInt(e.target.value))}>
                <FormControlLabel
                  value={1}
                  control={<Radio />}
                  label="Açık"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
                <FormControlLabel
                  value={0}
                  control={<Radio />}
                  label="Kapalı"
                  sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
                />
              </RadioGroup>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Açık olduğu durumda ilgili VKN&apos;ye sahip firma, alıcısı olduğunuz bir faturaya ait İskonto Talebi
              oluştururken, kısmi iskonto talebinde bulunabilir.
            </Typography>
          </Card>
        )}

        {/* Sender Cancel Rule */}
        <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              İptal Talebi
            </Typography>
            <RadioGroup
              row
              value={formValues.SenderCancel}
              onChange={(e) => updateRuleField('SenderCancel', Number.parseInt(e.target.value))}>
              <FormControlLabel
                value={1}
                control={<Radio />}
                label="Açık"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel
                value={0}
                control={<Radio />}
                label="Kapalı"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </RadioGroup>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Açık olduğu durumda Satıcı İskonto talebini teklif sürecinde iptal edebilir.
          </Typography>
        </Card>

        {/* Bid Viewable Rule */}
        <Card variant="outlined" sx={{ mb: 3, p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Teklif Detaylarını Görüntüleme
            </Typography>
            <RadioGroup
              row
              value={formValues.IsBidViewable}
              onChange={(e) => updateRuleField('IsBidViewable', e.target.value === 'true')}>
              <FormControlLabel
                value={true}
                control={<Radio />}
                label="Açık"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
              <FormControlLabel
                value={false}
                control={<Radio />}
                label="Kapalı"
                sx={{ '& .MuiFormControlLabel-label': { fontSize: '0.875rem' } }}
              />
            </RadioGroup>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Açık olduğu durumda satıcı gelen tekliflerde faiz oranı ve tutarı görebilir.
          </Typography>
        </Card>

        {/* Save Button */}
        <LoadingButton loading={isLoading} variant="contained" onClick={onSave} sx={{ mt: 2 }}>
          Kuralı Güncelle
        </LoadingButton>
      </CardContent>
    </Card>
  );
};
