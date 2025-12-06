import { useMemo, useState } from 'react';
import { STEP_DEFINITIONS } from '../constants';
import type { UseStepNavigationReturn } from '../customer-request-branch-detail.types';

/**
 * Hook for managing step navigation state
 * Handles accordion expand/collapse and active step selection
 */
export const useStepNavigation = (): UseStepNavigationReturn => {
  const [activeStep, setActiveStep] = useState<string>('0'); // Default first step open

  // Get steps with current status (will be updated by parent component)
  const steps = useMemo(() => STEP_DEFINITIONS, []);

  return {
    activeStep,
    setActiveStep,
    steps,
  };
};
