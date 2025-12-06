import { Form, Modal, ModalMethods, fields, useNotice } from '@components';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Button, DialogContent, Paper, TextField, Typography } from '@mui/material';
import yup from '@validation';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  useDeleteCompanyMutation,
  useGetCompanySettingsQuery,
  useGetLanguagesQuery,
  useUpdateCompanySettingsMutation,
} from '../companies.api';
import type { CompanySystemSettingsUpdateRequest, LanguageOption } from '../companies.types';

interface CompanySystemSettingsProps {
  companyId: number;
  companyData: {
    CompanyName: string;
    Identifier: string;
  };
}

interface SystemSettingsData {
  IsTwoFactorAuthenticationPassive: boolean;
  FinancerWorkingType: number;
  LanguageId: number | null;
  ChequeAllowed: boolean;
  IsInvoicesBlockedForOtherProducts: boolean;
  TheBuyerIsSeller: boolean;
  OrderAllowed: boolean;
}

// Create Yup schema for form validation
const createSystemSettingsSchema = (languageList: LanguageOption[]) => {
  const workingTypeOptions = [
    { Value: 0, Description: 'Hayır' },
    { Value: 1, Description: 'Tüm Süreçler' },
    { Value: 2, Description: 'Sadece Alıcı Bildirimli' },
    { Value: 3, Description: 'Sadece Fatura Finansmanı' },
  ];

  const languageOptions =
    languageList.length > 0 ? [{ Id: 0, Name: 'Dil Seçin' }, ...languageList] : [{ Id: 0, Name: 'Dil Seçin' }];

  return yup.object({
    IsTwoFactorAuthenticationPassive: fields.switchField
      .label('İki adımlı doğrulama uygulansın mı?')
      .meta({ col: 12, mb: 2, spaceBetween: true }),
    OrderAllowed: fields.switchField.label('Sipariş işlemleri açık mı?').meta({ col: 12, mb: 2 }),
    ChequeAllowed: fields.switchField.label('Çek işlemleri açık mı?').meta({ col: 12, mb: 2 }),
    IsInvoicesBlockedForOtherProducts: fields.switchField
      .label('Bu alıcının faturaları Tedarikçi Finansmanı haricinde diğer ürünlerde kısıtlansın mı?')
      .meta({ col: 12, mb: 2 }),
    TheBuyerIsSeller: fields.switchField.label('Çift Şirket Tipi (Alıcı & Satıcı').meta({ col: 12, mb: 2 }),
    FinancerWorkingType: fields
      .select(workingTypeOptions, 'number', ['Value', 'Description'])
      .label('7*24 Çalışır mı?')
      .nullable()
      .meta({ col: 12, mb: 2 }),
    LanguageId: fields
      .select(languageOptions, 'number', ['Id', 'Name'])
      .nullable()
      .label('Şirket Dili')
      .meta({ col: 12, mb: 2 }),
  }) as yup.ObjectSchema<SystemSettingsData>;
};

const CompanySystemSettings: React.FC<CompanySystemSettingsProps> = ({ companyId, companyData }) => {
  // Hooks
  const notice = useNotice();
  const navigate = useNavigate();
  const deleteModalRef = React.useRef<ModalMethods>(null);

  // RTK Query hooks
  const {
    data: settingsData,
    isLoading: isSettingsLoading,
    error: settingsError,
  } = useGetCompanySettingsQuery(
    { companyId },
    {
      skip: !companyId,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const { data: languagesResponse, isLoading: isLanguagesLoading } = useGetLanguagesQuery({ IsActive: 'true' });

  const [updateSettings, { isLoading: isUpdateLoading, error: updateError }] = useUpdateCompanySettingsMutation();

  const [deleteCompany, { isLoading: isDeleteLoading, error: deleteError }] = useDeleteCompanyMutation();

  // Process languages data to match expected format
  const languageList: LanguageOption[] =
    languagesResponse?.map((lang) => ({
      Id: lang.Id,
      Name: lang.Name,
      IsDefault: lang.IsActive,
    })) || [];

  // Create the schema after languageList is loaded
  const schema = createSystemSettingsSchema(languageList);

  // Set up React Hook Form
  const form = useForm<SystemSettingsData>({
    resolver: yupResolver(schema),
    defaultValues: {
      IsTwoFactorAuthenticationPassive: false,
      FinancerWorkingType: 0,
      LanguageId: null,
      ChequeAllowed: false,
      IsInvoicesBlockedForOtherProducts: false,
      TheBuyerIsSeller: false,
      OrderAllowed: false,
    },
  });

  // Reset form when settings data is loaded
  useEffect(() => {
    if (settingsData) {
      form.reset({
        IsTwoFactorAuthenticationPassive: !settingsData.IsTwoFactorAuthenticationPassive,
        FinancerWorkingType: settingsData.FinancerWorkingType,
        LanguageId: settingsData.LanguageId,
        ChequeAllowed: settingsData.ChequeAllowed === 1,
        IsInvoicesBlockedForOtherProducts: settingsData.IsInvoicesBlockedForOtherProducts,
        TheBuyerIsSeller: settingsData.TheBuyerIsSeller,
        OrderAllowed: settingsData.OrderAllowed === 1,
      });
    }
  }, [settingsData, form]);

  // Handle form submission with data transformation
  const handleSaveSettings = async (formData: SystemSettingsData) => {
    try {
      // Transform boolean values to numbers for API
      const updateData: CompanySystemSettingsUpdateRequest = {
        Id: companyId,
        IsTwoFactorAuthenticationPassive: formData.IsTwoFactorAuthenticationPassive ? 0 : 1,
        FinancerWorkingType: formData.FinancerWorkingType,
        LanguageId: formData.LanguageId,
        ChequeAllowed: formData.ChequeAllowed ? 1 : 0,
        IsInvoicesBlockedForOtherProducts: formData.IsInvoicesBlockedForOtherProducts ? 1 : 0,
        TheBuyerIsSeller: formData.TheBuyerIsSeller ? 1 : 0,
        OrderAllowed: formData.OrderAllowed ? 1 : 0,
      };

      await updateSettings({ companyId, data: updateData }).unwrap();
      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Ayarlar başarıyla güncellendi',
        buttonTitle: 'Tamam',
      });
    } catch (error) {
      console.error('Ayarlar güncellenirken hata oluştu', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Ayarlar güncellenirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  // State for delete confirmation modal
  const [confirmationText, setConfirmationText] = React.useState('');

  // Handle delete company
  const handleDeleteCompany = () => {
    setConfirmationText('');
    deleteModalRef.current?.open();
  };

  const handleConfirmDelete = async () => {
    if (confirmationText.toLowerCase() !== companyData.Identifier.toLowerCase()) {
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Doğru VKN giriniz!',
        buttonTitle: 'Tamam',
      });
      return;
    }

    try {
      await deleteCompany({ companyId }).unwrap();

      deleteModalRef.current?.close();

      notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şirket başarıyla silindi',
        buttonTitle: 'Tamam',
      });

      // Navigate back to companies list
      navigate('/companies/all');
    } catch (error) {
      console.error('Şirket silinirken hata oluştu', error);
      notice({
        variant: 'error',
        title: 'Hata',
        message: 'Şirket silinirken hata oluştu',
        buttonTitle: 'Tamam',
      });
    }
  };

  // Handle errors
  useEffect(() => {
    if (settingsError) {
      console.error('Ayarlar yüklenirken hata oluştu:', settingsError);
    }
    if (updateError) {
      console.error('Ayarlar güncellenirken hata oluştu:', updateError);
    }
    if (deleteError) {
      console.error('Şirket silinirken hata oluştu:', deleteError);
    }
  }, [settingsError, updateError, deleteError]);

  const isLoading = isSettingsLoading || isLanguagesLoading || isUpdateLoading || isDeleteLoading;

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Sistem Ayarları
      </Typography>

      <Paper>
        <Form form={form} schema={schema}>
          {/* Action Buttons */}
          <Box display="flex" justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="error" onClick={handleDeleteCompany} disabled={isLoading} sx={{ mr: 2 }}>
              {isDeleteLoading ? 'Siliniyor...' : 'Şirketi Sil'}
            </Button>
            <Button variant="contained" onClick={form.handleSubmit(handleSaveSettings)} disabled={isLoading}>
              {isUpdateLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </Button>
          </Box>
        </Form>
      </Paper>

      {/* Delete Company Confirmation Modal */}
      <Modal
        ref={deleteModalRef}
        title="Bu Şirket ve Kullanıcılar Silinecektir"
        maxWidth="sm"
        fullWidth={false}
        actions={[
          {
            element: () => (
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => deleteModalRef.current?.close()} disabled={isDeleteLoading}>
                  İptal
                </Button>
                <Button variant="contained" color="error" onClick={handleConfirmDelete} disabled={isDeleteLoading}>
                  {isDeleteLoading ? 'Siliniyor...' : 'Tamam'}
                </Button>
              </Box>
            ),
          },
        ]}>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Bu şirket herhangi bir raporda listelenmeyecektir. Devam etmek istiyor musunuz?
          </Typography>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>
            Bu işlemi geri alamazsınız!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Lütfen teyit etmek için VKN giriniz: <strong>{companyData.Identifier}</strong>
          </Typography>
          <TextField
            fullWidth
            label="Onay Metni Giriniz"
            placeholder="VKN giriniz"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            error={
              confirmationText.length > 0 && confirmationText.toLowerCase() !== companyData.Identifier.toLowerCase()
            }
            helperText={
              confirmationText.length > 0 && confirmationText.toLowerCase() !== companyData.Identifier.toLowerCase()
                ? 'Doğru VKN giriniz!'
                : ''
            }
          />
        </DialogContent>
      </Modal>
    </Box>
  );
};

export default CompanySystemSettings;
