import { Button, Form, fields } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card } from '@mui/material';
import yup from '@validation';
import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { XML, XMLValues } from 'src/models/Xml';

const XMLGenerator = () => {
  const xml = useRef(new XML());

  const schema = yup.object().shape({
    ID: fields.text.meta({ col: 6 }).required('Bu alan zorunludur').meta({ trim: true }).label('INVOICE NUMBER'),
    UUID: fields.text
      .meta({ col: 6 })
      .required('Bu alan zorunludur')
      .meta({ readonly: true, trim: true })
      .label('UUID'),
    HASH_CODE: fields.text.meta({ col: 6 }).required('Bu alan zorunludur').meta({ trim: true }).label('HASH CODE'),
    SELLER_NAME: fields.text
      .meta({ col: 6 })
      .required()
      .meta({ trim: true })
      .min(3, 'En az 3 karakterli olmalıdır')
      .label('SATICI ADI'),
    SELLER_MIDDLE_NAME: fields.text
      .meta({ col: 6 })
      .required('Bu alan zorunludur')
      .meta({ trim: true })
      .min(3, 'En az 3 karakterli olmalıdır')
      .label('SATICI MIDDLE NAME'),
    SELLER_FAMILY_NAME: fields.text
      .meta({ col: 6 })
      .required('Bu alan zorunludur')
      .meta({ trim: true })
      .min(3, 'En az 3 karakterli olmalıdır')
      .label('SATICI SOYADI'),
    BUYER_ID: fields.text.meta({ col: 6 }).required('Bu alan zorunludur').meta({ trim: true }).label('Alıcı VKN'),
    SELLER_ID: fields.text.meta({ col: 6 }).required('Bu alan zorunludur').meta({ trim: true }).label('Satıcı VKN'),
    paymentDueDate: fields.date.meta({ col: 6, disablePast: true }).label('Vade Tarihi'),
    issueDate: fields.date.meta({ col: 6, disableFuture: true }).required('Bu alan zorunludur').label('Kesim Tarihi'),
    payableAmount: fields.currency.meta({ col: 6 }).required('Bu alan zorunludur').label('Payable Amount'),
    taxExclusiveAmount: fields.currency.meta({ col: 6 }).required('Bu alan zorunludur').label('Tax Inclusive Amount'),
  }) as yup.ObjectSchema<XMLValues>;

  const form = useForm({
    defaultValues: xml.current.values,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  const onSave = () => {
    xml.current.values = form.getValues();
    xml.current.save();
    const newXml = new XML();
    newXml.values = {
      ...newXml.values,
      BUYER_ID: xml.current.values.BUYER_ID,
      SELLER_ID: xml.current.values.SELLER_ID,
    };
    xml.current = newXml;
    form.reset(xml.current.values);
  };

  const onSave10x = () => {
    for (let i = 0; i < 10; i++) {
      onSave();
    }
  };

  return (
    <Card sx={{ p: 2 }}>
      <Form form={form} schema={schema}>
        <Box display="flex" justifyContent="end" gap={2}>
          <Button variant="contained" id="xml" onClick={onSave}>
            XML İndir
          </Button>
          <Button variant="contained" id="xml" onClick={onSave10x}>
            10x XML İndir
          </Button>
        </Box>
      </Form>
    </Card>
  );
};

export default XMLGenerator;
