import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import type { FinancerRatioInfoDetail, FinancerRatioSpotWithoutInvoiceModel } from '../../financial-settings.types';
import { useSpotLoanWithoutInvoiceCurrencyAndSettingsForm } from '../../hooks/useSpotLoanWithoutInvoiceCurrencyAndSettingsForm';
import { useSpotLoanWithoutInvoiceSettingsForm } from '../../hooks/useSpotLoanWithoutInvoiceSettingsForm';
import RatioManagement from '../RatioManagement';

interface SpotLoanWithoutInvoiceSettingsProps {
  financerRatioSpotWithoutInvoice: Partial<FinancerRatioSpotWithoutInvoiceModel>;
  setFinancerRatioSpotWithoutInvoice: React.Dispatch<
    React.SetStateAction<Partial<FinancerRatioSpotWithoutInvoiceModel>>
  >;
  currencySpotWithoutInvoice: number[];
  setCurrencySpotWithoutInvoice: React.Dispatch<React.SetStateAction<number[]>>;
}

const SpotLoanWithoutInvoiceSettings: React.FC<SpotLoanWithoutInvoiceSettingsProps> = ({
  financerRatioSpotWithoutInvoice,
  setFinancerRatioSpotWithoutInvoice,
  currencySpotWithoutInvoice,
  setCurrencySpotWithoutInvoice,
}) => {
  const { form: settingsForm, schema: settingsSchema } = useSpotLoanWithoutInvoiceSettingsForm({
    initialData: financerRatioSpotWithoutInvoice,
  });

  const { form: currencyForm, schema: currencySchema } = useSpotLoanWithoutInvoiceCurrencyAndSettingsForm({
    initialData: financerRatioSpotWithoutInvoice,
    initialCurrencies: currencySpotWithoutInvoice,
  });

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(
    financerRatioSpotWithoutInvoice.FinancerRatioInfoDetails || [],
  );

  // Reset forms when financerRatioSpotWithoutInvoice changes (data loaded from API)
  useEffect(() => {
    settingsForm.reset({
      MaxInvoiceDueDayForSpotLoanWithoutInvoice:
        financerRatioSpotWithoutInvoice?.MaxInvoiceDueDayForSpotLoanWithoutInvoice || null,
    });
    currencyForm.reset({
      Currencies: currencySpotWithoutInvoice,
      IsAutoReturned: financerRatioSpotWithoutInvoice?.IsAutoReturned || false,
      IsManuelCharged: financerRatioSpotWithoutInvoice?.IsManuelCharged || false,
    });
    setRatios(financerRatioSpotWithoutInvoice.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioSpotWithoutInvoice), JSON.stringify(currencySpotWithoutInvoice)]);

  // Sync first form values with parent state
  useEffect(() => {
    const subscription = settingsForm.watch((value, { name }) => {
      if (name) {
        setFinancerRatioSpotWithoutInvoice((prev) => ({
          ...prev,
          ...(value as Partial<FinancerRatioSpotWithoutInvoiceModel>),
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [settingsForm, setFinancerRatioSpotWithoutInvoice]);

  // Sync second form values with parent state
  useEffect(() => {
    const subscription = currencyForm.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencySpotWithoutInvoice((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioSpotWithoutInvoice((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioSpotWithoutInvoiceModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currencyForm, setFinancerRatioSpotWithoutInvoice, setCurrencySpotWithoutInvoice]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatioSpotWithoutInvoice((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatioSpotWithoutInvoice]);

  const handleAddRatio = (ratio: Omit<FinancerRatioInfoDetail, 'Id'>) => {
    setRatios((prev) => [...prev, ratio]);
  };

  const handleRemoveRatio = (index: number) => {
    setRatios((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={settingsForm as any} schema={settingsSchema} />

      <Box sx={{ mt: 3 }}>
        <RatioManagement
          ratios={ratios}
          onAdd={handleAddRatio}
          onRemove={handleRemoveRatio}
          productType={ProductTypes.SPOT_LOAN_FINANCING_WITHOUT_INVOICE}
          title="Faturasız Spot Kredi Finansmanı İşlem Oranları"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {/* Second Form: Currency and Settings */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={currencyForm as any} schema={currencySchema} />
      </Box>
    </Box>
  );
};

export default SpotLoanWithoutInvoiceSettings;
