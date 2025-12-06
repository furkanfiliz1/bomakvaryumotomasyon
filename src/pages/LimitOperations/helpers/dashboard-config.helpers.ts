import { OnboardingStatusCount } from '../limit-operations.types';

// Dashboard card configuration for status tracking
export interface StatusCardConfig {
  id: string;
  title: string;
  statusType: number;
  navigateUrl: string;
  className?: string;
}

// Section configuration for grouping cards
export interface SectionConfig {
  title: string;
  cards: StatusCardConfig[];
  className?: string;
}

// Navigation URLs mapping based on legacy button IDs and status types
export const getNavigationUrl = (statusType: number): string => {
  const urlMap: Record<number, string> = {
    1: '/companies/new?onboardingStatusTypes=1',
    2: '/companies/new?onboardingStatusTypes=2',
    3: '/companies/new?onboardingStatusTypes=3',
    4: '/companies/new?onboardingStatusTypes=4',
    6: '/companies/all?onboardingStatusTypes=6',
    7: '/companies/all?onboardingStatusTypes=7',
    9: '/companies/all?onboardingStatusTypes=9',
    11: '/companies/all?onboardingStatusTypes=11',
    13: '/companies/all?onboardingStatusTypes=13',
    14: '/companies/all?onboardingStatusTypes=14',
    17: '/companies/all?onboardingStatusTypes=17',
    22: '/companies/all?onboardingStatusTypes=22',
  };

  return urlMap[statusType] || '/companies';
};

// New customer cards - matching legacy ScoreDashboard.js layout
export const newCustomerCards: StatusCardConfig[] = [
  {
    id: 'routerNavigate1',
    title: 'Evrak / Entegratör Bağlama Bekleniyor',
    statusType: 1,
    navigateUrl: '/companies/all?onboardingStatusTypes=1',
  },
  {
    id: 'routerNavigate3',
    title: 'Skorlama Sürecinde',
    statusType: 3,
    navigateUrl: '/companies/all?onboardingStatusTypes=3',
  },
  {
    id: 'routerNavigate4',
    title: 'Limit Bekliyor',
    statusType: 4,
    navigateUrl: '/companies/all?onboardingStatusTypes=4',
  },
  {
    id: 'routerNavigate6',
    title: 'Banka Sürecine Hazır',
    statusType: 6,
    navigateUrl: '/companies/all?onboardingStatusTypes=6',
  },
  {
    id: 'routerNavigate7',
    title: 'Bankada Bekliyor',
    statusType: 7,
    navigateUrl: '/companies/all?onboardingStatusTypes=7',
  },
  {
    id: 'routerNavigate9',
    title: 'Kural Tanımı Bekliyor',
    statusType: 9,
    navigateUrl: '/companies/all?onboardingStatusTypes=9',
  },
];

// Limit increase section cards - matching legacy ScoreDashboard.js layout
export const limitIncreaseCards: StatusCardConfig[] = [
  {
    id: 'routerNavigate11',
    title: 'Limit Artışı Evrak Onayı',
    statusType: 11,
    navigateUrl: '/companies/all?onboardingStatusTypes=11',
  },
  {
    id: 'routerNavigate22',
    title: 'Limit Artış Skorlama',
    statusType: 22,
    navigateUrl: '/companies/all?onboardingStatusTypes=22',
  },
  {
    id: 'routerNavigate17',
    title: 'Limit Artışı Bekliyor',
    statusType: 17,
    navigateUrl: '/companies/all?onboardingStatusTypes=17',
  },
  {
    id: 'routerNavigate13',
    title: 'Banka Limit Artış Sürecine Hazır',
    statusType: 13,
    navigateUrl: '/companies/all?onboardingStatusTypes=13',
  },
  {
    id: 'routerNavigate14',
    title: 'Banka Limit Artış Sürecinde',
    statusType: 14,
    navigateUrl: '/companies/all?onboardingStatusTypes=14',
  },
];

// All dashboard sections configuration
export const dashboardSections: SectionConfig[] = [
  {
    title: 'Yeni Müşteri',
    cards: newCustomerCards,
  },
  {
    title: 'Limit Artış',
    cards: limitIncreaseCards,
  },
];

// Helper function to get count for specific status type
export const getStatusCount = (statusCounts: OnboardingStatusCount[], statusType: number): number => {
  const statusItem = statusCounts.find((status) => status.OnboardingStatusType === statusType);
  return statusItem ? statusItem.Count : 0;
};

// Helper function to format count display
export const formatCount = (count: number): string => {
  return count.toString();
};
