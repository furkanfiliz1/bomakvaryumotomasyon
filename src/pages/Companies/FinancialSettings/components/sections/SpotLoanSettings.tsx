import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import { INVOICE_TYPE_OPTIONS } from '../../constants/invoice-types.constants';
import type { FinancerRatioInfoDetail, FinancerRatioSpotModel } from '../../financial-settings.types';
import { useSpotLoanCurrencyAndSettingsForm } from '../../hooks/useSpotLoanCurrencyAndSettingsForm';
import { useSpotLoanSettingsForm } from '../../hooks/useSpotLoanSettingsForm';
import InvoiceTypeSelector from '../InvoiceTypeSelector';
import RatioManagement from '../RatioManagement';

interface SpotLoanSettingsProps {
  financerRatioSpot: Partial<FinancerRatioSpotModel>;
  setFinancerRatioSpot: React.Dispatch<React.SetStateAction<Partial<FinancerRatioSpotModel>>>;
  currencySpot: number[];
  setCurrencySpot: React.Dispatch<React.SetStateAction<number[]>>;
}

const SpotLoanSettings: React.FC<SpotLoanSettingsProps> = ({
  financerRatioSpot,
  setFinancerRatioSpot,
  currencySpot,
  setCurrencySpot,
}) => {
  const { form: settingsForm, schema: settingsSchema } = useSpotLoanSettingsForm({
    initialData: financerRatioSpot,
  });

  const { form: currencyForm, schema: currencySchema } = useSpotLoanCurrencyAndSettingsForm({
    initialData: financerRatioSpot,
    initialCurrencies: currencySpot,
  });

  // Local state for invoice types
  const [selectedInvoiceTypes, setSelectedInvoiceTypes] = useState<number[]>(financerRatioSpot.InvoiceTypes || []);

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(financerRatioSpot.FinancerRatioInfoDetails || []);

  // Reset forms when financerRatioSpot changes (data loaded from API)
  useEffect(() => {
    settingsForm.reset({
      MinInvoiceDay: financerRatioSpot?.MinInvoiceDay || null,
      MaxInvoiceDayForSpotLoan: financerRatioSpot?.MaxInvoiceDayForSpotLoan || null,
      MaxInvoiceDueDayForSpotLoan: financerRatioSpot?.MaxInvoiceDueDayForSpotLoan || null,
    });
    currencyForm.reset({
      Currencies: currencySpot,
      MarginRatio: financerRatioSpot?.MarginRatio || null,
      IsAutoReturned: financerRatioSpot?.IsAutoReturned || false,
      IsManuelCharged: financerRatioSpot?.IsManuelCharged || false,
    });
    setSelectedInvoiceTypes(financerRatioSpot.InvoiceTypes || []);
    setRatios(financerRatioSpot.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioSpot), JSON.stringify(currencySpot)]);

  // Sync first form values with parent state
  useEffect(() => {
    const subscription = settingsForm.watch((value, { name }) => {
      if (name) {
        setFinancerRatioSpot((prev) => ({
          ...prev,
          ...(value as Partial<FinancerRatioSpotModel>),
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [settingsForm, setFinancerRatioSpot]);

  // Sync second form values with parent state
  useEffect(() => {
    const subscription = currencyForm.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencySpot((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioSpot((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioSpotModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currencyForm, setFinancerRatioSpot, setCurrencySpot]);

  // Sync invoice types with parent
  useEffect(() => {
    setFinancerRatioSpot((prev) => ({
      ...prev,
      InvoiceTypes: selectedInvoiceTypes,
    }));
  }, [selectedInvoiceTypes, setFinancerRatioSpot]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatioSpot((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatioSpot]);

  const handleInvoiceTypeChange = (typeId: number, checked: boolean) => {
    setSelectedInvoiceTypes((prev) => {
      if (checked) {
        return [...prev, typeId];
      } else {
        return prev.filter((id) => id !== typeId);
      }
    });
  };

  const handleAddRatio = (ratio: Omit<FinancerRatioInfoDetail, 'Id'>) => {
    setRatios((prev) => [...prev, ratio]);
  };

  const handleRemoveRatio = (index: number) => {
    setRatios((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* First Form: Date Settings */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={settingsForm as any} schema={settingsSchema} />

      <Box sx={{ mt: 3 }}>
        <InvoiceTypeSelector
          options={INVOICE_TYPE_OPTIONS}
          selectedTypes={selectedInvoiceTypes}
          onChange={handleInvoiceTypeChange}
          label="İşlem Yapılacak Fatura Tipleri"
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <RatioManagement
          ratios={ratios}
          onAdd={handleAddRatio}
          onRemove={handleRemoveRatio}
          productType={ProductTypes.SPOT_LOAN_FINANCING_WITH_INVOICE}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {/* Second Form: Currency, Margin, and Settings */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={currencyForm as any} schema={currencySchema} />
      </Box>
    </Box>
  );
};

export default SpotLoanSettings;
