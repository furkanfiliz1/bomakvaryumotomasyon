/**
 * Store type definitions
 * Separated to avoid circular dependencies with API files
 */

// Auth state shape for use in API prepareHeaders
export interface AuthState {
  token: string | null;
}

// Minimal RootState type for API files
// This avoids circular dependency between store and API files
export interface RootStateForApi {
  auth: AuthState;
}
