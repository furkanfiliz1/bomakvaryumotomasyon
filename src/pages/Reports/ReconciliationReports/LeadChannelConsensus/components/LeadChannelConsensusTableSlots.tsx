import React from 'react';

/**
 * Table slot components for Lead Channel Consensus table
 * Following IntegratorConsensus slot pattern for boolean display
 */

interface ConnectionStatusSlotProps {
  isConnected: boolean | null | undefined;
}

export const ConnectionStatusSlot: React.FC<ConnectionStatusSlotProps> = ({ isConnected }) => {
  // Following legacy logic exactly:
  // null/undefined -> "-"
  // true -> "Evet"
  // false -> "Hayır"
  if (isConnected === null || isConnected === undefined) {
    return <span>-</span>;
  }

  const label = isConnected ? 'Evet' : 'Hayır';

  return <span>{label}</span>;
};
