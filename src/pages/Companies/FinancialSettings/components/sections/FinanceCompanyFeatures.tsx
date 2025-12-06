import { Form } from '@components';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import { FinancerDetailModel } from '../../financial-settings.types';
import { useFinanceCompanyFeaturesForm } from '../../hooks/useFinanceCompanyFeaturesForm';

interface FinanceCompanyFeaturesProps {
  financerDetail: Partial<FinancerDetailModel>;
  setFinancerDetail: React.Dispatch<React.SetStateAction<Partial<FinancerDetailModel>>>;
}

const FinanceCompanyFeatures: React.FC<FinanceCompanyFeaturesProps> = ({ financerDetail, setFinancerDetail }) => {
  const { form, schema } = useFinanceCompanyFeaturesForm({ initialData: financerDetail });

  // Reset form when financerDetail changes (e.g., when data is loaded)
  useEffect(() => {
    form.reset({
      ProductTypes: financerDetail?.ProductTypes || [],
      IsDirectApprove: financerDetail?.IsDirectApprove || false,
      IsEnableForTFS: financerDetail?.IsEnableForTFS || false,
      IsEnableForKF: financerDetail?.IsEnableForKF || false,
      IsEnableForSpot: financerDetail?.IsEnableForSpot || false,
      IsEnableForSpotWithoutInvoice: financerDetail?.IsEnableForSpotWithoutInvoice || false,
      IsEnableForAF: financerDetail?.IsEnableForAF || false,
      IsEnableForRC: financerDetail?.IsEnableForRC || false,
      IsDigitalApproved: financerDetail?.IsDigitalApproved || false,
      IsManualPaymentApproved: financerDetail?.IsManualPaymentApproved || false,
      IsDigitalConfirmationTextRequired: financerDetail?.IsDigitalConfirmationTextRequired || false,
      IsInvoiceBasedCalculation: financerDetail?.IsInvoiceBasedCalculation || false,
      IsVatRateVisible: financerDetail?.IsVatRateVisible || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerDetail)]);

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only update if a field actually changed
      if (name) {
        // Map form field names to API field names
        const { IsDigitalApprovedw, ...restValues } = value as Record<string, unknown>;

        setFinancerDetail((prev) => ({
          ...prev,
          ...restValues,
          // Map IsDigitalApprovedw to IsDigitalApproved for API
          IsDigitalApproved: IsDigitalApprovedw as boolean,
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerDetail]);

  return (
    <Box>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={form as any} schema={schema} />
    </Box>
  );
};

export default FinanceCompanyFeatures;
