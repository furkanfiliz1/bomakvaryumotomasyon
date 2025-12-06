import React from 'react';

/**
 * Table slot components for Integrator Consensus table
 * Following plain text display pattern for boolean values
 */

interface ConnectionStatusSlotProps {
  isConnected: boolean | null;
}

export const ConnectionStatusSlot: React.FC<ConnectionStatusSlotProps> = ({ isConnected }) => {
  // Following legacy logic exactly:
  // null -> "-"
  // true -> "Evet"
  // false -> "Hayır"
  if (isConnected === null) {
    return <span>-</span>;
  }

  const label = isConnected ? 'Evet' : 'Hayır';

  return <span>{label}</span>;
};
