// Company Score Rules Tab Component - Following OperationPricing main component pattern exactly

import { useErrorListener } from '@hooks';
import { Alert, Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { ProductTypesList, type CompanyScoreRulesProps, type ProductType } from '../company-score-rules.types';
import { useCompanyScoreRulesData, useCompanyScoreRulesForm } from '../hooks';
import { FinanceCompaniesSection, ProductTypeTabs, RulesSection } from './index';

/**
 * Company Score Rules Tab Component
 * Main component matching legacy ScoreCompanyRules functionality exactly
 */
export const CompanyScoreRulesTab: React.FC<CompanyScoreRulesProps> = ({ companyId }) => {
  const [selectedProductType, setSelectedProductType] = useState<ProductType>(ProductTypesList.SME_FINANCING);
  const [screenWidth, setScreenWidth] = useState<number>(window.innerWidth);

  // Data fetching
  const { currentRule, displayRule, financeList, setFinanceList, isLoading, error, refetchRules } =
    useCompanyScoreRulesData({
      companyId,
      selectedProductType,
    });

  // Form management
  const {
    form,
    handleSaveRules,
    handleSaveFinanceCompanies,
    updateRuleField,
    isLoading: isFormLoading,
  } = useCompanyScoreRulesForm({
    companyId,
    currentRule,
    displayRule,
    financeList,
    onRuleSaved: () => {
      refetchRules();
    },
  });

  // Window resize handler (matches legacy)
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Error handling
  useErrorListener(error);

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error && !isLoading) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Veriler yüklenirken bir hata oluştu
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Product Type Selection */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: screenWidth >= 1094 ? 3 : 2.5,
              flexWrap: 'wrap',
            }}>
            <Typography variant="body1">Kural Seti Tanımlanacak Ürün</Typography>
            <ProductTypeTabs
              selectedProductType={selectedProductType}
              onProductTypeChange={setSelectedProductType}
              screenWidth={screenWidth}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Rules Configuration */}
      <Box sx={{ mb: 3 }}>
        <RulesSection
          form={form}
          productType={selectedProductType}
          onSave={handleSaveRules}
          isLoading={isFormLoading}
          updateRuleField={updateRuleField}
        />
      </Box>

      {/* Finance Companies */}
      <FinanceCompaniesSection
        financeList={financeList}
        onFinanceListChange={setFinanceList}
        onSave={handleSaveFinanceCompanies}
        isLoading={isFormLoading}
        productType={selectedProductType}
        currentRule={currentRule}
      />
    </Box>
  );
};
