import { Form } from '@components';
import { Box } from '@mui/material';
import React, { useEffect } from 'react';
import type { FinancerRatioAFModel } from '../../financial-settings.types';
import { useReceiverFinanceSettingsForm } from '../../hooks/useReceiverFinanceSettingsForm';

interface ReceiverFinanceSettingsProps {
  financerRatioAF: Partial<FinancerRatioAFModel>;
  setFinancerRatioAF: React.Dispatch<React.SetStateAction<Partial<FinancerRatioAFModel>>>;
  currencyAF: number[];
  setCurrencyAF: React.Dispatch<React.SetStateAction<number[]>>;
}

const ReceiverFinanceSettings: React.FC<ReceiverFinanceSettingsProps> = ({
  financerRatioAF,
  setFinancerRatioAF,
  currencyAF,
  setCurrencyAF,
}) => {
  const { form, schema } = useReceiverFinanceSettingsForm({
    initialData: financerRatioAF,
    initialCurrencies: currencyAF,
  });

  // Reset form when financerRatioAF changes (data loaded from API)
  useEffect(() => {
    form.reset({
      Currencies: currencyAF,
      IsAutoReturned: financerRatioAF?.IsAutoReturned || false,
      IsIbanRequired: financerRatioAF?.IsIbanRequired || false,
      IsOnlyBankIbanAccepted: financerRatioAF?.IsOnlyBankIbanAccepted || false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioAF), JSON.stringify(currencyAF)]);

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyAF((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioAF((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioAFModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerRatioAF, setCurrencyAF]);

  return (
    <Box>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={form as any} schema={schema} />
    </Box>
  );
};

export default ReceiverFinanceSettings;
