import { Form, Slot, Table, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import { Add, Delete } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import yup from '@validation';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  useCreateTargetCompanyMailsMutation,
  useDeleteTargetCompanyMailMutation,
  useGetTargetCompanyEmailsQuery,
} from '../customer-request-branch-list.api';
import type { CustomerRequestBranchItem, ParentCustomer, ParentRequest } from '../customer-request-branch-list.types';

interface EmailManagementModalProps {
  open: boolean;
  onClose: () => void;
  selectedRequest: CustomerRequestBranchItem;
  parentCustomer: ParentCustomer;
  parentRequest: ParentRequest;
  onSuccess: () => void;
}

interface EmailItem {
  id?: number | null;
  email: string;
  isActive: boolean;
  isFromServer?: boolean;
  isEmailSent?: boolean;
  createdDate?: string | null;
  updatedDate?: string | null;
}

// Email form data type
interface AddEmailFormData {
  emailAddress?: string;
}

// Email validation schema using project's Form component patterns
const createAddEmailSchema = () => {
  return yup.object({
    emailAddress: fields.text
      .required('Email adresi zorunludur')
      .validEmail('Geçerli bir email adresi giriniz')
      .max(255, 'Email adresi en fazla 255 karakter olmalıdır')
      .label('Email Adresi')
      .meta({
        col: 9,
        size: 'small',
      }),
  });
};

/**
 * Email Management Modal Component
 * Matches legacy EmailModal functionality exactly - follows the business logic:
 * 1. Load server emails on modal open
 * 2. Allow adding new emails (each addition auto-saves)
 * 3. Toggle email active/inactive status
 * 4. Final submission sends emails or just saves
 */
export const EmailManagementModal: React.FC<EmailManagementModalProps> = ({
  open,
  onClose,
  selectedRequest,
  parentCustomer,
  parentRequest,
  onSuccess,
}) => {
  // Component state following legacy pattern
  const [serverEmails, setServerEmails] = useState<EmailItem[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const notice = useNotice();

  // Email form setup using project's Form system
  const addEmailSchema = createAddEmailSchema();
  const emailForm = useForm({
    resolver: yupResolver(addEmailSchema), // Type cast needed for Yup schema compatibility
    defaultValues: {
      emailAddress: '',
    },
    mode: 'onChange',
  });

  // Fetch existing emails from server
  const {
    data: serverEmailsData,
    isLoading: isLoadingEmails,
    error: emailsFetchError,
  } = useGetTargetCompanyEmailsQuery(
    {
      targetCompanyIdentifier: selectedRequest.TargetCompanyIdentifier,
      reportRequestId: parentRequest.Id,
      clientCompanyId: parentCustomer.Id,
    },
    { skip: !open, refetchOnMountOrArgChange: true },
  );

  // Create/Send emails mutation
  const [createEmails, { isLoading: isCreatingEmails, error: createEmailsError }] =
    useCreateTargetCompanyMailsMutation();

  // Delete email mutation
  const [deleteEmail, { isLoading: isDeletingEmail, error: deleteEmailError }] = useDeleteTargetCompanyMailMutation();

  useErrorListener([createEmailsError, deleteEmailError, emailsFetchError]);

  // Check if email is the main email from the row (cannot be deleted)
  const isMainEmail = (email: string) => {
    const rowEmail = selectedRequest.MailAddress?.trim();
    return rowEmail ? email === rowEmail : false;
  };

  // Load server emails when modal opens (matching legacy logic)
  useEffect(() => {
    if (open && serverEmailsData?.Mails) {
      const emails: EmailItem[] = serverEmailsData.Mails.map((mail) => ({
        id: mail.Id,
        email: mail.MailAddress,
        isActive: mail.IsActive,
        isFromServer: true,
        isEmailSent: mail.IsEmailSend,
        createdDate: mail.CreatedDate,
        updatedDate: mail.UpdatedDate,
      }));

      // Add row's MailAddress to the list if it exists and isn't already in the server list
      const rowEmail = selectedRequest.MailAddress?.trim();
      if (rowEmail && !emails.some((email) => email.email === rowEmail)) {
        const rowEmailItem: EmailItem = {
          id: null,
          email: rowEmail,
          isActive: true, // Make it selected by default
          isFromServer: false, // This is from the row, not server
          isEmailSent: false,
          createdDate: null,
          updatedDate: null,
        };
        emails.push(rowEmailItem);
      }

      // If row email exists in server list, make sure it's selected
      if (rowEmail) {
        for (const email of emails) {
          if (email.email === rowEmail) {
            email.isActive = true;
          }
        }
      }

      setServerEmails(emails);
    }

    if (open) {
      // Reset form state when modal opens
      emailForm.reset({ emailAddress: '' });
      setSubmitError(null);
    }
  }, [open, serverEmailsData, emailForm, selectedRequest.MailAddress]);

  // Handle adding new email (matches legacy addEmailAddress function) - now using form validation
  const handleAddEmail = async (data: AddEmailFormData) => {
    const trimmedEmail = data?.emailAddress?.trim();

    if (!trimmedEmail) return;

    // Check if email already exists
    if (serverEmails.some((email) => email.email === trimmedEmail)) {
      emailForm.setError('emailAddress', {
        type: 'manual',
        message: 'Bu email adresi zaten eklenmiş',
      });
      return;
    }

    // Auto-save the new email (matching legacy auto-save logic)
    try {
      const newEmailData = {
        clientCompanyId: parentCustomer.Id,
        targetCompanyIdentifier: selectedRequest.TargetCompanyIdentifier,
        reportRequestId: parentRequest.Id,
        sendMails: false, // Just save, don't send
        mails: [
          {
            email: trimmedEmail,
            isActive: true,
          },
        ],
      };

      await createEmails(newEmailData).unwrap();

      // Add to local state
      const newEmail: EmailItem = {
        email: trimmedEmail,
        isActive: true,
        isFromServer: true, // Now it's saved on server
      };

      setServerEmails((prev) => [...prev, newEmail]);
      emailForm.reset({ emailAddress: '' });

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Email adresi başarıyla kaydedildi.',
      });
    } catch (error) {
      console.error('Email auto-save failed:', error);
      emailForm.setError('emailAddress', {
        type: 'manual',
        message: 'Email kaydedilirken bir hata oluştu',
      });
    }
  };

  // Handle delete email
  const handleDeleteEmail = async (emailToDelete: string) => {
    try {
      await deleteEmail({
        clientCompanyId: parentCustomer.Id,
        targetCompanyIdentifier: selectedRequest.TargetCompanyIdentifier,
        reportRequestId: parentRequest.Id,
        mailAddresses: [emailToDelete],
      }).unwrap();

      // Remove from local state
      setServerEmails((prev) => prev.filter((email) => email.email !== emailToDelete));

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Email adresi başarıyla silindi.',
      });
    } catch (error) {
      console.error('Email delete failed:', error);
    }
  };

  // Final submission (matches legacy handleEmailConfirm/handleEmailSaveOnly)
  const handleSubmit = async () => {
    try {
      setSubmitError(null);

      const activeEmails = serverEmails.filter((email) => email.isActive);

      if (activeEmails.length === 0) {
        setSubmitError('En az bir aktif email adresi seçmelisiniz');
        return;
      }

      // Prepare API request data - only include active emails
      const requestData = {
        clientCompanyId: parentCustomer.Id,
        targetCompanyIdentifier: selectedRequest.TargetCompanyIdentifier,
        reportRequestId: parentRequest.Id,
        sendMails: true, // Final submission always sends emails to active addresses
        mails: serverEmails
          .filter((email) => email.isActive) // Only include active emails
          .map((email) => ({
            email: email.email,
            isActive: email.isActive,
          })),
      };

      // Make API call
      await createEmails(requestData).unwrap();

      // Success - close modal and refresh parent
      onSuccess();
      onClose();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Email gönderme işlemi başarıyla gerçekleştirildi.',
      });
    } catch (error) {
      console.error('Email işlemi hatası:', error);
      setSubmitError('Email işlemi gerçekleştirilirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  // Table headers using built-in selection - no need for manual selection column
  const tableHeaders = useMemo(
    () => [
      { id: 'email', label: 'Email Adresi', sortable: false },
      { id: 'status', label: 'Durum', sortable: false, width: 100, slot: true },
      { id: 'createdDate', label: 'Oluşturma Tarihi', sortable: false, width: 150, type: 'date-time' },
      { id: 'updatedDate', label: 'Güncelleme Tarihi', sortable: false, width: 150, type: 'date-time' },
      { id: 'actions', label: 'İşlemler', sortable: false, width: 80, slot: true },
    ],
    [],
  );

  // Count active emails
  const activeEmailCount = serverEmails.filter((email) => email.isActive).length;

  // Handle table selection - updates isActive status based on table selection
  const handleTableSelection = (selectedEmails: EmailItem[]) => {
    const selectedEmailAddresses = new Set(selectedEmails.map((email) => email.email));

    setServerEmails((prev) =>
      prev.map((email) => ({
        ...email,
        isActive: selectedEmailAddresses.has(email.email),
      })),
    );
  };

  // Get initially selected emails (those marked as active)
  const initialSelectedIds = useMemo(
    () => serverEmails.filter((email) => email.isActive).map((email) => email.email), // Use email as the identifier
    [serverEmails],
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { minHeight: 600 } }}>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            📧 Email Gönder - {selectedRequest.TargetCompanyTitle || 'Test Firma Ltd.'}
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        {emailsFetchError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Email bilgileri yüklenirken bir hata oluştu.
          </Alert>
        )}

        {isLoadingEmails ? (
          <Box display="flex" justifyContent="center" py={4}>
            <Typography>Email bilgileri yükleniyor...</Typography>
          </Box>
        ) : (
          <>
            {/* Add New Email Section */}
            <Box mb={3}>
              <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                Email adresini yazıp Enter&apos;a basınız
              </Typography>
              <Form
                form={emailForm}
                schema={addEmailSchema}
                childCol={3}
                space={2}
                onKeyDown={(e: React.KeyboardEvent) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    emailForm.handleSubmit(handleAddEmail)();
                  }
                }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: emailForm.formState.errors.emailAddress ? 'center' : 'flex-end',
                    height: '100%',
                  }}>
                  <Button
                    onClick={emailForm.handleSubmit(handleAddEmail)}
                    startIcon={<Add />}
                    variant="contained"
                    size="small"
                    disabled={!emailForm.watch('emailAddress')?.trim()}
                    sx={{ minWidth: 100, height: '40px' }}>
                    Ekle
                  </Button>
                </Box>
              </Form>
            </Box>

            {/* Email Table Section */}
            <Box mb={3}>
              <Typography variant="h6" gutterBottom>
                Gönderilecek Email Adresleri
                <Typography component="span" variant="body2" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                  {activeEmailCount} aktif
                </Typography>
              </Typography>

              {serverEmails.length === 0 ? (
                <Alert severity="info">
                  Henüz kayıtlı email adresi bulunmamaktadır. Yukarıdan yeni email ekleyebilirsiniz.
                </Alert>
              ) : (
                <Table<EmailItem>
                  id="email-management-table"
                  rowId="email"
                  data={serverEmails}
                  headers={tableHeaders}
                  loading={false}
                  checkbox={true}
                  singleSelect={false}
                  initialCheckedIds={initialSelectedIds}
                  onCheckboxSelect={handleTableSelection}>
                  {/* Email Address Column */}
                  <Slot<EmailItem> id="email">
                    {(_, row) => (
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {row?.email}
                      </Typography>
                    )}
                  </Slot>

                  {/* Status Column */}
                  <Slot<EmailItem> id="status">
                    {(_, row) => (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          backgroundColor: row?.isActive ? 'success.100' : 'grey.200',
                          color: row?.isActive ? 'success.800' : 'grey.600',
                        }}>
                        {row?.isActive ? 'Aktif' : 'Pasif'}
                      </Box>
                    )}
                  </Slot>

                  {/* Actions Column */}
                  <Slot<EmailItem> id="actions">
                    {(_, row) => {
                      const emailAddress = row?.email || '';
                      const isMain = isMainEmail(emailAddress);

                      if (isMain) {
                        return (
                          <Tooltip title="Ana email adresi silinemez">
                            <span>
                              <IconButton size="small" disabled>
                                <Delete fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        );
                      }

                      return (
                        <Tooltip title="Email adresini sil">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEmail(emailAddress);
                            }}
                            disabled={isDeletingEmail}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      );
                    }}
                  </Slot>
                </Table>
              )}
            </Box>

            {/* Company Info Section - Bottom */}
            <Box
              sx={{
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
              }}>
              <Typography variant="h6" gutterBottom>
                Gönderilecek İçerik:
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Firma:</strong> {selectedRequest.TargetCompanyTitle || 'Test Firma Ltd.'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>VKN:</strong> {selectedRequest.TargetCompanyIdentifier || '0987654321'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Figoskor Pro bilgilendirme emaili seçili email adreslerine gönderilecektir.
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={isCreatingEmails} variant="outlined">
          İptal
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          loading={isCreatingEmails}
          variant="contained"
          color="primary"
          disabled={isLoadingEmails || activeEmailCount === 0}>
          📧 Email Gönder ({activeEmailCount})
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
