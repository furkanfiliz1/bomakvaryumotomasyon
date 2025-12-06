import { Box, Typography, useTheme } from '@mui/material';
import { AllowanceStatus } from '@store';
import { AllowanceFinancerStatusEnum, AllowanceStatusEnum } from '@types';
import { FC } from 'react';

interface Props {
  status?: AllowanceStatus;
  statusDesc?: string | number | null;
  onClick?: () => void;
}

export const AllowanceStatusDecriptionCell: FC<Props> = (props) => {
  const { status, statusDesc, onClick } = props;
  const theme = useTheme();

  const getStatusColor = (status?: AllowanceStatus) => {
    switch (status as AllowanceStatusEnum | AllowanceFinancerStatusEnum) {
      case AllowanceStatusEnum.TeklifSurecinde:
      case AllowanceStatusEnum.YetkiliOnayBekliyor:
      case AllowanceStatusEnum.AliciSonOnayiBekliyor:
      case AllowanceStatusEnum.AlıcıIlkOnyBekliyor:
      case AllowanceStatusEnum.FaturaDogrulamaBekliyor:
      case AllowanceStatusEnum.FinansAsamasi:
      case AllowanceFinancerStatusEnum.FinansAsamasi:
      case AllowanceFinancerStatusEnum.TeklifBekliyor:
      case AllowanceFinancerStatusEnum.TeklifOnayiBekliyor:
      case AllowanceFinancerStatusEnum.TeklifVerildi:
        return theme.palette.primary[300];

      case AllowanceStatusEnum.YetkiliOnayiRedEdildi:
      case AllowanceStatusEnum.AliciIlkOnayRed:
      case AllowanceStatusEnum.AliciSonOnayRed:
      case AllowanceStatusEnum.IptalEdildi:
      case AllowanceStatusEnum.ZamanAsimi:
      case AllowanceStatusEnum.FinansSirketiGeriCekildi:
      case AllowanceStatusEnum.FinansSirketiIptalEtti:
      case AllowanceFinancerStatusEnum.TeklifIptalEdildi:
      case AllowanceFinancerStatusEnum.TeklifRedEdildi:
      case AllowanceFinancerStatusEnum.SonOnayRed:
      case AllowanceFinancerStatusEnum.Kaybedildi:
      case AllowanceFinancerStatusEnum.IptalEdildi:
      case AllowanceFinancerStatusEnum.FinansSirketiGeriCekildi:
      case AllowanceFinancerStatusEnum.ZamanAsimi:
        return theme.palette.error[400];
      case AllowanceStatusEnum.OdemeAlindi:
      case AllowanceFinancerStatusEnum.OdemeYapıldı:
        return theme.palette.success[400];
      default:
        return theme.palette.primary[300];
    }
  };

  return (
    <Box
      role="button"
      onClick={onClick}
      sx={{
        bgcolor: getStatusColor(status),
        borderRadius: 1,
        px: 1.5,
        py: 0.5,
        minHeight: 24,
        width: 'fit-content',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Typography
        color="black"
        variant="caption"
        sx={{
          fontSize: '11px',
          fontWeight: 500,
          lineHeight: 1,
          whiteSpace: 'nowrap',
        }}>
        {statusDesc}
      </Typography>
    </Box>
  );
};
