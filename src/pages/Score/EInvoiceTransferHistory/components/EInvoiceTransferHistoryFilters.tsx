/**
 * E-Invoice Transfer History Filters Component
 * Following OperationPricing filters component pattern
 * Based on legacy EInvoiceTransferHistory.js filter section
 * Now using proper Form system from @components
 */

import { Form } from '@components';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

interface FormData {
  number: string;
}

interface EInvoiceTransferHistoryFiltersProps {
  form: UseFormReturn<FormData>;
  schema: yup.AnyObjectSchema;
  onSubmit: () => void;
  onReset: () => void;
  onTransfer: () => void;
  isLoading?: boolean;
  hasInvoiceList?: boolean;
}

/**
 * E-Invoice Transfer History Filters Component
 * Following OperationPricing filters pattern exactly
 * Now includes two buttons: Apply (Uygula) and Transfer (Aktar/Tekrar Aktar)
 */
export const EInvoiceTransferHistoryFilters: React.FC<EInvoiceTransferHistoryFiltersProps> = ({
  form,
  schema,
  onSubmit,
  onTransfer,
  isLoading = false,
  hasInvoiceList = false,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, color: 'text.secondary', fontWeight: 'light' }}>
          E-Fatura Transfer İşlemleri
        </Typography>

        {/* Form using proper Form system */}
        <Box sx={{ mb: 3 }}>
          <Form form={form} schema={schema} />
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onSubmit} disabled={isLoading} size="small">
            Uygula
          </Button>

          <Button variant="contained" color="warning" onClick={onTransfer} disabled={isLoading} size="small">
            {hasInvoiceList ? 'Tekrar Aktar' : 'Aktar'}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};
