import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import type { FinancerRatioInfoDetail, FinancerRatioTTKModel } from '../../financial-settings.types';
import { useCommercialLoanSettingsForm } from '../../hooks/useCommercialLoanSettingsForm';
import RatioManagement from '../RatioManagement';

interface CommercialLoanSettingsProps {
  financerRatioTTK: Partial<FinancerRatioTTKModel>;
  setFinancerRatioTTK: React.Dispatch<React.SetStateAction<Partial<FinancerRatioTTKModel>>>;
  currencyTTK: number[];
  setCurrencyTTK: React.Dispatch<React.SetStateAction<number[]>>;
}

const CommercialLoanSettings: React.FC<CommercialLoanSettingsProps> = ({
  financerRatioTTK,
  setFinancerRatioTTK,
  currencyTTK,
  setCurrencyTTK,
}) => {
  const { form, schema } = useCommercialLoanSettingsForm({
    initialData: financerRatioTTK,
    initialCurrencies: currencyTTK,
  });

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(financerRatioTTK.FinancerRatioInfoDetails || []);

  // Reset form when financerRatioTTK changes (data loaded from API)
  useEffect(() => {
    form.reset({
      Currencies: currencyTTK,
      IsAutoReturned: financerRatioTTK?.IsAutoReturned || false,
      IsManuelCharged: financerRatioTTK?.IsManuelCharged || false,
    });
    setRatios(financerRatioTTK.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioTTK), JSON.stringify(currencyTTK)]);

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyTTK((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioTTK((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioTTKModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerRatioTTK, setCurrencyTTK]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatioTTK((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatioTTK]);

  const handleAddRatio = (ratio: Omit<FinancerRatioInfoDetail, 'Id'>) => {
    setRatios((prev) => [...prev, ratio]);
  };

  const handleRemoveRatio = (index: number) => {
    setRatios((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <RatioManagement
          ratios={ratios}
          onAdd={handleAddRatio}
          onRemove={handleRemoveRatio}
          productType={ProductTypes.COMMERCIAL_LOAN}
          title="Taksitli Ticari Kredi Finansmanı İşlem Oranları"
        />
      </Box>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={form as any} schema={schema} />
    </Box>
  );
};

export default CommercialLoanSettings;
