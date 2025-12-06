import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo } from 'react';
import { createDocumentUpdateFormSchema, DocumentUpdateFormData } from '../helpers/document-form.helpers';

interface UseDocumentFormProps {
  documentStatusOptions: Array<{ Value: number; Description: string }>;
  initialValues?: Partial<DocumentUpdateFormData>;
}

export const useDocumentForm = ({ documentStatusOptions, initialValues }: UseDocumentFormProps) => {
  // Create schema with dynamic dropdown options
  const schema = useMemo(() => createDocumentUpdateFormSchema(documentStatusOptions), [documentStatusOptions]);

  // Initialize form with react-hook-form
  const form = useForm<DocumentUpdateFormData>({
    defaultValues: {
      message: initialValues?.message || '',
      status: initialValues?.status ?? null,
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: yupResolver(schema) as any,
    mode: 'onChange',
  });

  return {
    form,
    schema,
  };
};

export default useDocumentForm;
