import dayjs from 'dayjs';
import type { CompanyComment } from '../company-comments.types';

/**
 * Format comment display date
 */
export const formatCommentDate = (dateString: string): string => {
  return dayjs(dateString).format('DD-MM-YYYY HH:mm:ss');
};

/**
 * Format comment text for display (handle long text)
 */
export const formatCommentText = (text: string, maxLength = 200): string => {
  if (!text) return '-';

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.substring(0, maxLength)}...`;
};

/**
 * Get comment status color for chip display
 */
export const getCommentStatusColor = (
  status: string,
): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'aktif':
      return 'success';
    case 'passive':
    case 'pasif':
      return 'error';
    case 'pending':
    case 'beklemede':
      return 'warning';
    default:
      return 'default';
  }
};

/**
 * Sort comments by date (newest first)
 */
export const sortCommentsByDate = (comments: CompanyComment[]): CompanyComment[] => {
  return [...comments].sort((a, b) => {
    return dayjs(b.InsertDateTime).valueOf() - dayjs(a.InsertDateTime).valueOf();
  });
};

/**
 * Get user initials for avatar display
 */
export const getUserInitials = (fullName: string): string => {
  if (!fullName) return '';

  const names = fullName.trim().split(' ');
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }

  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
};
