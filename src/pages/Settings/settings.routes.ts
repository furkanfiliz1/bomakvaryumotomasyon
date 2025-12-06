import { IRouteObject } from 'src/router';
import SettingsPage from './SettingsPage';

// Import actual components directly to ensure proper resolution
import { SystemHolidaysPage } from './SystemSettings/SystemHolidays/components/SystemHolidaysPage';
import { SectorRatiosPage } from './SystemSettings/SectorRatios/components/SectorRatiosPage';
import { StatusGroupsPage } from './SystemSettings/StatusGroups/components/StatusGroupsPage';
import { SystemPermissionsPage } from './SystemSettings/SystemPermissions/components/SystemPermissionsPage';

import { LanguageOptionsPage } from './LanguageSettings/LanguageOptions/components/LanguageOptionsPage';
import { LanguageTranslationsPage } from './LanguageSettings/LanguageTranslations/components/LanguageTranslationsPage';

import { SsoSettingsPage } from './ApplicationSettings/SsoSettings/components/SsoSettingsPage';
import { SearchValuesPage } from './ApplicationSettings/SearchValues/components/SearchValuesPage';
import { CityDistrictPage } from './ApplicationSettings/CityDistrict/components/CityDistrictPage';
import { AnnouncementsPage } from './ApplicationSettings/Announcements/components/AnnouncementsPage';
import { DesignGuidePage } from './ApplicationSettings/DesignGuide/components/DesignGuidePage';

export const settingsRouter: IRouteObject[] = [
  // Main Settings Landing Page
  {
    path: 'settings',
    Component: SettingsPage,
  },

  // System Settings Routes
  {
    path: 'settings/system-holidays',
    Component: SystemHolidaysPage,
  },
  {
    path: 'settings/sector-ratios',
    Component: SectorRatiosPage,
  },
  {
    path: 'settings/status-groups',
    Component: StatusGroupsPage,
  },
  {
    path: 'settings/system-permissions',
    Component: SystemPermissionsPage,
  },

  // Language Settings Routes
  {
    path: 'settings/language-options',
    Component: LanguageOptionsPage,
  },
  {
    path: 'settings/language-translations',
    Component: LanguageTranslationsPage,
  },

  // Application Settings Routes
  {
    path: 'settings/sso',
    Component: SsoSettingsPage,
  },
  {
    path: 'settings/search-values',
    Component: SearchValuesPage,
  },
  {
    path: 'settings/city-district',
    Component: CityDistrictPage,
  },
  {
    path: 'settings/announcements',
    Component: AnnouncementsPage,
  },
  {
    path: 'settings/design-guide',
    Component: DesignGuidePage,
  },
];
