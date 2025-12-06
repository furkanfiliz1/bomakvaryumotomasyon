/**
 * Customer Acquisition Team Type Definitions
 * Matches legacy CustomerAcquisitionTeam.js exactly
 */

/**
 * Customer Acquisition Team member from GET /trackingTeam response
 */
export interface CustomerAcquisitionTeamMember {
  Id: number;
  Name: string;
}

/**
 * Create team member request payload for POST /trackingTeam
 */
export interface CreateCustomerAcquisitionTeamMemberRequest {
  Name: string;
}

/**
 * Update team member request payload for PUT /trackingTeam/{id}
 */
export interface UpdateCustomerAcquisitionTeamMemberRequest {
  Id: number;
  Name: string;
}

/**
 * Form data for create team member form
 */
export interface CustomerAcquisitionTeamFormData {
  Name: string;
}
