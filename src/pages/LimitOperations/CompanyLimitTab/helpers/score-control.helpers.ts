/**
 * Score Control Business Logic
 * Common score validation and control logic for RoofLimit and GuarantorLimit components
 * Matches legacy controlScore functionality exactly
 */

// UseNotice return type - matches @components/useNotice hook return type
type UseNoticeReturn = (params: {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  title?: string | null;
  message?: string | null;
}) => Promise<void>;

export interface ScoreValidationResult {
  canProceed: boolean;
  requiresModal: boolean;
  modalType?: 'notHaveScore' | 'negativeScore';
  activityType?: string;
  warningMessage?: string;
}

export interface ScoreControlConfig {
  creditRiskLoanDecision: number | null | undefined;
  figoScoreLoanDecision: number | null | undefined;
  notice: UseNoticeReturn;
}

export interface ScoreControlCallbacks {
  onAdd?: (activityType?: string, commentText?: string) => Promise<void>;
  onUpdate?: (
    guarantorLimitId?: number,
    detailId?: number,
    activityType?: string,
    commentText?: string,
  ) => Promise<void>;
}

export interface ModalState {
  isOpen: boolean;
  modalType: 'notHaveScore' | 'negativeScore';
  pendingAction: {
    type: 'add' | 'update';
    guarantorLimitId?: number;
    detailId?: number;
  } | null;
}

/**
 * Validates score conditions and returns appropriate action
 * @param config Score configuration with credit risk and figo score decisions
 * @returns Validation result with action instructions
 */
export const validateScore = (config: ScoreControlConfig): ScoreValidationResult => {
  const { creditRiskLoanDecision, figoScoreLoanDecision } = config;
  console.log('Validating scores:', { creditRiskLoanDecision, figoScoreLoanDecision });
  // Case 1: Has credit risk but no figo score
  if (creditRiskLoanDecision !== null && figoScoreLoanDecision === null) {
    return {
      canProceed: false,
      requiresModal: false,
      warningMessage:
        'Figoskordan kredi ver/verme kararı çıkmadığından limit tanımı yapılmamalıdır. Ancak işlem devam ediyor.',
    };
  }

  // Case 2: No scores at all
  if (creditRiskLoanDecision === null && figoScoreLoanDecision === null) {
    return {
      canProceed: false,
      requiresModal: true,
      modalType: 'notHaveScore',
      activityType: '10',
    };
  }

  // Case 3: Negative figo score
  if (figoScoreLoanDecision === 2) {
    return {
      canProceed: false,
      requiresModal: true,
      modalType: 'negativeScore',
      activityType: '11',
    };
  }

  // Case 4: Can proceed
  return { canProceed: true, requiresModal: false };
};

/**
 * Controls score validation and executes appropriate action
 * @param actionType Type of action to perform ('add' or 'update')
 * @param config Score configuration
 * @param callbacks Action callbacks
 * @param modalStateHandlers Modal state management functions
 * @param guarantorLimitId Optional guarantor limit ID for update actions
 * @param detailId Optional detail ID for update actions
 */
export const controlScore = async (
  actionType: 'add' | 'update',
  config: ScoreControlConfig,
  callbacks: ScoreControlCallbacks,
  modalStateHandlers: {
    setModalType: (type: 'notHaveScore' | 'negativeScore') => void;
    setPendingAction: (action: ModalState['pendingAction']) => void;
    setIsModalOpen: (open: boolean) => void;
  },
  guarantorLimitId?: number,
  detailId?: number,
): Promise<void> => {
  const validation = validateScore(config);

  if (!validation.canProceed) {
    if (validation.warningMessage) {
      // Case 1: Has credit risk but no figo score - show warning and continue
      config.notice({
        variant: 'warning',
        title: 'Başarısız',
        message: validation.warningMessage,
      });

      // Continue with the action immediately (legacy behavior)
      if (actionType === 'add' && callbacks.onAdd) {
        await callbacks.onAdd();
      } else if (actionType === 'update' && callbacks.onUpdate && guarantorLimitId && detailId) {
        await callbacks.onUpdate(guarantorLimitId, detailId);
      }
      return;
    }

    if (validation.requiresModal) {
      // Case 2 & 3: No scores or negative score - open modal
      modalStateHandlers.setModalType(validation.modalType!);
      modalStateHandlers.setPendingAction({
        type: actionType,
        guarantorLimitId,
        detailId,
      });
      modalStateHandlers.setIsModalOpen(true);
      return;
    }
  }

  // Case 4: Can proceed directly
  if (actionType === 'add' && callbacks.onAdd) {
    await callbacks.onAdd();
  } else if (actionType === 'update' && callbacks.onUpdate && guarantorLimitId && detailId) {
    await callbacks.onUpdate(guarantorLimitId, detailId);
  }
};

/**
 * Handles modal submission with pending actions
 * @param modalData Data from modal submission
 * @param pendingAction Current pending action
 * @param callbacks Action callbacks
 * @param modalStateHandlers Modal state management functions
 */
export const handleScoreModalSubmit = async (
  modalData: { activityType: string; commentText: string },
  pendingAction: ModalState['pendingAction'],
  callbacks: ScoreControlCallbacks,
  modalStateHandlers: {
    setPendingAction: (action: ModalState['pendingAction']) => void;
    setIsModalOpen: (open: boolean) => void;
  },
): Promise<void> => {
  if (!pendingAction) return;

  const { type, guarantorLimitId, detailId } = pendingAction;

  if (type === 'add' && callbacks.onAdd) {
    await callbacks.onAdd(modalData.activityType, modalData.commentText);
  } else if (type === 'update' && callbacks.onUpdate && guarantorLimitId && detailId) {
    await callbacks.onUpdate(guarantorLimitId, detailId, modalData.activityType, modalData.commentText);
  }

  // Reset modal state
  modalStateHandlers.setPendingAction(null);
  modalStateHandlers.setIsModalOpen(false);
};

/**
 * Handles modal close action
 * @param modalStateHandlers Modal state management functions
 */
export const handleScoreModalClose = (modalStateHandlers: {
  setPendingAction: (action: ModalState['pendingAction']) => void;
  setIsModalOpen: (open: boolean) => void;
}): void => {
  modalStateHandlers.setPendingAction(null);
  modalStateHandlers.setIsModalOpen(false);
};
