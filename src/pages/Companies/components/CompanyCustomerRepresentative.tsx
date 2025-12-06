import { useGetCustomerManagerListQuery } from '@api';
import { fields, Form, LoadingButton, Slot, Table, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Add as AddIcon, Clear } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Chip, Grid, Typography } from '@mui/material';
import yup from '@validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import type { HeadCell } from 'src/components/common/Table/types';
import {
  useGetBuyerCompaniesQuery,
  useGetCompanyCustomerManagersForCompaniesQuery,
  useGetFinancierCompaniesQuery,
  useGetProductTypesQuery,
  useUpdateCompanyCustomerManagersMutation,
} from '../companies.api';

interface CompanyCustomerRepresentativeProps {
  companyId: number;
  companyIdentifier: string;
}

interface CustomerManagerFormData {
  ManagerUserId: number | null;
  ProductType: string | null;
  StartDate: string;
  FinancerCompanyId?: number | null;
  BuyerCompanyId?: number | null;
}

interface AssignedManager {
  Id: number;
  ManagerName: string;
  ProductTypeDescription: string;
  FinancerCompanyName?: string;
  BuyerCompanyName?: string;
  StartDate: string;
}

const CompanyCustomerRepresentative: React.FC<CompanyCustomerRepresentativeProps> = ({
  companyIdentifier,
  companyId,
}) => {
  // Data queries
  const { data: customerManagerList } = useGetCustomerManagerListQuery();
  const { data: productTypes = [] } = useGetProductTypesQuery();
  const { data: financierCompaniesData } = useGetFinancierCompaniesQuery();
  const { data: buyerCompaniesData } = useGetBuyerCompaniesQuery();

  // Fetch assigned managers for the company
  const { data: assignedManagersData, refetch: refetchAssignedManagers } =
    useGetCompanyCustomerManagersForCompaniesQuery({
      companyIdentifier,
      isManagerAssigned: true,
    });

  // Mutation for updating customer managers
  const [updateCustomerManagers, { isLoading: isUpdating, isSuccess, error }] =
    useUpdateCompanyCustomerManagersMutation();
  useErrorListener(error);
  const assignedManagers = assignedManagersData?.CompanyList || [];
  const notice = useNotice();

  // Transform data for select options with memoization
  const managerOptions = React.useMemo(
    () =>
      customerManagerList?.Items?.map((manager) => ({
        label: manager.FullName,
        value: manager.Id,
      })) || [],
    [customerManagerList?.Items],
  );

  const productTypeOptions = React.useMemo(
    () =>
      productTypes?.map((type) => ({
        label: type.Description,
        value: type.Value,
      })) || [],
    [productTypes],
  );

  const buyerCompanyOptions = React.useMemo(
    () =>
      buyerCompaniesData?.map((company) => ({
        label: company.CompanyName,
        value: company.Id,
      })) || [],
    [buyerCompaniesData],
  );

  const financerCompanyOptions = React.useMemo(
    () =>
      financierCompaniesData?.Items?.map((company) => ({
        label: company.CompanyName,
        value: company.Id,
      })) || [],
    [financierCompaniesData?.Items],
  );

  // Create schema function to handle dynamic disabled state
  const createSchema = React.useCallback(
    (isFinancerDisabled: boolean = true, isBuyerDisabled: boolean = true) =>
      yup.object().shape({
        ManagerUserId: fields
          .select(managerOptions, 'number', ['value', 'label'])
          .required('Müşteri temsilcisi seçimi zorunludur')
          .label('Müşteri Temsilcisi')
          .meta({ col: 3 })
          .nullable(),
        ProductType: fields
          .select(productTypeOptions, 'string', ['value', 'label'])
          .required('Ürün tipi seçimi zorunludur')
          .label('Ürün Tipi')
          .meta({ col: 3 })
          .nullable(),
        StartDate: fields.date.required('Başlangıç tarihi zorunludur').label('Başlangıç Tarihi').meta({ col: 3 }),
        FinancerCompanyId: fields
          .select(financerCompanyOptions, 'number', ['value', 'label'])
          .nullable()
          .label('Finansör Şirket')
          .meta({ col: 3, disabled: isFinancerDisabled }),
        BuyerCompanyId: fields
          .select(buyerCompanyOptions, 'number', ['value', 'label'])
          .nullable()
          .label('Alıcı')
          .meta({ col: 3, disabled: isBuyerDisabled }),
      }) as yup.ObjectSchema<CustomerManagerFormData>,
    [managerOptions, productTypeOptions, financerCompanyOptions, buyerCompanyOptions],
  );

  // Initial schema
  const [schema, setSchema] = React.useState(() => createSchema(true, true));

  const form = useForm<CustomerManagerFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      ManagerUserId: null,
      ProductType: null,
      StartDate: new Date().toISOString().split('T')[0],
      FinancerCompanyId: null,
      BuyerCompanyId: null,
    },
  });

  // Watch ProductType for conditional field logic
  const watchProductType = form.watch('ProductType');

  // Update schema and field behavior based on ProductType
  React.useEffect(() => {
    const isFinancerDisabled = watchProductType !== '3';
    const isBuyerDisabled = watchProductType !== '2';
    setSchema(createSchema(isFinancerDisabled, isBuyerDisabled));

    if (isFinancerDisabled) {
      form.setValue('FinancerCompanyId', null);
    }
    if (isBuyerDisabled) {
      form.setValue('BuyerCompanyId', null);
    }
  }, [watchProductType, form, createSchema]);

  const onSubmit = async (data: CustomerManagerFormData) => {
    // Validate: If ProductType is "3" (Fatura Finansmanı), FinancerCompanyId must be selected
    if (data.ProductType === '3' && !data.FinancerCompanyId) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Fatura Finansmanı ürünü seçildiğinde finansör seçimi zorunludur.',
        buttonTitle: 'Tamam',
      });
      return;
    }

    // Get company name from assigned managers data or use companyIdentifier as fallback
    const companyName = assignedManagersData?.CompanyList?.[0]?.CompanyName || companyIdentifier;

    const requestData = {
      CompanyCustomerManagers: [
        {
          Id: 0, // For new assignment
          CompanyName: companyName,
          CompanyIdentifier: companyIdentifier,
          StartDate: data.StartDate,
          ManagerUserId: data.ManagerUserId?.toString() || '',
          CompanyId: companyId,
          ProductType: data.ProductType || '',
          ...(data.FinancerCompanyId && { FinancerCompanyId: data.FinancerCompanyId }),
          ...(data.BuyerCompanyId && { BuyerCompanyId: data.BuyerCompanyId }),
        },
      ],
    };

    updateCustomerManagers(requestData).unwrap();
  };

  useEffect(() => {
    if (isSuccess) {
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Müşteri temsilcisi başarıyla atandı.',
        buttonTitle: 'Tamam',
      });

      refetchAssignedManagers();
      form.reset();
    }
  }, [form, isSuccess, notice, refetchAssignedManagers]);

  // Table configuration for customer representatives
  const tableHeaders: HeadCell[] = [
    {
      id: 'ManagerName',
      label: 'Temsilci',
    },
    {
      id: 'ProductTypeDescription',
      label: 'Ürün',
      slot: true,
    },
    {
      id: 'FinancerCompanyName',
      label: 'Finansör Şirket',
    },
    {
      id: 'BuyerCompanyName',
      label: 'Alıcı',
    },
    {
      id: 'StartDate',
      label: 'Tarih',
      type: 'date',
    },
  ];

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Müşteri Temsilcisi
      </Typography>

      <Grid container spacing={2}>
        {/* Yeni Atama Formu */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                <AddIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Yeni Temsilci Ata
              </Typography>

              <Form form={form} schema={schema} onSubmit={form.handleSubmit(onSubmit)}>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button type="button" variant="outlined" onClick={() => form.reset()} startIcon={<Clear />}>
                      Temizle
                    </Button>
                    <LoadingButton
                      id="submit-button"
                      type="submit"
                      variant="contained"
                      startIcon={<AddIcon />}
                      color="primary"
                      loading={isUpdating}
                      disabled={isUpdating}>
                      Ekle
                    </LoadingButton>
                  </Box>
                </Grid>
              </Form>
            </CardContent>
          </Card>
        </Grid>

        {/* Atanmış Temsilciler */}
        <Grid item xs={12} md={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" color="primary" gutterBottom>
                Atanmış Temsilciler ({assignedManagers.length})
              </Typography>

              <Table
                id="company-customer-representatives-table"
                rowId="Id"
                data={assignedManagers}
                headers={tableHeaders}
                loading={false}
                size="small"
                hidePaging={true}>
                {/* Custom slot for Product Type with Chip */}
                <Slot<AssignedManager> id="ProductTypeDescription">
                  {(_, row) => <Chip label={row?.ProductTypeDescription} size="small" color="primary" />}
                </Slot>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyCustomerRepresentative;
