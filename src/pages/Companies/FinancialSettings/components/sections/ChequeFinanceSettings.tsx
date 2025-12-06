import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import type { FinancerRatioInfoDetail, FinancerRatioModel } from '../../financial-settings.types';
import { useChequeFinanceSettingsForm } from '../../hooks/useChequeFinanceSettingsForm';
import RatioManagement from '../RatioManagement';

interface ChequeFinanceSettingsProps {
  financerRatio: Partial<FinancerRatioModel>;
  setFinancerRatio: React.Dispatch<React.SetStateAction<Partial<FinancerRatioModel>>>;
  currencyBill: number[];
  setCurrencyBill: React.Dispatch<React.SetStateAction<number[]>>;
}

const ChequeFinanceSettings: React.FC<ChequeFinanceSettingsProps> = ({
  financerRatio,
  setFinancerRatio,
  currencyBill,
  setCurrencyBill,
}) => {
  const { form, schema } = useChequeFinanceSettingsForm({
    initialData: financerRatio,
    initialCurrencies: currencyBill,
  });

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(financerRatio.FinancerRatioInfoDetails || []);

  // Reset form when financerRatio changes (data loaded from API)
  useEffect(() => {
    form.reset({
      Currencies: currencyBill,
      IsAutoReturnedBill: financerRatio?.IsAutoReturnedBill || false,
      IsManuelChargedBill: financerRatio?.IsManuelChargedBill || false,
      IsMultipleBill: financerRatio?.IsMultipleBill || false,
    });
    setRatios(financerRatio.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatio), JSON.stringify(currencyBill)]);

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyBill((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatio((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerRatio, setCurrencyBill]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatio((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatio]);

  const handleAddRatio = (ratio: Omit<FinancerRatioInfoDetail, 'Id'>) => {
    setRatios((prev) => [...prev, ratio]);
  };

  const handleRemoveRatio = (index: number) => {
    setRatios((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Box>
        <RatioManagement
          ratios={ratios}
          onAdd={handleAddRatio}
          onRemove={handleRemoveRatio}
          productType={ProductTypes.CHEQUES_FINANCING}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {/* Form: Currency and Settings */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form as any} schema={schema} />
      </Box>
    </Box>
  );
};

export default ChequeFinanceSettings;
