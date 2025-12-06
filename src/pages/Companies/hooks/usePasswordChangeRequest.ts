import { useState } from 'react';
import { useChangeUserPasswordMutation, useGetUserByIdQuery } from '../companies.api';
import { useNotice } from '@components';
import type { PasswordChangeRequest } from '../companies.types';

interface UsePasswordChangeRequestProps {
  userId?: string;
  companyIdentifier: string;
}

export const usePasswordChangeRequest = ({ userId, companyIdentifier }: UsePasswordChangeRequestProps) => {
  const notice = useNotice();
  const [isRequesting, setIsRequesting] = useState(false);

  // Get user data to construct the password change request
  const { data: user } = useGetUserByIdQuery({ userId: parseInt(userId!) }, { skip: !userId || userId === 'yeni' });

  const [changeUserPassword] = useChangeUserPasswordMutation();

  const handlePasswordChangeRequest = async () => {
    if (!user) {
      await notice({
        variant: 'error',
        title: 'Hata',
        message: 'Kullanıcı bilgileri yüklenemedi. Lütfen sayfayı yenileyin.',
      });
      return;
    }

    try {
      // Show confirmation dialog
      await notice({
        type: 'confirm',
        variant: 'primary',
        title: 'Şifre Değiştirme Talebi',
        message: 'Bu kullanıcı için şifre değiştirme talebi göndermek istediğinizden emin misiniz?',
        buttonTitle: 'Talebi Gönder',
        catchOnCancel: true,
      });

      setIsRequesting(true);

      // Prepare the password change request data based on the curl
      const passwordChangeData: PasswordChangeRequest = {
        Identifier: companyIdentifier || '',
        UserName: user.UserName || '',
        Email: user.Email || '',
        SendSMS: '0', // Default to not send SMS as per curl
        SendEMail: '0', // Default to not send Email as per curl
      };

      await changeUserPassword(passwordChangeData).unwrap();

      // Show success notification
      await notice({
        variant: 'success',
        title: 'Başarılı',
        message: 'Şifre değiştirme talebi başarıyla gönderildi.',
      });
    } catch (error) {
      // User cancelled or API error occurred
      if (error !== undefined) {
        console.error('Failed to send password change request:', error);
        // Show error notification for API errors
        await notice({
          variant: 'error',
          title: 'Hata',
          message: 'Şifre değiştirme talebi gönderilirken bir hata oluştu. Lütfen tekrar deneyin.',
        });
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    handlePasswordChangeRequest,
    isRequesting,
    canRequest: !!user,
  };
};
