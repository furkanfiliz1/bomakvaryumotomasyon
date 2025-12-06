import { SESSION_STORAGE_KEYS } from '../constants';
import type { ParentBranch, ParentCustomer, ParentRequest } from '../customer-request-branch-detail.types';

/**
 * Session Storage Helpers
 * Manages parent data persistence across navigation
 */
export class SessionStorageHelper {
  /**
   * Get parent customer from session storage
   */
  static getParentCustomer(): ParentCustomer | null {
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEYS.PARENT_CUSTOMER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get parent request from session storage
   */
  static getParentRequest(): ParentRequest | null {
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEYS.PARENT_REQUEST);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Get parent branch from session storage
   */
  static getParentBranch(): ParentBranch | null {
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEYS.PARENT_BRANCH);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Set parent customer in session storage
   */
  static setParentCustomer(customer: ParentCustomer): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.PARENT_CUSTOMER, JSON.stringify(customer));
    } catch {
      // Silently fail if session storage is not available
    }
  }

  /**
   * Set parent request in session storage
   */
  static setParentRequest(request: ParentRequest): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.PARENT_REQUEST, JSON.stringify(request));
    } catch {
      // Silently fail if session storage is not available
    }
  }

  /**
   * Set parent branch in session storage
   */
  static setParentBranch(branch: ParentBranch): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEYS.PARENT_BRANCH, JSON.stringify(branch));
    } catch {
      // Silently fail if session storage is not available
    }
  }

  /**
   * Clear all parent data from session storage
   */
  static clearParentData(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.PARENT_CUSTOMER);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.PARENT_REQUEST);
      sessionStorage.removeItem(SESSION_STORAGE_KEYS.PARENT_BRANCH);
    } catch {
      // Silently fail if session storage is not available
    }
  }

  /**
   * Get all parent data from session storage
   */
  static getAllParentData() {
    return {
      parentCustomer: this.getParentCustomer(),
      parentRequest: this.getParentRequest(),
      parentBranch: this.getParentBranch(),
    };
  }
}
