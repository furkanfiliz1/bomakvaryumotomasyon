import { Form, useNotice } from '@components';
import { useErrorListener } from '@hooks';
import { Box, Button, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { useGetCompanyInfoQuery, useUpdateCompanyDetailMutation } from '../companies.api';
import { CompanyDetailFormData } from '../companies.types';
import { useCompanyDetailForm } from '../hooks/useCompanyDetailForm';

interface CompanyDetailInfoProps {
  companyId: number;
}

const CompanyDetailInfo: React.FC<CompanyDetailInfoProps> = ({ companyId }) => {
  const notice = useNotice();

  const { data: companyDetail, isLoading } = useGetCompanyInfoQuery(
    { companyId },
    {
      // Tab değişiminde fresh data almak için
      refetchOnMountOrArgChange: true,
    },
  );
  const [updateCompanyDetail, { isLoading: isUpdating, error, isSuccess }] = useUpdateCompanyDetailMutation();

  useErrorListener(error ? [error as Error] : []);

  const { form, schema } = useCompanyDetailForm(companyDetail);

  useEffect(() => {
    if (companyDetail) {
      const productTypeValues = companyDetail.ProductTypes?.map((pt) => pt.ProductType) || [];
      form.reset({
        CompanySizeType: companyDetail.CompanySizeType || null,
        FoundationYear: companyDetail.FoundationYear || null,
        ProductTypes: productTypeValues.length > 0 ? productTypeValues : null,
        RevenueType: companyDetail.RevenueType || null,
        IntegratorId: companyDetail.IntegratorId || null,
        CompanyKind: companyDetail.CompanyKind || null,
        AffiliateStructure: companyDetail.AffiliateStructure || null,
        Bail: companyDetail.Bail || null,
        Activity: companyDetail.Activity || null,
      });
    }
  }, [companyDetail, form]);

  const onSubmit = async (values: CompanyDetailFormData) => {
    try {
      const apiData = {
        Id: companyId,
        CompanySizeType: values.CompanySizeType || undefined,
        FoundationYear: values.FoundationYear || undefined,
        // Convert ProductTypes array back to the format expected by the API
        ProductTypes: values.ProductTypes || undefined,
        RevenueType: values.RevenueType || undefined,
        IntegratorId: values.IntegratorId || undefined,
        CompanyKind: values.CompanyKind || undefined,
        AffiliateStructure: values.AffiliateStructure || undefined,
        Bail: values.Bail || undefined,
        Activity: values.Activity || undefined,
        LimitAllocations: companyDetail?.LimitAllocations,
        RequestedLimit: undefined,
      };

      await updateCompanyDetail({
        companyId,
        data: apiData,
      }).unwrap();
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket detay bilgileri başarıyla güncellendi.',
      });
    }
  }, [isSuccess, notice]);

  if (isLoading) {
    return <Typography>Yükleniyor...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Detay Bilgiler
      </Typography>

      <Form form={form} schema={schema} space={2} />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
        <Button type="button" variant="contained" color="primary" onClick={form.handleSubmit(onSubmit)}>
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </Button>
      </Box>
    </Box>
  );
};

export default CompanyDetailInfo;
