/**
 * Application Channel Helper Functions
 * Validation and utility functions for application channel operations
 */

/**
 * Validates if application channel name is not empty
 * @param name - Application channel name to validate
 * @returns true if name is valid, false otherwise
 */
export const isValidApplicationChannelName = (name: string | undefined | null): boolean => {
  return Boolean(name && name.trim().length > 0);
};

/**
 * Validates if an application channel can be saved
 * @param name - Application channel name
 * @returns true if the application channel data is valid for save
 */
export const canSaveApplicationChannel = (name: string | undefined | null): boolean => {
  return isValidApplicationChannelName(name);
};

/**
 * Formats application channel name for display (trims whitespace)
 * @param name - Application channel name
 * @returns Formatted name or empty string
 */
export const formatApplicationChannelName = (name: string | undefined | null): string => {
  return name?.trim() ?? '';
};
