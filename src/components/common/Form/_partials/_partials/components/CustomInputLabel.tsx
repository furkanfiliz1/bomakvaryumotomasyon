import { Button, Icon } from '@components';
import { InputLabel, Tooltip, useTheme } from '@mui/material';
import { FC } from 'react';
import { IconTypes } from 'src/components/common/Icon/types';

interface Props {
  label: string | undefined;
  paddingTop?: number;
  marginBottom?: number;
  tooltipIcon?: keyof typeof IconTypes;
  tooltipText?: string;
}

const CustomInputLabel: FC<Props> = (props) => {
  const theme = useTheme();

  const { label, paddingTop, marginBottom, tooltipIcon = '', tooltipText } = props;
  return label ? (
    <InputLabel
      sx={{
        color: theme.palette.neutral[800],
        fontWeight: 500,
        pt: paddingTop || 0,
        mb: marginBottom || 0.5,
      }}
      shrink
      htmlFor="bootstrap-input">
      {label ?? ''}

      {tooltipIcon && (
        <Tooltip
          title={tooltipText}
          placement="right"
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: theme.palette.grey.A300,
                color: theme.palette.neutral[800],
                fontSize: '12px',
                maxWidth: '200px',
                fontWeight: '400',
                '& .MuiTooltip-arrow': {
                  color: 'blue',
                },
              },
            },
          }}>
          <Button id="tooltipText" sx={{ padding: 0, minWidth: 'auto' }}>
            <Icon icon={tooltipIcon} color={'#94A3B8'} size="18" style={{ marginLeft: '8px' }} />
          </Button>
        </Tooltip>
      )}
    </InputLabel>
  ) : null;
};

export default CustomInputLabel;
