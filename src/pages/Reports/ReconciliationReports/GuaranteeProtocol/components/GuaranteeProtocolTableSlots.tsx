import { Button } from '@mui/material';
import { saveAs } from 'file-saver';
import React from 'react';
import { useDownloadGuaranteeProtocolFileMutation } from '../guarantee-protocol.api';
import type { GuaranteeProtocolTableRow } from '../guarantee-protocol.types';
import { generatePdfFilename } from '../helpers';

/**
 * Table slot components for Guarantee Protocol
 * Handles custom rendering for download button following OperationPricing pattern
 */

interface DownloadActionSlotProps {
  item: GuaranteeProtocolTableRow;
}

export const DownloadActionSlot: React.FC<DownloadActionSlotProps> = ({ item }) => {
  const [downloadFile, { isLoading: isDownloading }] = useDownloadGuaranteeProtocolFileMutation();

  const handleDownload = async () => {
    try {
      const result = await downloadFile({
        Date: item.Date,
        FinancerIdentifier: item.FinancerIdentifier,
        SenderIdentifier: item.SenderIdentifier,
      }).unwrap();

      // Convert ArrayBuffer to Blob and download using fileSaver
      const blob = new Blob([result], { type: 'application/pdf' });
      const filename = generatePdfFilename(item.SenderIdentifier, item.FinancerIdentifier, item.Date);

      saveAs(blob, filename);
    } catch (error) {
      console.error('Download failed:', error);
      // TODO: Add toast notification for error handling following OperationPricing pattern
    }
  };

  return (
    <Button variant="contained" size="small" onClick={handleDownload} disabled={isDownloading} sx={{ minWidth: 100 }}>
      {isDownloading ? 'İndiriliyor...' : 'İndir'}
    </Button>
  );
};

// Export as namespace following OperationPricing pattern
export const GuaranteeProtocolTableSlots = {
  DownloadActionSlot,
};
