import type { HeadCell } from 'src/components/common/Table/types';
import type { ActivityLogItem } from '../company-history-tab.types';

/**
 * Get table headers for company activity log
 * Matches legacy layout exactly: User, Comment, Status, Date
 */
export function getActivityLogTableHeaders(): HeadCell[] {
  return [
    {
      id: 'UserName',
      label: 'Kullanıcı',
      width: 150,
    },
    {
      id: 'CommentText',
      label: 'Yorum',
      width: 400,
    },
    {
      id: 'ActivityStatus',
      label: 'Durum',
      width: 150,
    },
    {
      id: 'InsertDateTime',
      label: 'Tarih/Saat',
      width: 180,
      type: 'date-time',
    },
  ];
}

/**
 * Format activity log data for display
 * Applies any necessary transformations matching legacy behavior
 */
export function formatActivityLogData(items: ActivityLogItem[]): ActivityLogItem[] {
  return items.map((item) => ({
    ...item,
    // Ensure proper formatting for display
    CommentText: item.CommentText || '-',
    ActivityStatus: item.ActivityStatus || '-',
    UserName: item.UserName || '-',
  }));
}

/**
 * Get default activity log query parameters
 * Matches legacy default values exactly
 */
export function getDefaultActivityLogParams() {
  return {
    page: 1,
    pageSize: 25,
    sort: 'InsertDateTime',
    sortType: 'Desc' as const,
    onboardingStatusType: '',
    userId: '',
    ActivityType: '',
  };
}
