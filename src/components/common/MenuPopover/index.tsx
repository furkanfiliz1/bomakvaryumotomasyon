import { Popover, PopoverProps, SxProps } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { FC, ReactNode, memo } from 'react';

const ArrowStyle = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    top: -7,
    zIndex: 1,
    width: 12,
    right: 20,
    height: 12,
    content: "''",
    position: 'absolute',
    borderRadius: '0 0 4px 0',
    transform: 'rotate(-135deg)',
    background: theme.palette.background.paper,
    borderRight: `solid 1px ${alpha(theme.palette.neutral[500], 0.12)}`,
    borderBottom: `solid 1px ${alpha(theme.palette.neutral[500], 0.12)}`,
  },
}));

interface Props extends PopoverProps {
  children?: ReactNode | ReactNode[];
  sx?: SxProps;
  open: boolean;
  onClose: () => void;
  arrow?: string;
}

const MenuPopover: FC<Props> = (props) => {
  const { children, open, onClose, ...other } = props;

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      {...other}>
      <ArrowStyle className="arrow" />

      {children}
    </Popover>
  );
};

export default memo(MenuPopover);
