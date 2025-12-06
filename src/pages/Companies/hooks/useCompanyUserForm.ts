import { useNotice } from '@components';
import { RESPONSE_DATE } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useErrorListener } from '@hooks';
import dayjs from 'dayjs';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateUserMutation, useGetUserByIdQuery, useUpdateUserMutation } from '../companies.api';
import type { CompanyUser, CreateUserRequest, UserFormData } from '../companies.types';
import { createCompanyUserFormSchema } from '../helpers';

interface UseCompanyUserFormProps {
  userPositions: Array<{ Id: number; Name: string }>;
  languages: Array<{ Id: number; Name: string; Code: string }>;
}

export const useCompanyUserForm = ({ userPositions, languages }: UseCompanyUserFormProps) => {
  const { companyId, userId } = useParams<{ companyId: string; userId: string }>();
  const navigate = useNavigate();
  const notice = useNotice();
  const isEdit = userId !== 'yeni';

  // API queries and mutations
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useGetUserByIdQuery({ userId: parseInt(userId!) }, { skip: !isEdit || userId === 'yeni' });

  const [updateUser, { isLoading: updating, error: updateError }] = useUpdateUserMutation();
  const [createUser, { isLoading: creating, error: createError }] = useCreateUserMutation();

  useErrorListener([updateError, createError, userError]);
  // Default form values
  const trLanguage = languages.find((lang) => lang.Code === 'tr');
  const defaultLanguageId = trLanguage?.Id ?? (languages.length > 0 ? languages[0].Id : '');

  const defaultValues: UserFormData = {
    UserPositionId: '',
    FirstName: '',
    LastName: '',
    Email: '',
    PasswordStatusType: 0,
    Phone: '',
    BirthDate: '',
    Identifier: '',
    UserName: '',
    Type: '2',
    IsLocked: 0,
    LanguageId: defaultLanguageId ? String(defaultLanguageId) : '',
  };

  // Form schema
  const schema = createCompanyUserFormSchema(userPositions, languages, isEdit);
  // Form instance
  const form = useForm<UserFormData>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onChange',
  });

  // Update form when languages are loaded (for new user form)
  useEffect(() => {
    if (!isEdit && languages.length > 0) {
      const trLang = languages.find((lang) => lang.Code === 'tr');
      const langId = trLang?.Id ?? languages[0].Id;
      form.setValue('LanguageId', String(langId));
    }
  }, [languages, isEdit, form]);

  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      // Format BirthDate to RESPONSE_DATE format if it exists
      const formattedBirthDate = user.BirthDate
        ? dayjs(user.BirthDate).isValid()
          ? dayjs(user.BirthDate).format(RESPONSE_DATE)
          : user.BirthDate
        : '';

      const trLanguage = languages.find((lang) => lang.Code === 'tr');
      const fallbackLanguageId = trLanguage?.Id ?? (languages.length > 0 ? languages[0].Id : '');
      const languageId = user.LanguageId ?? fallbackLanguageId;
      form.reset({
        UserPositionId: user.UserPositionId || '',
        FirstName: user.FirstName || '',
        LastName: user.LastName || '',
        Email: user.Email || '',
        PasswordStatusType: user.PasswordStatusType || 0,
        Phone: user.Phone || '',
        BirthDate: formattedBirthDate,
        Identifier: user.Identifier || '',
        UserName: user.UserName || '',
        Type: user.Type ? String(user.Type) : '2',
        IsLocked: user.IsLocked || 0,
        LanguageId: languageId ? String(languageId) : '',
      });
    }
  }, [user, form, languages]);

  // Form submit handler
  const handleSubmit = form.handleSubmit(async (formData) => {
    try {
      // Create submit data matching API expectations
      const submitData = {
        ...formData,
        // Convert UserPositionId: empty string stays as empty string, otherwise convert to number
        UserPositionId: formData.UserPositionId === '' ? '' : Number(formData.UserPositionId),
        // Convert LanguageId: null when not selected, number when selected
        LanguageId: formData.LanguageId && formData.LanguageId !== 0 ? Number(formData.LanguageId) : null,
      } as Partial<CompanyUser> & { LanguageId?: number | null; UserPositionId?: number | string };

      if (isEdit) {
        await updateUser({
          userId: parseInt(userId!),
          data: submitData,
        }).unwrap();

        // Show success notification for update
        await notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Kullanıcı bilgileri başarıyla güncellendi.',
        });
      } else {
        // Prepare base user data
        const baseUserData = {
          UserPositionId: formData.UserPositionId === '' ? '' : Number(formData.UserPositionId),
          FirstName: formData.FirstName,
          LastName: formData.LastName,
          Email: formData.Email,
          PasswordStatusType: formData.PasswordStatusType,
          Phone: formData.Phone,
          BirthDate: formData.BirthDate,
          Identifier: formData.Identifier,
          UserName: formData.UserName,
          Type: formData.Type.toString(),
          IsLocked: formData.IsLocked,
          companyId: companyId!, // Send as string to match API expectation
        };

        // Include LanguageId (can be null if no language is selected)
        const createUserData: CreateUserRequest = {
          ...baseUserData,
          LanguageId:
            formData.LanguageId && formData.LanguageId.toString() === '0' ? null : Number(formData.LanguageId),
        };

        const createResponse = await createUser(createUserData).unwrap();

        // Show success notification for create
        await notice({
          variant: 'success',
          title: 'Başarılı',
          message: 'Kullanıcı başarıyla eklendi.',
        });

        // Navigate to the newly created user's detail page
        if (createResponse?.Id) {
          navigate(`/companies/${companyId}/kullanici/${createResponse.Id}`);
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  });

  return {
    form,
    schema,
    handleSubmit,
    isEdit,
    userLoading,
    userError,
    updating,
    creating,
    companyId,
    userId,
  };
};

export default useCompanyUserForm;
