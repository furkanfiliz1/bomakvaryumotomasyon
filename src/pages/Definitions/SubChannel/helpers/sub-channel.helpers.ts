/**
 * Sub Channel Helper Functions
 * Validation and utility functions for sub channel operations
 */

/**
 * Validates if sub channel name is not empty
 * @param name - Sub channel name to validate
 * @returns true if name is valid, false otherwise
 */
export const isValidSubChannelName = (name: string | undefined | null): boolean => {
  return Boolean(name && name.trim().length > 0);
};

/**
 * Validates if channel is selected
 * @param channelId - Channel ID to validate
 * @returns true if channel is selected, false otherwise
 */
export const isValidChannelSelection = (channelId: string | number | undefined | null): boolean => {
  return Boolean(channelId && channelId !== '' && channelId !== 0);
};

/**
 * Validates if a sub channel can be saved
 * @param name - Sub channel name
 * @param channelId - Channel ID
 * @returns true if the sub channel data is valid for save
 */
export const canSaveSubChannel = (
  name: string | undefined | null,
  channelId: string | number | undefined | null,
): boolean => {
  return isValidSubChannelName(name) && isValidChannelSelection(channelId);
};

/**
 * Formats sub channel name for display (trims whitespace)
 * @param name - Sub channel name
 * @returns Formatted name or empty string
 */
export const formatSubChannelName = (name: string | undefined | null): string => {
  return name?.trim() ?? '';
};
