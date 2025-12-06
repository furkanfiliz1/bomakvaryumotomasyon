/**
 * Target Types Type Definitions
 * Defines interfaces for target type entities and API operations
 */

/**
 * Target Type Entity
 * Represents a single target type record
 */
export interface TargetType {
  Id: number;
  Name: string;
  Ratio: number;
  Description: string;
}

/**
 * Create Target Type Request
 * Payload for creating a new target type
 */
export interface CreateTargetTypeRequest {
  Name: string;
  Ratio: number;
  Description: string;
}

/**
 * Target Types List Response
 * Array of target type records returned from the API
 */
export type TargetTypesListResponse = TargetType[];
