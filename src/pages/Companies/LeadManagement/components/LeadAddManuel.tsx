/**
 * Lead Add Manuel Component
 * Form for manually adding a new lead
 * Fields: VKN, Ünvan, Ad, Soyad, Cep Telefonu, Ürün (multi-select)
 * Following OperationPricing pattern with dynamic product types from API
 */

import { Form } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useGetProductTypesQuery } from 'src/api/figoParaApi';
import { useLeadAddManuelSchema } from '../hooks/useLeadAddManuelForm';
import { useCreateLeadMutation } from '../lead-management.api';
import { LeadAddManuelFormData } from '../lead-management.types';

const LeadAddManuel: React.FC = () => {
  const navigate = useNavigate();
  const [createLead, { isLoading }] = useCreateLeadMutation();

  // Fetch product types from API
  const { data: productTypesData, isLoading: isLoadingProductTypes } = useGetProductTypesQuery();
  const productTypeList = productTypesData || [];

  const schema = useLeadAddManuelSchema(productTypeList);

  const form = useForm<LeadAddManuelFormData>({
    defaultValues: {
      taxNumber: '',
      title: '',
      firstName: '',
      lastName: '',
      phone: '',
      products: [],
    },
    // @ts-expect-error - Yup schema type inference mismatch with form data
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const handleSubmit = async (data: unknown) => {
    const formData = data as LeadAddManuelFormData;
    try {
      await createLead({ data: formData }).unwrap();
      // Show success message (will be added with notification system)
      navigate('/companies/leads');
    } catch (error) {
      // Show error message (will be added with notification system)
      console.error('Lead oluşturma hatası:', error);
    }
  };

  const handleCancel = () => {
    navigate('/companies/leads');
  };

  // Show loading state while fetching product types
  if (isLoadingProductTypes) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Box>Yükleniyor...</Box>
      </Box>
    );
  }

  return (
    <Box>
      {/* @ts-expect-error - Type mismatch between Yup schema inference and form data */}
      <Form form={form} schema={schema} onSubmit={form.handleSubmit(handleSubmit)} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button variant="outlined" onClick={handleCancel} disabled={isLoading}>
          İptal
        </Button>
        <Button variant="contained" onClick={form.handleSubmit(handleSubmit)} disabled={isLoading}>
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </Box>
    </Box>
  );
};

export { LeadAddManuel };
