import { Form, PageHeader, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Add, Delete as DeleteIcon, Save } from '@mui/icons-material';
import { Box, Button, Card, Grid, IconButton, Paper, Stack, Typography } from '@mui/material';
import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createLimitsToPassiveFormSchema,
  limitsToPassiveFormDefaults,
} from '../../helpers/limits-to-passive-form.schema';
import { useLimitsToPassiveDropdownData } from '../../hooks';
import { useSetLimitsToPassiveMutation } from '../../other-operations.api';
import type { LimitsToPassiveFormData } from '../../other-operations.types';

/**
 * Limits to Passive Page Component
 * Using Form component with direct VKN/TCKN input like legacy
 */
const LimitsToPassivePage: React.FC = () => {
  const notice = useNotice();

  // Get dropdown data for financers and product types
  const { productTypeOptions, financerOptions } = useLimitsToPassiveDropdownData();

  // Create form schema with dropdown data
  const schema = useMemo(
    () => createLimitsToPassiveFormSchema(productTypeOptions, financerOptions),
    [productTypeOptions, financerOptions],
  );

  // Form management
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: limitsToPassiveFormDefaults,
  });

  // State for identifier list and errors
  const [identifierList, setIdentifierList] = useState<string[]>([]);
  const [errorList, setErrorList] = useState<string[]>([]);

  // API mutation
  const [setLimitsToPassive, { isLoading: submitLoading, error }] = useSetLimitsToPassiveMutation();

  // Error handling
  useErrorListener(error);

  // Add identifier from direct input (like legacy - supports space separated values)
  const handleAddIdentifiers = () => {
    const inputValue = form.getValues('companyIdentifier');
    if (!inputValue?.trim()) return;

    const identifiersList = [...identifierList];
    const newIdentifiers = inputValue.trim().split(' ');

    newIdentifiers.forEach((identifier) => {
      // Check if 10 or 11 digits (like legacy)
      if (identifier.length === 10 || identifier.length === 11) {
        const reg = new RegExp('^[0-9]+$');
        const isNumeric = reg.test(identifier);

        // If numeric and not already in list, add it
        if (isNumeric && !identifiersList.includes(identifier)) {
          identifiersList.push(identifier);
        }
      }
    });

    // Clear the input
    form.setValue('companyIdentifier', '');
    setIdentifierList(identifiersList);
  };

  // Remove identifier from list
  const removeIdentifier = (identifier: string) => {
    setIdentifierList((prev) => prev.filter((item) => item !== identifier));
    setErrorList((prev) => prev.filter((item) => item !== identifier));
  };

  // Submit batch operation (form is only used for adding to list)
  const handleSubmit = async (data: LimitsToPassiveFormData) => {
    // Only validate identifiers list - form fields are not required for submission
    if (identifierList.length === 0) {
      notice({
        variant: 'warning',
        title: 'Uyarı',
        message: 'En az bir geçerli şirket kimlik numarası girmelisiniz',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      const response = await setLimitsToPassive({
        Identifiers: identifierList,
        FinancerCompanyId: data.FinancerCompanyId!,
        ProductType: data.ProductType!,
      }).unwrap();

      if (response.IsSuccess) {
        // Success notification (matching legacy SweetAlert)
        notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Şirketlerin Limitleri başarıyla pasife alındı.',
          buttonTitle: 'Tamam',
        });

        // Reset form (matching legacy reset)
        form.reset(limitsToPassiveFormDefaults);
        setIdentifierList([]);
        setErrorList([]);
      } else {
        // Handle partial failure - some identifiers failed
        const failedIdentifiers = response.Identifiers || [];
        setErrorList(failedIdentifiers);

        if (failedIdentifiers.length > 0) {
          const successCount = identifierList.length - failedIdentifiers.length;

          if (successCount > 0) {
            // Partial success - some succeeded, some failed
            notice({
              variant: 'warning',
              title: 'Kısmi Başarı',
              message: `${successCount} şirketin limitleri başarıyla pasife alındı. ${failedIdentifiers.length} şirket için işlem başarısız oldu. Başarısız olanlar kırmızı renkle işaretlenmiştir.`,
              buttonTitle: 'Tamam',
            });
          } else {
            // Complete failure - all identifiers failed
            notice({
              variant: 'error',
              title: 'İşlem Başarısız',
              message: `Hiçbir şirketin limitleri pasife alınamadı. Lütfen şirket kimlik numaralarını kontrol edin ve tekrar deneyin.`,
              buttonTitle: 'Tamam',
            });
          }
        } else {
          // Generic failure case
          notice({
            variant: 'error',
            title: 'İşlem Başarısız',
            message: 'Limitleri pasife alma işlemi başarısız oldu. Lütfen tekrar deneyin.',
            buttonTitle: 'Tamam',
          });
        }
      }
    } catch (error) {
      console.error('Error setting limits to passive:', error);
    }
  };

  // Button disabled state - requires identifiers, financer and product selection
  const isSubmitDisabled =
    identifierList.length === 0 || !form.watch('FinancerCompanyId') || !form.watch('ProductType') || submitLoading;

  return (
    <>
      <PageHeader title="Limitleri Pasife Al" subtitle="Limitleri topluca vkn ile pasife alabilirsiniz" />

      <Box mx={2}>
        <Card sx={{ p: 2 }}>
          {/* Form with schema-driven fields */}
          <Box sx={{ mb: 4 }}>
            <Form form={form} schema={schema} onSubmit={form.handleSubmit(handleSubmit)}>
              {/* Custom add button for identifiers - as child of Form */}
              <Stack justifyContent="flex-end" direction="row" sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  sx={{ mt: 4 }}
                  color="primary"
                  onClick={handleAddIdentifiers}
                  disabled={!form.watch('companyIdentifier')?.trim()}
                  startIcon={<Add />}>
                  Ekle
                </Button>
              </Stack>
            </Form>
          </Box>

          {/* Identifier List Display (matching legacy styling) */}
          <Box>
            {identifierList.length === 0 ? (
              <Paper sx={{ p: 3, bgcolor: 'grey.50', textAlign: 'center' }}>
                <Typography color="text.secondary">
                  Şirket vknlerini toplu olarak ekleyerek burada listeyebilirsiniz.
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={2}>
                {identifierList.map((identifier) => (
                  <Grid item xs={12} sm={6} key={identifier}>
                    <Paper
                      sx={{
                        p: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        bgcolor: errorList.includes(identifier)
                          ? 'error.light'
                          : errorList.length > 0
                            ? 'success.light'
                            : 'background.paper',
                        borderColor: errorList.includes(identifier)
                          ? 'error.main'
                          : errorList.length > 0
                            ? 'success.main'
                            : 'divider',
                        borderWidth: 1,
                        borderStyle: 'solid',
                      }}>
                      <Typography variant="body1">{identifier}</Typography>
                      <IconButton size="small" onClick={() => removeIdentifier(identifier)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
            {/* Submit button - moved below the cards */}
            {identifierList.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => handleSubmit(form.getValues())}
                  disabled={isSubmitDisabled}
                  startIcon={<Save />}
                  sx={{ py: 1.5 }}>
                  {submitLoading ? 'İşleniyor...' : 'Toplu Olarak Limitleri Pasife Al'}
                </Button>
              </Box>
            )}
          </Stack>
        </Card>
      </Box>
    </>
  );
};

export default LimitsToPassivePage;
