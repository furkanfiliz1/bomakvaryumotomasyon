import { Visibility } from '@mui/icons-material';
import { Button } from '@mui/material';
import { AllowanceStatusEnum } from '@types';
import { DiscountOperation } from '../discount-operations.types';

interface TableRowActionsProps {
  row?: DiscountOperation;
  onCancelAllowance: (allowanceId: number) => void;
  onBidPayment: (allowanceId: number) => void;
  onViewDetails: (allowanceId: number) => void;
}

/**
 * Table row actions component for discount operations
 */
export const TableRowActions = ({ row, onCancelAllowance, onBidPayment, onViewDetails }: TableRowActionsProps) => {
  if (!row) return null;

  const showCancelButton =
    row.AllowanceStatus !== AllowanceStatusEnum.YetkiliOnayiRedEdildi &&
    row.Status !== AllowanceStatusEnum.AliciIlkOnayRed &&
    row.Status !== AllowanceStatusEnum.IptalEdildi &&
    row.Status !== AllowanceStatusEnum.ZamanAsimi &&
    row.Status !== AllowanceStatusEnum.FinansAsamasi &&
    row.Status !== AllowanceStatusEnum.OdemeAlindi &&
    row.Status !== AllowanceStatusEnum.FinansSirketiGeriCekildi &&
    row.Status !== AllowanceStatusEnum.FinansSirketiIptalEtti;

  const showBidPaymentButton = row.Status === AllowanceStatusEnum.FinansAsamasi && row.IsManualPaymentApproved;

  return (
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
      {showCancelButton && (
        <Button variant="outlined" size="small" color="error" onClick={() => onCancelAllowance(row.Id)}>
          İptal Et
        </Button>
      )}
      {showBidPaymentButton && (
        <Button variant="outlined" size="small" color="primary" onClick={() => onBidPayment(row.Id)}>
          Ödeme Alındı
        </Button>
      )}
      <Button variant="outlined" startIcon={<Visibility />} size="small" onClick={() => onViewDetails(row.Id)}>
        Detay
      </Button>
    </div>
  );
};
