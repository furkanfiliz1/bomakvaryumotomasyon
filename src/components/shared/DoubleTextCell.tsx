import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import OverflowTooltip from '../OverflowTooltip';

interface Props {
  primaryText: string;
  secondaryText: string;
  maxWidth?: number;
  primaryFontWeight?: string;
  id: string;
  onClick?: () => void;
}

const DoubleTextCell: FC<Props> = (props) => {
  const { primaryText, secondaryText, maxWidth, primaryFontWeight, id, onClick } = props;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth,
        cursor: onClick ? 'pointer' : 'unset',
        '&:hover': { opacity: onClick ? 0.7 : 'unset' },
        '&:focus, &:active': { opacity: onClick ? 0.5 : 'unset' },
      }}
      id={id}
      onClick={() => {
        onClick && onClick();
      }}>
      <Typography
        id={`${id}-Cell`}
        sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        variant="cell"
        fontWeight={primaryFontWeight || ''}>
        <OverflowTooltip>{primaryText}</OverflowTooltip>
      </Typography>

      <Typography id={`${id}-Caption`} variant="caption">
        {secondaryText}
      </Typography>
    </Box>
  );
};

export default DoubleTextCell;
