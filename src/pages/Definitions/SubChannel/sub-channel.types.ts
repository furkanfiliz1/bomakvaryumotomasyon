/**
 * Sub Channel Type Definitions
 * Matches legacy SubChannel.js exactly
 */

/**
 * Sub Channel item from GET /applicationSubChannel response
 */
export interface SubChannelItem {
  Id: number;
  ChannelId: number;
  ChannelName: string;
  Name: string;
}

/**
 * Create sub channel request payload for POST /applicationSubChannel
 */
export interface CreateSubChannelRequest {
  Name: string;
  ChannelId: string;
}

/**
 * Update sub channel request payload for PUT /applicationSubChannel/{id}
 */
export interface UpdateSubChannelRequest {
  Id: number;
  Name: string;
  ChannelId: number;
}

/**
 * Form data for create sub channel form
 */
export interface SubChannelFormData {
  Name: string;
  ChannelId: string;
}
