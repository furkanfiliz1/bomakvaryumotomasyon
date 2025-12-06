/**
 * Application Channel Type Definitions
 * Matches legacy ReferralChannel.js exactly
 */

/**
 * Application Channel item from GET /applicationChannel response
 */
export interface ApplicationChannelItem {
  Id: number;
  Name: string;
}

/**
 * Create application channel request payload for POST /applicationChannel
 */
export interface CreateApplicationChannelRequest {
  Name: string;
}

/**
 * Update application channel request payload for PUT /applicationChannel/{id}
 */
export interface UpdateApplicationChannelRequest {
  Id: number;
  Name: string;
}

/**
 * Form data for create application channel form
 */
export interface ApplicationChannelFormData {
  Name: string;
}
