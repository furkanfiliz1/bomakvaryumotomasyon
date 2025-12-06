import { useState } from 'react';
import { useCreatePasswordMutation, useGetUserByIdQuery } from '../companies.api';
import { useNotice } from '@components';
import type { PasswordCreationRequest } from '../companies.types';

interface UsePasswordCreationRequestProps {
  userId?: string;
  companyIdentifier: string;
}

export const usePasswordCreationRequest = ({ userId, companyIdentifier }: UsePasswordCreationRequestProps) => {
  const notice = useNotice();
  const [isRequesting, setIsRequesting] = useState(false);

  // Get user data to construct the password creation request
  const { data: user } = useGetUserByIdQuery({ userId: parseInt(userId!) }, { skip: !userId || userId === 'yeni' });

  const [createPassword] = useCreatePasswordMutation();

  const handlePasswordCreationRequest = async () => {
    if (!user) {
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.',
      });
      return;
    }

    try {
      // Show confirmation dialog with the specific message
      await notice({
        type: 'confirm',
        variant: 'warning',
        title: 'Uyarı!',
        message:
          "Bu talep, İş Bankası'nın dijital onboarding sürecinden gelen müşteriler için gönderilecektir. Devam etmek istiyor musunuz?",
        buttonTitle: 'Evet',
        catchOnCancel: true,
      });

      setIsRequesting(true);

      // Prepare the password creation request data based on the curl
      const passwordCreationData: PasswordCreationRequest = {
        Identifier: companyIdentifier || '',
        UserName: user.UserName || '',
        Email: user.Email || '',
      };

      await createPassword(passwordCreationData).unwrap();

      // Show success notification
      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şifre oluşturma talebi başarıyla gönderildi.',
      });
    } catch (error) {
      // User cancelled or API error occurred
      if (error !== undefined) {
        console.error('Failed to send password creation request:', error);
        // Show error notification for API errors
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Şifre oluşturma talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        });
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    handlePasswordCreationRequest,
    isRequesting,
    canRequest: !!user,
  };
};
