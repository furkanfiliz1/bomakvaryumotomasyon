/**
 * User Positions Type Definitions
 * Defines interfaces for user position entities and API operations
 */

/**
 * User Position Entity
 * Represents a single user position record
 */
export interface UserPosition {
  Id: number;
  Name: string;
}

/**
 * Create User Position Request
 * Payload for creating a new user position
 */
export interface CreateUserPositionRequest {
  Name: string;
}

/**
 * Update User Position Request
 * Payload for updating an existing user position
 */
export interface UpdateUserPositionRequest {
  Id: number;
  Name: string;
}

/**
 * User Positions List Response
 * Array of user position records returned from the API
 */
export type UserPositionsListResponse = UserPosition[];
