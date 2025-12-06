import { Form, fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import yup from '@validation';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useGetCalledStatusDataQuery,
  useGetCallerDataQuery,
  useGetCustomerAcquisitionDetailQuery,
  useGetLeadStatusDataQuery,
  useGetReferralChannelDataQuery,
  useGetWhereHearDataQuery,
  useLazyGetSubChannelDataQuery,
  usePutCustomerAcquisitionDetailMutation,
} from '../companies.api';

interface CompanyCustomerAcquisitionProps {
  companyId: number;
}

interface CustomerAcquisitionData {
  caller?: string | number | undefined;
  calledStatus?: string | number | undefined;
  leadStatus?: string | number | undefined;
  referralChannel?: string | number | undefined;
  subChannel?: string | number | undefined;
  campaignName: string;
  whereHear?: string | number | undefined;
}

const CompanyCustomerAcquisition: React.FC<CompanyCustomerAcquisitionProps> = ({ companyId }) => {
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // API Queries
  const { data: customerAcquisitionData, refetch: refetchCustomerAcquisition } =
    useGetCustomerAcquisitionDetailQuery(companyId);

  const { data: callerData = [] } = useGetCallerDataQuery();
  const { data: calledStatusData = [] } = useGetCalledStatusDataQuery();
  const { data: leadStatusData = [] } = useGetLeadStatusDataQuery();
  const { data: referralChannelData = [] } = useGetReferralChannelDataQuery();
  const { data: whereHearData = [] } = useGetWhereHearDataQuery();

  const [getSubChannelData, { data: subChannelData = [] }] = useLazyGetSubChannelDataQuery();
  const [putCustomerAcquisitionDetail, { isLoading: isUpdating }] = usePutCustomerAcquisitionDetailMutation();

  // Initial values
  const initialValues: CustomerAcquisitionData = {
    caller: undefined,
    calledStatus: undefined,
    leadStatus: undefined,
    referralChannel: undefined,
    subChannel: undefined,
    campaignName: '',
    whereHear: undefined,
  };

  // Form schema
  const schema = useMemo(() => {
    return yup.object({
      caller: fields
        .select(
          callerData.map((item) => ({ Value: item.Id, Description: item.Name })),
          'string',
          ['Value', 'Description'],
        )
        .label('Arayan Kişi')
        .meta({ col: 6 }),
      calledStatus: fields
        .select(
          calledStatusData.map((item) => ({ Value: item.Value, Description: item.Description })),
          'string',
          ['Value', 'Description'],
        )
        .label('Arama Durumu')
        .meta({ col: 6 }),
      leadStatus: fields
        .select(
          leadStatusData.map((item) => ({ Value: item.Value, Description: item.Description })),
          'string',
          ['Value', 'Description'],
        )
        .label('Lead Statü')
        .meta({ col: 6 }),
      referralChannel: fields
        .select(
          referralChannelData.map((item) => ({ Value: item.Id, Description: item.Name })),
          'string',
          ['Value', 'Description'],
        )
        .label('Yönlendirme Kanalı')
        .meta({ col: 6 }),
      subChannel: fields
        .select(
          subChannelData.map((item) => ({ Value: item.Id, Description: item.Name })),
          'string',
          ['Value', 'Description'],
        )
        .label('Alt Kanal')
        .meta({ col: 6, visible: subChannelData.length > 0 }),
      campaignName: fields.text.label('Kampanya Adı').meta({ col: 6 }),
      whereHear: fields
        .select(
          whereHearData.map((item) => ({ Value: item.Value, Description: item.Description })),
          'string',
          ['Value', 'Description'],
        )
        .label('Bizi Nereden Duydunuz ?')
        .meta({ col: 6 }),
    });
  }, [callerData, calledStatusData, leadStatusData, referralChannelData, subChannelData, whereHearData]);

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema),
  });

  const watchReferralChannel = form.watch('referralChannel');

  // Load initial data
  useEffect(() => {
    if (customerAcquisitionData) {
      form.setValue('caller', customerAcquisitionData.TrackingTeamId?.toString() || '');
      form.setValue('calledStatus', customerAcquisitionData.CallResultType?.toString() || '');
      form.setValue('leadStatus', customerAcquisitionData.LeadStatusType?.toString() || '');
      form.setValue('referralChannel', customerAcquisitionData.ApplicationChannelId?.toString() || '');
      form.setValue('subChannel', customerAcquisitionData.ApplicationSubChannelId?.toString() || '');
      form.setValue('campaignName', customerAcquisitionData.CampaignName || '');
      form.setValue('whereHear', customerAcquisitionData.CustomerSourceType?.toString() || '');

      // Load sub channel data if referral channel exists
      if (customerAcquisitionData.ApplicationChannelId) {
        getSubChannelData(customerAcquisitionData.ApplicationChannelId);
      }
    }
  }, [customerAcquisitionData, form, getSubChannelData]);

  // Handle referral channel change
  useEffect(() => {
    if (watchReferralChannel && watchReferralChannel !== '') {
      getSubChannelData(Number(watchReferralChannel));
    }
  }, [watchReferralChannel, form, getSubChannelData]);

  const onSubmit = async (values: CustomerAcquisitionData) => {
    try {
      const requestData = {
        id: companyId,
        Id: companyId.toString(),
        TrackingTeamId: values.caller ? Number(values.caller) : undefined,
        CallResultType: values.calledStatus ? Number(values.calledStatus) : undefined,
        LeadStatusType: values.leadStatus ? Number(values.leadStatus) : undefined,
        CustomerSourceType: values.whereHear ? Number(values.whereHear) : undefined,
        ApplicationChannelId: values.referralChannel ? Number(values.referralChannel) : undefined,
        ApplicationSubChannelId: values.subChannel ? Number(values.subChannel) : undefined,
        CampaignName: values.campaignName || '',
      };

      await putCustomerAcquisitionDetail(requestData).unwrap();
      await refetchCustomerAcquisition();
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Müşteri Kazanım Bilgileri
      </Typography>

      {updateSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Müşteri kazanım bilgileri başarıyla güncellendi.
        </Alert>
      )}

      <Form form={form} schema={schema}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" disabled={isUpdating} onClick={form.handleSubmit(onSubmit)}>
            {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
          </Button>
        </Stack>
      </Form>
    </Box>
  );
};

export default CompanyCustomerAcquisition;
