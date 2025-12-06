import { Box, SxProps, Typography, styled, useTheme } from '@mui/material';
import Icon from '../Icon';
import { Variant } from '@mui/material/styles/createTypography';
import { MouseEventHandler, PropsWithChildren, ReactNode } from 'react';
import { IconTypes } from '../Icon/types';

const AlerCardStyled = styled(Box)(() => ({
  padding: '8px 12px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
}));

interface AlertCardProps {
  type: 'warning' | 'info' | 'success' | 'error';
  text?: string | ReactNode;
  sx?: SxProps;
  showIcon?: boolean;
  iconSize?: number;
  variant?: Variant;
  EndComponent?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

const AlertCard = (props: PropsWithChildren<AlertCardProps>) => {
  const {
    type,
    text,
    showIcon = true,
    sx,
    iconSize = 22,
    variant = 'body4',
    children,
    EndComponent = null,
    onClick,
  } = props;
  const theme = useTheme();

  const getDynamicStyles = {
    warning: {
      styles: {
        background: theme.palette.warning[100],
        border: `1px solid ${theme.palette.warning[400]}`,
      },
      iconColor: theme.palette.warning[400],
    },
    info: {
      styles: {
        background: theme.palette.primary[100],
        border: `1px solid ${theme.palette.primary[400]}`,
      },
      iconColor: theme.palette.primary[400],
    },
    error: {
      styles: {
        background: theme.palette.error[100],
        border: `1px solid ${theme.palette.error[400]}`,
      },
      iconColor: theme.palette.error[400],
    },
    success: {
      styles: {
        background: theme.palette.success[100],
        border: `1px solid ${theme.palette.success[400]}`,
      },
      iconColor: theme.palette.success[400],
    },
  };

  const getDynamicIcons = (key: string): keyof typeof IconTypes => {
    switch (key) {
      case 'info':
      case 'warning':
        return 'info-circle';
      case 'success':
        return 'shield-tick';

      default:
        return 'info-circle';
    }
  };

  return (
    <AlerCardStyled onClick={onClick} sx={{ ...getDynamicStyles[type].styles, ...sx }}>
      {showIcon && <Icon icon={getDynamicIcons(type)} size={iconSize} color={getDynamicStyles[type].iconColor} />}
      <Typography sx={{ ml: 1, width: '100%' }} variant={variant} color={theme.palette.dark[800]}>
        {text}
        {children}
      </Typography>
      {EndComponent}
    </AlerCardStyled>
  );
};

export default AlertCard;
