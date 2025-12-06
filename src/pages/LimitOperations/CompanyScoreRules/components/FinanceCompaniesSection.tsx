// Finance Companies Section Component - Following OperationPricing UI patterns exactly

import { LoadingButton } from '@mui/lab';
import { Alert, Box, Card, CardContent, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';
import React from 'react';
import type { CompanyScoreRule, FinanceCompany, ProductType } from '../company-score-rules.types';
import { getFinanceCompaniesAlertMessage, getNoRuleMessage } from '../helpers';

interface FinanceCompaniesSectionProps {
  financeList: FinanceCompany[];
  onFinanceListChange: (updatedList: FinanceCompany[]) => void;
  onSave: () => void;
  isLoading: boolean;
  productType: ProductType;
  currentRule: CompanyScoreRule | null;
}

/**
 * Finance Companies Section Component
 * Matches legacy finance companies rendering exactly with checkboxes
 */
export const FinanceCompaniesSection: React.FC<FinanceCompaniesSectionProps> = ({
  financeList,
  onFinanceListChange,
  onSave,
  isLoading,
  productType,
  currentRule,
}) => {
  const alertMessage = getFinanceCompaniesAlertMessage(productType);

  const handleFinanceChange = (financeId: number, checked: boolean) => {
    const updatedList = financeList.map((finance) =>
      finance.Id === financeId ? { ...finance, selected: checked } : finance,
    );
    onFinanceListChange(updatedList);
  };

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Finans Şirketleri
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {alertMessage}
          </Typography>
        </Box>

        <Grid container spacing={1}>
          {financeList.map((finance) => (
            <Grid item xs={12} sm={6} md={4} key={finance.Id}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={finance.selected || false}
                    onChange={(e) => handleFinanceChange(finance.Id, e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                    {finance.CompanyName}
                  </Typography>
                }
                sx={{
                  width: '100%',
                  m: 0,
                  p: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                  '& .MuiFormControlLabel-label': {
                    flex: 1,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 3 }}>
          {currentRule?.Id ? (
            <LoadingButton loading={isLoading} variant="contained" onClick={onSave}>
              Finans Şirketlerini Güncelle
            </LoadingButton>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              {getNoRuleMessage()}
            </Alert>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
