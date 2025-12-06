import { Box, Card, Grid, Tab, Tabs, Typography, styled } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import dayjs from 'dayjs';

import { Form, LoadingButton, fields, useNotice } from '@components';
import { RESPONSE_DATE } from '@constant';
import { useErrorListener } from '@hooks';
import { InvoiceTypes, ProfileIdEnum } from '@types';
import yup from '@validation';
// import { pushEvent } from '@push-event';

import { useCreateInvoiceMutation } from '../invoice-add.api';
import { CreateInvoiceFormData, CreateInvoiceRequest, CreateInvoiceResponse } from '../invoice-add.types';

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  m: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const InvoiceAddManuel = () => {
  const notice = useNotice();
  const [createInvoice, { isSuccess, error, data, isLoading }] = useCreateInvoiceMutation();
  const currencyList = [{ Code: 'TRY' }, { Code: 'USD' }, { Code: 'EUR' }]; // TODO: Add currency API call

  useErrorListener(error);

  const NOT_ALLOWED_CHARACTERS = /^[A-Za-z0-9 ]+$/;

  const [activeTabIndex, setActiveTabIndex] = useState(InvoiceTypes.EFATURA);

  const navigate = useCallback((path: string) => console.log('Navigate to:', path), []); // TODO: Add proper navigation

  const today = dayjs().format(RESPONSE_DATE);
  const tomorrow = dayjs().add(1, 'days').format(RESPONSE_DATE);

  const initialValues: CreateInvoiceFormData = {
    hashCode: '',
    invoiceNumber: '',
    issueDate: today.toString(),
    payableAmount: undefined,
    paymentDueDate: tomorrow.toString(),
    receiverIdentifier: '',
    receiverName: '',
    remainingAmount: 0,
    senderIdentifier: '',
    senderName: '',
    sequenceNumber: '',
    serialNumber: '',
    taxFreeAmount: 0,
    payableAmountCurrency: 'TRY',
    uuId: '',
    invoiceTypeCode: 'SATIS',
    approvedPayableAmount: 0,
    profileId: ProfileIdEnum.TEMELFATURA,
  };

  const profileIdList = [
    {
      Id: ProfileIdEnum.TEMELFATURA,
      Name: 'Temel Fatura',
    },
    {
      Id: ProfileIdEnum.TICARIFATURA,
      Name: 'Ticari Fatura',
    },
    {
      Id: ProfileIdEnum.EARSIVFATURA,
      Name: 'E-Arşiv Fatura',
    },
    {
      Id: ProfileIdEnum.EMUSTAHSIL,
      Name: 'E-Müstahsil Makbuzu',
    },
  ];

  const schema = (value?: string, formData?: CreateInvoiceFormData) =>
    yup.object({
      ...getFormSchema(value || '', formData),
    });

  const getFormSchema = (value: string, formData?: CreateInvoiceFormData): yup.AnyObject => {
    const today = new Date();
    switch (value) {
      case 'buyerInfoSide':
        return {
          receiverName: fields.text.label('Alıcı Ünvan'),
          receiverIdentifier: fields.number.label('Alıcı VKN'),
        };
      case 'senderInfoSide':
        return {
          senderName: fields.text.label('Satıcı Ünvan'),
          senderIdentifier: fields.text.label('Satıcı VKN').meta({ maxLength: 11 }),
        };
      case 'dateInfoSide':
        return {
          issueDate: fields.date.label('Fatura Kesim Tarihi').meta({ col: 4, maxDate: today }),
          paymentDueDate: fields.date.label('Fatura Vade Tarihi').required().meta({ col: 4, minDate: today }),
          issueTimex: fields.number.label('Vade Günü').meta({ col: 4 }),
        };
      case 'amountInfoSide':
        return {
          payableAmountCurrency: fields
            .select(currencyList || [], 'string', ['Code', 'Code'])
            .label('Dokuman Para Birimi')
            .meta({ col: 4 }),
          payableAmount: fields.currency
            .label('Tutar Bilgisi')
            .meta({ col: 4, currency: formData?.payableAmountCurrency }),
          remainingAmount: fields.currency
            .label('Kalan Tutar Bilgisi')
            .meta({ col: 4, currency: formData?.payableAmountCurrency }),
        };
      case 'profileId':
        return {
          profileId: fields.select(profileIdList || [], 'string', ['Id', 'Name']).label('Fatura Tipi'),
        };
      case 'eInvoiceInfoSide':
        return {
          uuId: fields.text.label('e-Fatura UUID').meta({ col: 4 }),
          hashCode: fields.text.label('E-Fatura Hash').meta({ col: 4 }),
          invoiceNumber: fields.text.label('E-Fatura Numarası').meta({ col: 4, maxLength: 16, trim: true }),
        };
      case 'paperInfoSide':
        return {
          serialNumber: fields.text.label('Seri Numarası').meta({ col: 6, trim: true }),
          sequenceNumber: fields.text.label('Sıra Numarası').meta({ col: 6, trim: true }),
        };
      case 'eArchiveInfoSide':
        return {
          invoiceNumber: fields.text.label('E-Fatura Numarası').meta({ col: 6, maxLength: 16, trim: true }),
          taxFreeAmount: fields.currency.label('Vergisiz Tutar').meta({ col: 6 }),
        };
      case 'eProducerInfoSide':
        return {
          invoiceNumber: fields.text.label('E-Fatura Numarası').meta({ col: 6, maxLength: 16, trim: true }),
        };

      default: {
        // Base validation schema for all required fields
        const returnObject = {
          issueDate: fields.text.required('Bu alan zorunludur').meta({ visible: false }),
          payableAmount: fields.text.required('Bu alan zorunludur').meta({ visible: false }),
          remainingAmount: fields.text.required('Bu alan zorunludur').meta({ visible: false }),
          senderIdentifier: fields.text
            .required('Bu alan zorunludur')
            .min(10, 'Minimum 10 karakter olmalıdır')
            .meta({ visible: false }),
          serialNumber: fields.text
            .required('Bu alan zorunludur')
            .meta({ visible: false })
            .matches(NOT_ALLOWED_CHARACTERS, 'Özel karakterler kullanılamaz'),
          sequenceNumber: fields.text
            .required('Bu alan zorunludur')
            .meta({ visible: false })
            .matches(NOT_ALLOWED_CHARACTERS, 'Özel karakterler kullanılamaz'),
          hashCode: fields.text.required('Bu alan zorunludur').label('E-Fatura Hash').meta({ visible: false }),
          invoiceNumber: fields.text
            .required('Bu alan zorunludur')
            .label('E-Fatura Numarası')
            .min(16, 'Minimum 16 karakter olmalıdır')
            .meta({ visible: false }),
        };

        return returnObject;
      }
    }
  };

  const form = useForm({
    defaultValues: initialValues,
    resolver: yupResolver(schema()),
    mode: 'onChange',
  });

  const onTabChange = (_: React.SyntheticEvent, index: number) => {
    setActiveTabIndex(index + 1);
    form.clearErrors(['serialNumber', 'sequenceNumber', 'hashCode', 'invoiceNumber']);
  };

  const formValidationRule = () => {
    const generalControl = ['senderIdentifier', 'payableAmount', 'remainingAmount', 'paymentDueDate', 'issueDate'];

    switch (activeTabIndex) {
      case InvoiceTypes.EFATURA:
        switch (profileId) {
          case ProfileIdEnum.TEMELFATURA:
            return [...generalControl, 'hashCode', 'invoiceNumber'];
          case ProfileIdEnum.TICARIFATURA:
            return [...generalControl, 'hashCode', 'invoiceNumber'];
          case ProfileIdEnum.EMUSTAHSIL:
            return [...generalControl, 'invoiceNumber'];
          case ProfileIdEnum.EARSIVFATURA:
            return [...generalControl, 'invoiceNumber'];
          default:
            break;
        }
        break;

      default:
        return [...generalControl, 'sequenceNumber', 'serialNumber'];
    }
  };

  const onSubmit = () => {
    const { issueDate, paymentDueDate, invoiceNumber, hashCode, profileId } = form.getValues();

    const data: CreateInvoiceFormData = {
      ...form.getValues(),
      issueDate: dayjs(issueDate).format(RESPONSE_DATE),
      paymentDueDate: dayjs(paymentDueDate).format(RESPONSE_DATE),
      type: activeTabIndex === InvoiceTypes.KAGITFATURA ? 2 : 1,
      invoiceNumber: activeTabIndex === InvoiceTypes.KAGITFATURA ? '' : invoiceNumber,
      hashCode: activeTabIndex === InvoiceTypes.KAGITFATURA ? '' : hashCode,
    };

    if (activeTabIndex === InvoiceTypes.EFATURA) {
      data.eInvoiceType = profileId === ProfileIdEnum.EARSIVFATURA ? 2 : profileId === ProfileIdEnum.EMUSTAHSIL ? 3 : 1;
    }

    if (activeTabIndex === InvoiceTypes.KAGITFATURA) {
      delete data.profileId;
    }

    if (data.remainingAmount === 0) {
      data.approvedPayableAmount = data?.payableAmount || undefined;
    } else {
      if (data?.remainingAmount) data.approvedPayableAmount = data?.remainingAmount || undefined;
    }

    createInvoice([data as CreateInvoiceRequest]);
  };

  useEffect(() => {
    if (isSuccess) {
      // pushEvent('Buyer Invoice Addition Completed', {
      //   Adding_Method: 'Manuel',
      //   number_of_invoices: 1,
      //   Currency: 'TRY',
      // });
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Fatura Başarıyla Eklendi',
        buttonTitle: 'Devam Et',
        onClick: () => {
          navigate('/invoices/detail/' + (data as CreateInvoiceResponse)?.invoiceId);
        },
      });
    }
  }, [form, isSuccess, data, navigate, notice]);

  const issueTimex = form.watch('issueTimex');
  const issueDate = form.watch('issueDate');
  const paymentDueDate = form.watch('paymentDueDate');
  const profileId = form.watch('profileId');

  // Date calculation effects
  useEffect(() => {
    if (issueTimex) {
      const issueDate = form.getValues().issueDate;
      const maturityDays = parseInt(issueTimex.toString());
      const paymentDueDateAddOnTop = dayjs(issueDate).add(maturityDays, 'day').format(RESPONSE_DATE);
      form.setValue('paymentDueDate', paymentDueDateAddOnTop, { shouldValidate: true });
    }
  }, [form, issueTimex]);

  useEffect(() => {
    const issueDateValue = dayjs(issueDate);
    const paymentDueDateValue = dayjs(paymentDueDate);
    if (paymentDueDateValue.year() > 2000 && issueDateValue.year() > 2000) {
      const dayDifference = paymentDueDateValue.diff(issueDateValue, 'day');
      form.setValue('issueTimex', dayDifference, { shouldValidate: false, shouldTouch: false });
    }
  }, [form, issueDate, paymentDueDate]);

  return (
    <Grid container spacing={2}>
      <Grid item lg={6}>
        <StyledCard>
          <CardTitle>
            <Typography variant="h5">Alıcı Bilgileri</Typography>
          </CardTitle>
          <Form form={form} schema={schema('buyerInfoSide', form.watch())} />
        </StyledCard>
      </Grid>
      <Grid item lg={6}>
        <StyledCard>
          <CardTitle>
            <Typography variant="h5">Satıcı Bilgileri</Typography>
          </CardTitle>
          <Form form={form} schema={schema('senderInfoSide', form.watch())} />
        </StyledCard>
      </Grid>
      <Grid item lg={6}>
        <StyledCard>
          <CardTitle>
            <Typography variant="h5">Fatura Tarihi</Typography>
          </CardTitle>
          <Form form={form} schema={schema('dateInfoSide', form.watch())} />
        </StyledCard>
      </Grid>
      <Grid item lg={6}>
        <StyledCard>
          <CardTitle>
            <Typography variant="h5">Tutar Bilgisi</Typography>
          </CardTitle>
          <Form form={form} schema={schema('amountInfoSide', form.watch())} />
        </StyledCard>
      </Grid>
      <Grid item lg={12}>
        <StyledCard>
          <CardTitle>
            <Typography component="div" variant="h5">
              Fatura Tipi
            </Typography>
            <Tabs value={activeTabIndex - 1} onChange={onTabChange} aria-label="invoice tabs">
              <Tab id="EFATURA" label="E-Fatura" />
              <Tab id="KAGITFATURA" label="Kağıt Fatura" />
            </Tabs>
          </CardTitle>
          {activeTabIndex === InvoiceTypes.EFATURA && (
            <>
              <Grid container spacing={2}>
                <Grid item lg={3}>
                  <Form form={form} schema={schema('profileId', form.watch())} />
                </Grid>
                <Grid item lg={9}>
                  {(profileId === ProfileIdEnum.TEMELFATURA || profileId === ProfileIdEnum.TICARIFATURA) && (
                    <Form form={form} schema={schema('eInvoiceInfoSide', form.watch())} />
                  )}
                  {profileId === ProfileIdEnum.EARSIVFATURA && (
                    <Form form={form} schema={schema('eArchiveInfoSide', form.watch())} />
                  )}
                  {profileId === ProfileIdEnum.EMUSTAHSIL && (
                    <Form form={form} schema={schema('eProducerInfoSide', form.watch())} />
                  )}
                </Grid>
              </Grid>
            </>
          )}
          {activeTabIndex === InvoiceTypes.KAGITFATURA && (
            <Form form={form} schema={schema('paperInfoSide', form.watch())} />
          )}
        </StyledCard>
      </Grid>
      <Grid item lg={12}>
        <Box display="flex" justifyContent="center" sx={{ marginBlock: 2 }}>
          <Form form={form} schema={schema('all', form.watch())} id="hidden-form" />
          <LoadingButton
            onClick={async () => {
              const generalRequiredKontrol = await form.trigger(formValidationRule());
              if (generalRequiredKontrol) onSubmit();
            }}
            id="INVOICE_ADD"
            variant="contained"
            loading={isLoading}
            size="large"
            type="submit">
            Fatura Ekle
          </LoadingButton>
        </Box>
      </Grid>
    </Grid>
  );
};

export default InvoiceAddManuel;
