import { Alert, Card, styled, useTheme, Link, Typography } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import yup from '@validation';
import { yupResolver } from '@hookform/resolvers/yup';
import { fields, Form, LoadingButton } from '@components';
import { FieldValues, useForm } from 'react-hook-form';

const DesignGuideForm = () => {
  const theme = useTheme();

  const FormBoxTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
    fontWeight: 600,
  }));

  const FormCard = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const methodTypes = [
    { title: 'Radio Input 1', value: 1 },
    { title: 'Radio Input 1', value: 2 },
  ];

  const selectList = [
    {
      name: 'Item 1',
      id: 1,
    },
    {
      name: 'Item 2',
      id: 2,
    },
    {
      name: 'Item 3',
      id: 3,
    },
  ];

  const schema = yup.object({
    textField: fields.text.label('Metin').required('Zorunlu alan'),
    numberField: fields.number
      .label('Numara')
      .required('Zorunlu alan')
      .label('Yıl')
      .validYear('Geçerli bir yıl giriniz')
      .nullable(),
    phone: fields.phone.label('Telefon').required('Zorunlu alan').validPhone('Geçerli bir telefon numarası giriniz'),
    tarih: fields.date.label('Tarih'),
    currency: fields.currency.required('Zorunlu alan').label('Para Birimi TRY'),
    currencyUSD: fields.currency.required('Zorunlu alan').label('Para Birimi USD').meta({ currency: 'USD' }),
    currencyEUR: fields.currency.required('Zorunlu alan').label('Para Birimi EUR').meta({ currency: 'EUR' }),
    currencyGPR: fields.currency.required('Zorunlu alan').label('Para Birimi GPR').meta({ currency: 'GPR' }),
    html: fields.customComponent(() => (
      <Typography sx={{ backgroundColor: '#eee', p: 1, borderRadius: 2 }} variant="body2">
        Form içinde custom alan
      </Typography>
    )),
    select: fields
      .select(selectList || [], 'number', ['id', 'name'])
      .label('Select')
      .required('Zorunlu alan'),
    iban: fields.iban.required('Zorunlu alan').transform((value) => value.replace(/\s/g, '')),
    checkbox: fields.checkbox.required('Zorunlu alan').label('Checkbox'),
    MethodTypeSwitch: fields
      .switchButtons(methodTypes || [], 'number', ['value', 'title'])
      .label(' ')
      .nullable()
      .meta({ col: 6 }),
  });

  const form = useForm({
    defaultValues: {},
    resolver: yupResolver(schema),
  });

  const onSubmit = (values: FieldValues) => {
    console.log('value', values);
  };

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Form" muiLink="https://mui.com/material-ui/react-modal/" />
      <Alert sx={{ mb: 2 }} variant="filled" color="info">
        Form Validasyonları için <Link href="https://www.react-hook-form.com/">React Hook Form</Link> kullanılmaktadır.
      </Alert>
      <FormCard>
        <Form form={form} schema={schema} />
        <LoadingButton
          id="submit"
          onClick={form.handleSubmit(onSubmit)}
          sx={{ mt: 1 }}
          color="primary"
          variant="contained">
          Gönder
        </LoadingButton>
      </FormCard>
      <FormCard>
        <FormBoxTitle>Custom Date Picker</FormBoxTitle>
      </FormCard>
    </Card>
  );
};

export default DesignGuideForm;
