import { Form, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, Paper, Typography } from '@mui/material';
import yup from '@validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetCompanyLimitationQuery, useUpdateCompanyLimitationMutation } from '../companies.api';

interface CompanyLimitSettingsProps {
  companyId: number;
  companyData: {
    CompanyName: string;
    Identifier: string;
  };
}

interface LimitSettingsData {
  Id?: number;
  InvoiceAmount?: number | null;
  Day?: number | null;
  InvoiceCount?: number | null;
}

// Create Yup schema for form validation
const limitSettingsSchema = yup.object({
  InvoiceAmount: fields.currency
    .required('Fatura tutarı zorunludur')
    .min(0, 'Fatura tutarı 0 veya pozitif bir değer olmalıdır')
    .label('Fatura Tutarı')
    .meta({ currency: 'TRY', col: 12, mb: 2 }),

  Day: fields.number
    .required('Gün zorunludur')
    .min(0, 'Gün 0 veya pozitif bir değer olmalıdır')
    .integer('Gün tam sayı olmalıdır')
    .label('Gün')
    .meta({ col: 12, mb: 2 }),

  InvoiceCount: fields.number
    .required('Fatura adedi zorunludur')
    .min(0, 'Fatura adedi 0 veya pozitif bir değer olmalıdır')
    .integer('Fatura adedi tam sayı olmalıdır')
    .label('Fatura Adedi')
    .meta({ col: 12, mb: 2 }),
}) as yup.ObjectSchema<Omit<LimitSettingsData, 'Id'>>;

const CompanyLimitSettings: React.FC<CompanyLimitSettingsProps> = ({ companyId }) => {
  const notice = useNotice();

  // RTK Query hooks
  const { data: limitationData, isLoading: isLoadingLimitation } = useGetCompanyLimitationQuery({ companyId });

  const [updateCompanyLimitation, { isLoading: isUpdatingLimitation }] = useUpdateCompanyLimitationMutation();

  // Set up React Hook Form
  const form = useForm<Omit<LimitSettingsData, 'Id'>>({
    resolver: yupResolver(limitSettingsSchema),
    defaultValues: {
      InvoiceAmount: null,
      Day: null,
      InvoiceCount: null,
    },
  });

  // Initialize form when API data changes
  useEffect(() => {
    if (limitationData) {
      form.reset({
        InvoiceAmount: limitationData.InvoiceAmount || 0,
        Day: limitationData.Day || 0,
        InvoiceCount: limitationData.InvoiceCount || 0,
      });
    }
  }, [limitationData, form]);

  const loading = isLoadingLimitation || isUpdatingLimitation;

  const handleSaveLimitations = async (formData: Omit<LimitSettingsData, 'Id'>) => {
    if (!limitationData?.Id) {
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'Limit bilgileri yüklenemedi. Lütfen sayfayı yenileyin.',
      });
      return;
    }

    try {
      await updateCompanyLimitation({
        companyId,
        data: {
          Id: limitationData.Id,
          InvoiceAmount: formData.InvoiceAmount || 0,
          InvoiceCount: formData.InvoiceCount || 0,
          Day: formData.Day || 0,
        },
      }).unwrap();

      // Show success notification
      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Limitler başarıyla güncellendi.',
      });
    } catch (error) {
      console.error('Limitler güncellenirken hata oluştu', error);
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'Limitler güncellenirken hata oluştu. Lütfen tekrar deneyin.',
      });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Genel Fatura Limit Ayarları
      </Typography>

      <Paper>
        <Form form={form} schema={limitSettingsSchema}>
          {/* Action Button */}
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" onClick={form.handleSubmit(handleSaveLimitations)} disabled={loading}>
              {loading ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  );
};

export default CompanyLimitSettings;
