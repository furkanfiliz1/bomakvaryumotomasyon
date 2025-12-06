import { Dropzone, Form, Modal, ModalMethods, useNotice, LoadingButton } from '@components';
import { Box, Typography } from '@mui/material';
import {
  DocumentResponseModel,
  LabelResponseModel,
  PostDocumentsFileApiArg,
  usePostDocumentsFileMutation,
} from '@store';
import { DocumentLabelID } from '@types';
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { DocumentFormValues, useDocumentForm } from './useDocumentForm';
import yup from '@validation';
import { useErrorListener } from '@hooks';

interface UploadModalProps {
  labels: LabelResponseModel[] | undefined;
  refresh: () => void;
}

export interface UploadModalMethods {
  open: (item?: DocumentResponseModel, disabled?: boolean) => void;
  close: () => void;
}

const UploadModal = ({ labels, refresh }: UploadModalProps, ref: Ref<UploadModalMethods>) => {
  const notice = useNotice();

  const [labelId, setLabelId] = useState<DocumentLabelID | null>(null);
  const [isDisabledAutoComplete, setIsDisabledAutoComplete] = useState<boolean>(false);
  const modal = useRef<ModalMethods>(null);
  const { form, schema } = useDocumentForm(labels || [], labelId, isDisabledAutoComplete);

  const [uploadDocument, { isLoading, error: uploadError }] = usePostDocumentsFileMutation();

  useErrorListener([uploadError]);

  useImperativeHandle(ref, () => ({
    open: (item, disabled) => {
      form.reset();
      handleOpenModal(item as DocumentResponseModel);
      setIsDisabledAutoComplete(disabled || false);
    },

    close: () => {
      modal?.current?.close();
    },
  }));

  const handleOpenModal = (item: DocumentResponseModel) => {
    modal?.current?.open();
    form.setValue('labelId', item?.Id || null);
    setLabelId(item?.Id || 0);
  };

  const { watch } = form;

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === 'labelId') {
        setLabelId(value?.labelId || null);
        form.resetField('periodYear');
        form.resetField('periodQuarter');
      }
    });
    return () => subscription.unsubscribe();
  }, [form, watch]);

  const errorDialog = (message: string) =>
    notice({
      variant: 'error',
      title: 'Error',
      message: message,
      buttonTitle: 'Tamam',
    });

  const documentTypeControl = (labelId: DocumentLabelID | null | undefined, type: string) => {
    const mizanRequiredDocTypes = ['xls', 'xlsx', 'pdf'];
    if (
      (labelId === DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID ||
        labelId === DocumentLabelID.GECICI_BEYANNAME_LABEL_ID) &&
      type !== 'pdf'
    )
      return errorDialog('REQUIRED_PDF_MESSAGE');
    else if (labelId === DocumentLabelID.MIZAN_LABEL_ID && !mizanRequiredDocTypes.includes(type))
      return errorDialog('REQUIRED_PDF_XLSX_MESSAGE');
    else if (
      (labelId === DocumentLabelID.FINDEKS_LABEL_ID || labelId === DocumentLabelID.FAALIYET_RAPORU_LABEL_ID) &&
      type !== 'pdf'
    )
      return errorDialog('REQUIRED_PDF_MESSAGE');
  };

  const onSubmit = async (values: DocumentFormValues) => {
    const formData = new FormData();

    if (!form.getValues('file')) {
      throw Error('File not found');
    }
    const fileName = (form.getValues('file')! as File)?.name;
    const fileNameExceptExtension = fileName.substring(0, fileName.lastIndexOf('.'));
    const fileType = fileName?.split?.('.').pop()?.toLocaleLowerCase() || '';
    const body = {
      name: fileNameExceptExtension, // Dosya Adı
      type: fileType, // Dosyan Uzantısı
      labelId: labelId ? labelId : values?.labelId,
      file: form.getValues('file'),
      ...(values?.periodQuarter ? { periodQuarter: values?.periodQuarter } : {}),
      ...(values?.periodYear ? { periodYear: values?.periodYear } : {}),
      ...(values?.periodMonth ? { periodMonth: values?.periodMonth } : {}),
    };

    const documentTypeRes = await documentTypeControl(values?.labelId, fileType.toLocaleLowerCase());
    if (documentTypeRes) return;

    Object.entries(body).forEach(([key, value]) => {
      formData?.append(key, value as unknown as string);
    });

    const uploadRes = await uploadDocument(formData as PostDocumentsFileApiArg);
    if ('data' in uploadRes) {
      modal.current?.close();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Doküman başarıyla yüklendi',
        buttonTitle: 'Tamam',
      });
      refresh();
      form.reset();
    }
  };

  const actions = [
    {
      element: () => (
        <LoadingButton id="UPLOAD" onClick={form.handleSubmit(onSubmit)} variant="contained" loading={isLoading}>
          Yükle
        </LoadingButton>
      ),
    },
  ];

  const getFileAccepts = () => {
    if (
      labelId === DocumentLabelID.YILLIK_BEYANNAME_LABEL_ID ||
      labelId === DocumentLabelID.GECICI_BEYANNAME_LABEL_ID ||
      labelId === DocumentLabelID.FINDEKS_LABEL_ID ||
      labelId === DocumentLabelID.FAALIYET_RAPORU_LABEL_ID
    )
      return '.pdf';
    if (labelId === DocumentLabelID.MIZAN_LABEL_ID) return '.xls, .xlsx, .pdf';
    return '';
  };

  const getSupportedFormats = () => {
    const types = getFileAccepts().split(',');
    if (types[0] == '') types.pop();
    if (types.length > 0) {
      for (let index = 0; index < types.length; index++) {
        types[index] = types[index].replace(/[. ]/g, '');
      }
    }
    return types;
  };

  return (
    <Modal ref={modal} actions={actions} title="Doküman Yükle">
      <Typography variant="body5">
        Lütfen yüklemek istediğiniz dokümanı seçiniz ve gerekli alanları eksiksiz doldurunuz.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Form form={form} schema={schema as yup.AnyObjectSchema} />
        <Dropzone
          loading={isLoading}
          multiple={false}
          name="file"
          form={form}
          accept={getFileAccepts()}
          supportedFormat={getSupportedFormats()}
          maxSize={15}
        />
        <Typography variant="body5" display="block">
          Maksimum Dosya Boyutu: 15 MB
        </Typography>
      </Box>
    </Modal>
  );
};

export default forwardRef(UploadModal);
