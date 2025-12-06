/**
 * Buyer Limits Table Custom Slots
 * Following OperationPricing table slots pattern exactly
 */

import { useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { FormControl, InputAdornment, Switch, TextField } from '@mui/material';
import React, { useEffect } from 'react';
import { NumericFormat } from 'react-number-format';
import { useUpdateBuyerLimitMutation } from '../company-buyer-limits-tab.api';
import type { BuyerLimitItem } from '../company-buyer-limits-tab.types';
import { useBuyerLimitFormContext } from '../hooks';

interface MaxInvoiceAmountSlotProps {
  item: BuyerLimitItem;
}

/**
 * Custom slot for MaxInvoiceAmount currency input with TL suffix
 * Matches legacy NumericFormat behavior exactly
 */
export const MaxInvoiceAmountSlot: React.FC<MaxInvoiceAmountSlotProps> = ({ item }) => {
  const { getFormData, setFieldValue } = useBuyerLimitFormContext();
  const formData = getFormData(item.Id);

  return (
    <FormControl fullWidth size="small">
      <NumericFormat
        customInput={TextField}
        value={formData?.maxInvoiceAmount || ''}
        thousandSeparator="."
        decimalSeparator=","
        size="small"
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment position="end">TL</InputAdornment>,
        }}
        onValueChange={(values) => {
          setFieldValue(item.Id, 'maxInvoiceAmount', values.value);
        }}
      />
    </FormControl>
  );
};

interface MaxInvoiceDueDaySlotProps {
  item: BuyerLimitItem;
}

/**
 * Custom slot for MaxInvoiceDueDay number input with "Gün" suffix
 * Matches legacy input behavior exactly
 */
export const MaxInvoiceDueDaySlot: React.FC<MaxInvoiceDueDaySlotProps> = ({ item }) => {
  const { getFormData, setFieldValue } = useBuyerLimitFormContext();
  const formData = getFormData(item.Id);

  return (
    <FormControl fullWidth size="small">
      <TextField
        value={formData?.maxInvoiceDueDay || ''}
        type="number"
        size="small"
        variant="outlined"
        InputProps={{
          endAdornment: <InputAdornment position="end">Gün</InputAdornment>,
        }}
        onChange={(e) => {
          setFieldValue(item.Id, 'maxInvoiceDueDay', e.target.value);
        }}
      />
    </FormControl>
  );
};

interface IsActiveSlotProps {
  item: BuyerLimitItem;
}

/**
 * Custom slot for IsActive switch
 * Matches legacy react-switch behavior exactly
 */
export const IsActiveSlot: React.FC<IsActiveSlotProps> = ({ item }) => {
  const { getFormData, setFieldValue } = useBuyerLimitFormContext();
  const formData = getFormData(item.Id);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(item.Id, 'isActive', event.target.checked);
  };

  return <Switch checked={formData?.isActive || false} onChange={handleSwitchChange} size="small" />;
};

interface ActionsSlotProps {
  item: BuyerLimitItem;
}

/**
 * Custom slot for Update button actions
 * Matches legacy ButtonUpdate behavior exactly
 */
export const ActionsSlot: React.FC<ActionsSlotProps> = ({ item }) => {
  const [updateBuyerLimit, { isLoading, error: updateError, isSuccess }] = useUpdateBuyerLimitMutation();
  const { getFormData } = useBuyerLimitFormContext();
  const notice = useNotice();

  // Error handling
  useErrorListener(updateError);

  // Success handling - matches OperationPricing pattern exactly
  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Alıcı bazlı skor güncelleme başarılı.',
        buttonTitle: 'Tamam',
      });
    }
  }, [isSuccess, notice]);

  const formData = getFormData(item.Id);

  const handleUpdate = () => {
    if (!formData) return;

    // Transform and call API
    updateBuyerLimit({
      companyLimitId: item.CompanyLimitId,
      buyerId: item.Id,
      data: {
        Id: item.Id,
        CompanyLimitId: item.CompanyLimitId,
        ReceiverIdentifier: item.ReceiverIdentifier,
        MaxInvoiceAmount: Number.parseFloat(formData.maxInvoiceAmount) || 0,
        MaxInvoiceDueDay: Number.parseInt(formData.maxInvoiceDueDay, 10) || 0,
        IsActive: formData.isActive,
        InvoiceScore: item.InvoiceScore,
      },
    });
  };

  return (
    <LoadingButton variant="contained" size="small" onClick={handleUpdate} loading={isLoading}>
      Güncelle
    </LoadingButton>
  );
};
