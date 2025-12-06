import { Form } from '@components';
import { Grid } from '@mui/material';
import React, { useEffect, useRef } from 'react';
import { DocumentResponseModel } from '../../../api/figoParaApi';
import { useDocumentForm } from '../hooks';

interface DocumentFormComponentProps {
  document: DocumentResponseModel;
  documentStatusOptions: Array<{ Value: number; Description: string }>;
  onFormReady?: (form: ReturnType<typeof useDocumentForm>['form']) => void;
}

const DocumentFormComponent: React.FC<DocumentFormComponentProps> = ({
  document,
  documentStatusOptions,
  onFormReady,
}) => {
  const { form, schema } = useDocumentForm({
    documentStatusOptions,
    initialValues: {
      message: document.Message || '',
      status: document.Status ?? null,
    },
  });

  const hasCalledOnFormReady = useRef(false);

  // Pass form to parent component - only once on mount
  useEffect(() => {
    if (onFormReady && !hasCalledOnFormReady.current) {
      hasCalledOnFormReady.current = true;
      onFormReady(form);
    }
  }, [form, onFormReady]);

  // Reset form when document changes
  useEffect(() => {
    form.reset({
      message: document.Message || '',
      status: document.Status ?? null,
    });
  }, [document.Message, document.Status, form]);

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} md={12}>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <Form form={form as any} schema={schema as any} />
      </Grid>
    </Grid>
  );
};

export default DocumentFormComponent;
