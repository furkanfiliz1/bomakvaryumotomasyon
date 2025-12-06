import { Chip } from '@mui/material';
import React from 'react';
import { CompanyDiscount } from '../transaction-fee-discount.types';

/**
 * Status slot component for displaying Turkish Active/Inactive status
 * Matches legacy system behavior with proper status display
 */
export const StatusSlot: React.FC<{ row: CompanyDiscount }> = ({ row }) => {
  const isActive = row.IsActive;

  return (
    <Chip
      label={isActive ? 'Aktif' : 'Pasif'}
      color={isActive ? 'success' : 'default'}
      variant={isActive ? 'filled' : 'outlined'}
      size="small"
    />
  );
};

/**
 * Receiver VKN slot component - displays "Tüm Alıcılar" for null/empty values
 * Following project standards for null/empty value display
 */
export const ReceiverVknSlot: React.FC<{ row: CompanyDiscount }> = ({ row }) => {
  const vkn = row.ReceiverCompanyIdentifier;

  if (!vkn || vkn.trim() === '') {
    return 'Tüm Alıcılar';
  }

  return vkn;
};

/**
 * Sender VKN slot component - displays "Tüm Satıcılar" for null/empty values
 * Following project standards for null/empty value display
 */
export const SenderVknSlot: React.FC<{ row: CompanyDiscount }> = ({ row }) => {
  const vkn = row.SenderCompanyIdentifier;

  if (!vkn || vkn.trim() === '') {
    return 'Tüm Satıcılar';
  }

  return vkn;
};
