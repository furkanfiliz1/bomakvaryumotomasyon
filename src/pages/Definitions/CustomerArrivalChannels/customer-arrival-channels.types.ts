export interface LeadingChannel {
  Id: number;
  Value: string;
  Rate: number | null;
  IsConsensus: boolean;
}

export interface LeadingChannelCreateRequest {
  value: string;
  rate: number | null;
  isConsensus: string; // API expects string "true"/"false"
}

export interface LeadingChannelUpdateRequest {
  Id: number;
  Value: string;
  Rate: number | null;
  IsConsensus: boolean;
}

export interface LeadingChannelFilters {
  value?: string;
  rate?: number | null;
  isConsensus?: boolean | null;
}

// Dropdown option for IsConsensus
export interface ConsensusOption {
  label: string;
  value: string; // "true" or "false"
}
