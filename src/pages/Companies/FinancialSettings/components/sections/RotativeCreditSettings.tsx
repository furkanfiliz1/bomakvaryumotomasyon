import { Form } from '@components';
import { Box } from '@mui/material';
import { ProductTypes } from '@types';
import React, { useEffect, useState } from 'react';
import { INVOICE_TYPE_OPTIONS } from '../../constants/invoice-types.constants';
import type { FinancerRatioInfoDetail, FinancerRatioRCModel } from '../../financial-settings.types';
import { useRotativeCreditCurrencyAndSettingsForm } from '../../hooks/useRotativeCreditCurrencyAndSettingsForm';
import { useRotativeCreditDateSettingsForm } from '../../hooks/useRotativeCreditDateSettingsForm';
import InvoiceTypeSelector from '../InvoiceTypeSelector';
import RatioManagement from '../RatioManagement';

interface RotativeCreditSettingsProps {
  financerRatioRC: Partial<FinancerRatioRCModel>;
  setFinancerRatioRC: React.Dispatch<React.SetStateAction<Partial<FinancerRatioRCModel>>>;
  currencyRC: number[];
  setCurrencyRC: React.Dispatch<React.SetStateAction<number[]>>;
}

const RotativeCreditSettings: React.FC<RotativeCreditSettingsProps> = ({
  financerRatioRC,
  setFinancerRatioRC,
  currencyRC,
  setCurrencyRC,
}) => {
  const { form: dateForm, schema: dateSchema } = useRotativeCreditDateSettingsForm({
    initialData: financerRatioRC,
  });

  const { form: currencyForm, schema: currencySchema } = useRotativeCreditCurrencyAndSettingsForm({
    initialData: financerRatioRC,
    initialCurrencies: currencyRC,
  });

  // Local state for invoice types
  const [selectedInvoiceTypes, setSelectedInvoiceTypes] = useState<number[]>(financerRatioRC.InvoiceTypes || []);

  // Local state for ratios
  const [ratios, setRatios] = useState<FinancerRatioInfoDetail[]>(financerRatioRC.FinancerRatioInfoDetails || []);

  // Reset forms when financerRatioRC changes (data loaded from API)
  useEffect(() => {
    dateForm.reset({
      MinInvoiceDay: financerRatioRC?.MinInvoiceDay || null,
      MaxInvoiceDayForRevolvingCredit: financerRatioRC?.MaxInvoiceDayForRevolvingCredit || null,
      MaxInvoiceDueDayForRevolvingCredit: financerRatioRC?.MaxInvoiceDueDayForRevolvingCredit || null,
    });
    currencyForm.reset({
      Currencies: currencyRC,
      MarginRatio: financerRatioRC?.MarginRatio || null,
      IsAutoReturned: financerRatioRC?.IsAutoReturned || false,
      IsManuelCharged: financerRatioRC?.IsManuelCharged || false,
    });
    setSelectedInvoiceTypes(financerRatioRC.InvoiceTypes || []);
    setRatios(financerRatioRC.FinancerRatioInfoDetails || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioRC), JSON.stringify(currencyRC)]);

  // Sync date form values with parent state
  useEffect(() => {
    const subscription = dateForm.watch((value, { name }) => {
      if (name) {
        setFinancerRatioRC((prev) => ({
          ...prev,
          ...(value as Partial<FinancerRatioRCModel>),
        }));
      }
    });

    return () => subscription.unsubscribe();
  }, [dateForm, setFinancerRatioRC]);

  // Sync currency form values with parent state
  useEffect(() => {
    const subscription = currencyForm.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyRC((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioRC((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioRCModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [currencyForm, setFinancerRatioRC, setCurrencyRC]);

  // Sync invoice types with parent
  useEffect(() => {
    setFinancerRatioRC((prev) => ({
      ...prev,
      InvoiceTypes: selectedInvoiceTypes,
    }));
  }, [selectedInvoiceTypes, setFinancerRatioRC]);

  // Sync ratios with parent
  useEffect(() => {
    setFinancerRatioRC((prev) => ({
      ...prev,
      FinancerRatioInfoDetails: ratios,
    }));
  }, [ratios, setFinancerRatioRC]);

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
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Form form={dateForm as any} schema={dateSchema} />

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
          productType={ProductTypes.ROTATIVE_LOAN}
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

export default RotativeCreditSettings;
