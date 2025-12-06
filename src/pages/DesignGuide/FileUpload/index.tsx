import { Card, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Dropzone } from '@components';
import { FieldValues, UseFormReturn, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import yup from '@validation';

const DesignGuideFileUpload = () => {
  const theme = useTheme();

  const FileUploadBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const schema = yup.object({
    file: yup.mixed().required('Dosya Yükle').nullable(),
  });

  const form = useForm({
    defaultValues: { file: null },
    resolver: yupResolver(schema),
    reValidateMode: 'onChange',
  });

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Chart" hideMuiLink hideFigmaLink>
        Dosya yükleme custom olarak yazıldı. Sürükle bırak ile dosya yükleyebilirsiniz.
      </DesignGuideHeader>
      <FileUploadBox sx={{ marginBlock: 2 }}>
        <Dropzone
          loading={false}
          multiple={false}
          name="file"
          form={form as unknown as UseFormReturn<FieldValues>}
          maxSize={15}
        />
      </FileUploadBox>
    </Card>
  );
};

export default DesignGuideFileUpload;
