import { Form } from '@components';
import { Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { INVOICE_TYPE_OPTIONS_TFS } from '../../constants/invoice-types.constants';
import type { FinancerRatioTFSModel } from '../../financial-settings.types';
import { useSupplierFinanceSettingsForm } from '../../hooks/useSupplierFinanceSettingsForm';
import InvoiceTypeSelector from '../InvoiceTypeSelector';

interface SupplierFinanceSettingsProps {
  financerRatioTFS: Partial<FinancerRatioTFSModel>;
  setFinancerRatioTFS: React.Dispatch<React.SetStateAction<Partial<FinancerRatioTFSModel>>>;
  currencyTFS: number[];
  setCurrencyTFS: React.Dispatch<React.SetStateAction<number[]>>;
}

const SupplierFinanceSettings: React.FC<SupplierFinanceSettingsProps> = ({
  financerRatioTFS,
  setFinancerRatioTFS,
  currencyTFS,
  setCurrencyTFS,
}) => {
  const { form, schema } = useSupplierFinanceSettingsForm({
    initialData: financerRatioTFS,
    initialCurrencies: currencyTFS,
  });

  // Local state for invoice types
  const [selectedInvoiceTypes, setSelectedInvoiceTypes] = useState<number[]>(financerRatioTFS.InvoiceTypes || []);

  // Reset form when financerRatioTFS changes (data loaded from API)
  useEffect(() => {
    form.reset({
      Currencies: currencyTFS,
      IsAutoReturned: financerRatioTFS?.IsAutoReturned || false,
      IsIbanRequired: financerRatioTFS?.IsIbanRequired || false,
      IsOnlyBankIbanAccepted: financerRatioTFS?.IsOnlyBankIbanAccepted || false,
    });
    setSelectedInvoiceTypes(financerRatioTFS.InvoiceTypes || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(financerRatioTFS), JSON.stringify(currencyTFS)]);

  // Sync form values with parent state
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name) {
        if (name === 'Currencies') {
          setCurrencyTFS((value.Currencies || []).filter((v): v is number => v !== undefined));
        } else {
          setFinancerRatioTFS((prev) => ({
            ...prev,
            ...(value as Partial<FinancerRatioTFSModel>),
          }));
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form, setFinancerRatioTFS, setCurrencyTFS]);

  // Sync invoice types with parent
  useEffect(() => {
    setFinancerRatioTFS((prev) => ({
      ...prev,
      InvoiceTypes: selectedInvoiceTypes,
    }));
  }, [selectedInvoiceTypes, setFinancerRatioTFS]);

  const handleInvoiceTypeChange = (typeId: number, checked: boolean) => {
    setSelectedInvoiceTypes((prev) => {
      if (checked) {
        return [...prev, typeId];
      } else {
        return prev.filter((id) => id !== typeId);
      }
    });
  };

  return (
    <Box>
      <Box>
        <InvoiceTypeSelector
          options={INVOICE_TYPE_OPTIONS_TFS}
          selectedTypes={selectedInvoiceTypes}
          onChange={handleInvoiceTypeChange}
          label="İşlem Yapılacak Fatura Tipleri"
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

export default SupplierFinanceSettings;
