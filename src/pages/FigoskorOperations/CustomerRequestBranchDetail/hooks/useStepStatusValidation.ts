import { useCallback, useEffect, useState } from 'react';
import type {
  FigoScoreProFormData,
  FinancialDocument,
  StepStatus,
  StepStatusState,
  UseStepStatusValidationReturn,
} from '../customer-request-branch-detail.types';
import { evaluateAllStepStatuses } from '../helpers';

/**
 * Hook for managing step status validation and updates
 * Handles the complex step validation logic from legacy system
 */
export const useStepStatusValidation = (
  figoScoreData?: FigoScoreProFormData,
  companyDocuments: FinancialDocument[] = [],
): UseStepStatusValidationReturn => {
  const [stepStatuses, setStepStatuses] = useState<StepStatusState>({
    0: 'Başlanmadı',
    1: 'Başlanmadı',
    2: 'Başlanmadı',
    3: 'Başlanmadı',
    4: 'Başlanmadı',
    5: 'Başlanmadı',
    6: 'Başlanmadı',
    7: 'Opsiyonel',
    8: null, // Summary & Approval - no status indicator
  });

  // Update step statuses when data changes
  useEffect(() => {
    const newStatuses = evaluateAllStepStatuses(figoScoreData, companyDocuments);

    const statusMap: StepStatusState = {};
    for (const [index, status] of newStatuses.entries()) {
      statusMap[index] = status;
    }

    // Only update if statuses actually changed to prevent infinite loops
    setStepStatuses((prevStatuses) => {
      const hasChanges = Object.keys(statusMap).some((key) => {
        const index = Number.parseInt(key, 10);
        return prevStatuses[index] !== statusMap[index];
      });

      if (hasChanges) {
        return statusMap;
      }

      return prevStatuses;
    });
  }, [figoScoreData, companyDocuments]);

  // Get status for a specific step
  const getStepStatus = useCallback(
    (stepIndex: number): StepStatus => {
      // Step 8 (Summary & Approval) should never have a status indicator
      if (stepIndex === 8) {
        return null;
      }
      return stepStatuses[stepIndex] || 'Başlanmadı';
    },
    [stepStatuses],
  );

  // Update status for a specific step (for manual updates if needed)
  const updateStepStatus = useCallback((stepIndex: number, status: StepStatus) => {
    setStepStatuses((prev) => ({
      ...prev,
      [stepIndex]: status,
    }));
  }, []);

  return {
    stepStatuses,
    getStepStatus,
    updateStepStatus,
  };
};
