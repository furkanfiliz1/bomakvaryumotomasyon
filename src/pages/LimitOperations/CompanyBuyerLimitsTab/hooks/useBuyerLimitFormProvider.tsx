/**
 * Simple form state management for buyer limits
 * Uses React state to share form data between table cell components
 */

import React, { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { BuyerLimitFormData, BuyerLimitItem } from '../company-buyer-limits-tab.types';
import { transformBuyerLimitToFormData } from '../helpers';

interface BuyerLimitFormState {
  [itemId: number]: BuyerLimitFormData;
}

interface BuyerLimitFormContextValue {
  /** Get form data for a specific item */
  getFormData: (itemId: number) => BuyerLimitFormData | undefined;

  /** Set form field value for a specific item */
  setFieldValue: (itemId: number, field: keyof BuyerLimitFormData, value: string | boolean) => void;

  /** Initialize form data for an item */
  initializeFormData: (item: BuyerLimitItem) => void;

  /** Check if item has changes */
  hasChanges: (itemId: number) => boolean;

  /** Get original data */
  getOriginalData: (itemId: number) => BuyerLimitItem | undefined;
}

const BuyerLimitFormContext = createContext<BuyerLimitFormContextValue | null>(null);

interface BuyerLimitFormProviderProps {
  children: ReactNode;
  items: BuyerLimitItem[];
}

export const BuyerLimitFormProvider: React.FC<BuyerLimitFormProviderProps> = ({ children, items }) => {
  const [formState, setFormState] = useState<BuyerLimitFormState>({});
  const [originalData, setOriginalData] = useState<{ [itemId: number]: BuyerLimitItem }>({});

  // Initialize forms when items change
  useEffect(() => {
    const newFormState: BuyerLimitFormState = {};
    const newOriginalData: { [itemId: number]: BuyerLimitItem } = {};

    for (const item of items) {
      newFormState[item.Id] = transformBuyerLimitToFormData(item);
      newOriginalData[item.Id] = item;
    }

    setFormState(newFormState);
    setOriginalData(newOriginalData);
  }, [items]);

  const getFormData = useCallback(
    (itemId: number) => {
      return formState[itemId];
    },
    [formState],
  );

  const setFieldValue = useCallback((itemId: number, field: keyof BuyerLimitFormData, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value,
      },
    }));
  }, []);

  const initializeFormData = useCallback((item: BuyerLimitItem) => {
    const formData = transformBuyerLimitToFormData(item);
    setFormState((prev) => ({
      ...prev,
      [item.Id]: formData,
    }));
    setOriginalData((prev) => ({
      ...prev,
      [item.Id]: item,
    }));
  }, []);

  const hasChanges = useCallback(
    (itemId: number) => {
      const current = formState[itemId];
      const original = originalData[itemId];

      if (!current || !original) return false;

      const originalForm = transformBuyerLimitToFormData(original);
      return (
        current.maxInvoiceAmount !== originalForm.maxInvoiceAmount ||
        current.maxInvoiceDueDay !== originalForm.maxInvoiceDueDay ||
        current.isActive !== originalForm.isActive
      );
    },
    [formState, originalData],
  );

  const getOriginalData = useCallback(
    (itemId: number) => {
      return originalData[itemId];
    },
    [originalData],
  );

  const contextValue: BuyerLimitFormContextValue = useMemo(
    () => ({
      getFormData,
      setFieldValue,
      initializeFormData,
      hasChanges,
      getOriginalData,
    }),
    [getFormData, setFieldValue, initializeFormData, hasChanges, getOriginalData],
  );

  return <BuyerLimitFormContext.Provider value={contextValue}>{children}</BuyerLimitFormContext.Provider>;
};

export const useBuyerLimitFormContext = () => {
  const context = useContext(BuyerLimitFormContext);
  if (!context) {
    throw new Error('useBuyerLimitFormContext must be used within BuyerLimitFormProvider');
  }
  return context;
};
