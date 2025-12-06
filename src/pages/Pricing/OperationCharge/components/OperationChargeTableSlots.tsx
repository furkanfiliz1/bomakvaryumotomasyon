import EditIcon from '@mui/icons-material/Edit';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import React from 'react';
import {
  translateOperationChargeDefinitionType,
  translateProductTypeName,
  truncateWithTooltip,
} from '../helpers/table-config.helpers';
import { OperationCharge } from '../operation-charge.types';

interface OperationChargeTableSlotsProps {
  row: OperationCharge;
  onUpdate?: (id: number) => void;
}

export const ReceiverNameSlot: React.FC<{ row: OperationCharge }> = ({ row }) => {
  // Handle empty/null ReceiverName with "Tüm Alıcılar" fallback matching legacy
  const receiverName = row.ReceiverName ?? 'Tüm Alıcılar';
  const { text, showTooltip, fullText } = truncateWithTooltip(receiverName, 14);

  return (
    <Box>
      {showTooltip ? (
        <Tooltip title={fullText} arrow>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            {text}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2">{text}</Typography>
      )}
      {row.ReceiverIdentifier && (
        <Typography variant="caption" color="text.secondary">
          {row.ReceiverIdentifier}
        </Typography>
      )}
    </Box>
  );
};

export const SenderNameSlot: React.FC<{ row: OperationCharge }> = ({ row }) => {
  // Handle empty/null SenderName with "Tüm Satıcılar" fallback matching legacy
  const senderName = row.SenderName ?? 'Tüm Satıcılar';
  const { text, showTooltip, fullText } = truncateWithTooltip(senderName, 14);

  return (
    <Box>
      {showTooltip ? (
        <Tooltip title={fullText} arrow>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            {text}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2">{text}</Typography>
      )}
      {row.SenderIdentifier && (
        <Typography variant="caption" color="text.secondary">
          {row.SenderIdentifier}
        </Typography>
      )}
    </Box>
  );
};

export const FinancerNameSlot: React.FC<{ row: OperationCharge }> = ({ row }) => {
  // Handle empty/null FinancerName with "Tüm Finansörler" fallback matching legacy
  const financerName = row.FinancerName ?? 'Tüm Finansörler';
  const { text, showTooltip, fullText } = truncateWithTooltip(financerName, 20);

  return (
    <Box>
      {showTooltip ? (
        <Tooltip title={fullText} arrow>
          <Typography variant="body2" sx={{ cursor: 'pointer' }}>
            {text}
          </Typography>
        </Tooltip>
      ) : (
        <Typography variant="body2">{text}</Typography>
      )}
      {row.FinancerIdentifier && (
        <Typography variant="caption" color="text.secondary">
          {row.FinancerIdentifier}
        </Typography>
      )}
    </Box>
  );
};

export const ProductTypeSlot: React.FC<{ row: OperationCharge }> = ({ row }) => {
  const productTypeName = translateProductTypeName(row.ProductType);
  return <Typography variant="body2">{productTypeName ?? '-'}</Typography>;
};

export const OperationChargeDefinitionTypeSlot: React.FC<{ row: OperationCharge }> = ({ row }) => {
  return (
    <Typography variant="body2">{translateOperationChargeDefinitionType(row.OperationChargeDefinitionType)}</Typography>
  );
};

export const ActionsSlot: React.FC<OperationChargeTableSlotsProps> = ({ row, onUpdate }) => {
  return (
    <Button size="small" variant="outlined" startIcon={<EditIcon />} onClick={() => onUpdate?.(row.Id)}>
      Güncelle
    </Button>
  );
};
