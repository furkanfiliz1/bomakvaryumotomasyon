import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import { INVOICE_TYPE_OPTIONS } from '../../constants/invoice-types.constants';
import type { FinancerRatioInfoDetail, FinancerRatioModel } from '../../financial-settings.types';
import { useCurrencyAndSettingsForm } from '../../hooks/useCurrencyAndSettingsForm';
import { useInvoiceFinanceSettingsForm } from '../../hooks/useInvoiceFinanceSettingsForm';
import InvoiceTypeSelector from '../InvoiceTypeSelector';
import RatioManagement from '../RatioManagement';

interface InvoiceFinanceSettingsProps {
  financerRatio: Partial<FinancerRatioModel>;
  setFinancerRatio: React.Dispatch<React.SetStateAction<Partial<FinancerRatioModel>>>;
  currencyFF: number[];
  setCurrencyFF: React.Dispatch<React.SetStateAction<number[]>>;
}

const InvoiceFinanceSettings: React.FC<InvoiceFinanceSettingsProps> = ({
  financerRatio,
  setFinancerRatio,
  currencyFF,
  setCurrencyFF,
}) => {
  const { form, schema } = useInvoiceFinanceSettingsForm({ initialData: financerRatio });
  const { form: currencyForm, schema: currencySchema } = useCurrencyAndSettingsForm({
    initialData: financerRatio,
    initialCurrencies: currencyFF,
  });

  // Local state for invoice types
  const [selectedInvoiceTypes, setSelectedInvoiceTypes] = useState<number[]>(financerRatio.InvoiceTypes || []);

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(financerRatio.FinancerRatioInfoDetails || []);

  // Reset forms when financerRatio changes (data loaded from API)
  useEffect(() => {
    form.reset({
      MinInvoiceDay: financerRatio?.MinInvoiceDay || 0,
      MaxInvoiceDay: financerRatio?.MaxInvoiceDay || null,
      MaxInvoiceDueDayForEasyFinancing: financerRatio?.MaxInvoiceDueDayForEasyFinancing || null,
      IsWorkingDayRuleApply: financerRatio?.IsWorkingDayRuleApply || false,
    });
    currencyForm.reset({
      Currencies: currencyFF,
      IsAutoReturned: financerRatio?.IsAutoReturned || false,
      IsManuelCharged: financerRatio?.IsManuelCharged || false,
    });
    setSelectedInvoiceTypes(financerRatio.InvoiceTypes || []);
    setRatios(financerRatio.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatio), JSON.stringify(currencyFF)]);

  // Sync first form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      // Only update if a field actually changed
      if (name) {
        setFinancerRatio((prev) => ({
          ...prev,
          ...(value as Partial<FinancerRatioModel>),
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerRatio]);

  // Sync second form values with parent state
  useEffect(() => {
    const subscription = currencyForm.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyFF((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatio((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currencyForm, setFinancerRatio, setCurrencyFF]);

  // Sync invoice types with parent
  useEffect(() => {
    setFinancerRatio((prev) => ({
      ...prev,
      InvoiceTypes: selectedInvoiceTypes,
    }));
  }, [selectedInvoiceTypes, setFinancerRatio]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatio((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatio]);

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
      {/* Form fields */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={form as any} schema={schema} />

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
          productType={ProductTypes.SME_FINANCING}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        {/* Second form: Currency and Settings */}
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={currencyForm as any} schema={currencySchema} />
      </Box>
    </Box>
  );
};

export default InvoiceFinanceSettings;
