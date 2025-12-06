/**
 * Company Score Info Component
 * Now simply renders the CompanyYearlyScores component matching legacy design
 */

import React from 'react';

import type { CompanyScoreInfoProps } from '../company-score-tab.types';
import { CompanyYearlyScores } from './CompanyYearlyScores';

export const CompanyScoreInfo: React.FC<CompanyScoreInfoProps> = ({ companyId }) => {
  return <CompanyYearlyScores companyId={companyId} />;
};
