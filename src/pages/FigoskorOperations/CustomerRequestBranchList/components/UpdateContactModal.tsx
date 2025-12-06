import { Form, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { LoadingButton } from '@mui/lab';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import yup from '@validation';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useUpdateTargetCompanyContactInfoMutation } from '../customer-request-branch-list.api';
import type { CustomerRequestBranchItem, ParentCustomer, ParentRequest } from '../customer-request-branch-list.types';

/* eslint-disable @typescript-eslint/no-explicit-any */

interface UpdateContactModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

// Contact form data type
interface UpdateContactFormData {
  contactPerson: string;
  phone?: string | null;
  mailAddress: string;
}

// Validation schema using project's Form component patterns
const createUpdateContactSchema = () => {
  return yup.object({
    contactPerson: fields.text.label('Yetkili İsim Soyisim').meta({
      col: 12,
      placeholder: 'Yetkili kişinin adı ve soyadını giriniz',
    }),

    phone: fields.phone
      .nullable()
      .required('Telefon alanı zorunludur')
      .validPhone('Geçerli bir telefon numarası giriniz')
      .label('Telefon')
      .meta({
        col: 6,
        placeholder: 'Telefon numarasını giriniz',
      }),

    mailAddress: fields.text
      .required('Email alanı zorunludur')
      .validEmail('Geçerli bir email adresi giriniz')
      .max(255, 'Email adresi en fazla 255 karakter olmalıdır')
      .label('Email')
      .meta({
        col: 6,
        placeholder: 'Email adresini giriniz',
      }),
  });
};

/**
 * Update Contact Modal Component
 * Matches legacy UpdateModal functionality exactly with Material-UI styling
 */
export const UpdateContactModal: React.FC<UpdateContactModalProps> = ({
  open,
  onClose,
  selectedRequest,
  parentCustomer,
  parentRequest,
  onSuccess,
}) => {
  const notice = useNotice();

  // Mutation for updating contact info
  const [updateContact, { isLoading: isUpdating, error: updateError }] = useUpdateTargetCompanyContactInfoMutation();

  useErrorListener(updateError);

  // Create schema instance
  const updateContactSchema = createUpdateContactSchema();

  // Form setup with initial values from selected request
  const form = useForm({
    resolver: yupResolver(updateContactSchema) as any,
    defaultValues: {
      contactPerson: selectedRequest?.ContactPerson || '',
      phone: selectedRequest?.Phone || '',
      mailAddress: selectedRequest?.MailAddress || '',
    },
    mode: 'onChange',
  });

  // Reset form when modal opens with new request
  React.useEffect(() => {
    if (open && selectedRequest) {
      form.reset({
        contactPerson: selectedRequest.ContactPerson || '',
        phone: selectedRequest.Phone || '',
        mailAddress: selectedRequest.MailAddress || '',
      });
    }
  }, [open, selectedRequest, form]);

  // Handle form submission
  const handleSubmit = async (data: UpdateContactFormData) => {
    try {
      // Prepare API request data matching legacy structure
      const requestData = {
        clientCompanyId: parentCustomer.Id,
        reportRequestId: parentRequest.Id,
        targetCompanyIdentifier: selectedRequest.TargetCompanyIdentifier,
        contactPerson: data.contactPerson,
        phone: data.phone || '',
        mailAddress: data.mailAddress,
      };

      // Make API call
      await updateContact(requestData).unwrap();

      // Success - close modal and refresh parent
      onSuccess();
      onClose();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'İletişim bilgileri başarıyla güncellendi.',
      });
    } catch (error) {
      console.error('Contact info güncelleme hatası:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth PaperProps={{ sx: { minHeight: 400 } }}>
      <DialogTitle>İletişim Bilgilerini Güncelle</DialogTitle>

      <DialogContent>
        {/* Company Info Display */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Box>
            <strong>Firma:</strong> {selectedRequest?.TargetCompanyTitle || 'Bulunamadı'}
            <br />
            <strong>VKN:</strong> {selectedRequest?.TargetCompanyIdentifier || 'Bulunamadı'}
          </Box>
        </Alert>

        {/* Form Component using schema-based approach */}
        <Form form={form as any} schema={updateContactSchema} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={isUpdating}>
          İptal
        </Button>
        <LoadingButton
          onClick={form.handleSubmit(handleSubmit as any)}
          loading={isUpdating}
          variant="contained"
          color="primary">
          Güncelle
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
