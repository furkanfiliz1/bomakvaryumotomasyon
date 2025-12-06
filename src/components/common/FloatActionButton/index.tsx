import { Fab, FabProps } from '@mui/material';
import { PropsWithChildren, forwardRef } from 'react';

interface Props extends FabProps {
  id: string;
}

const FloatActionButton = forwardRef<typeof Fab, PropsWithChildren<Props>>((props) => {
  const { children, ...rest } = props;

  return <Fab {...rest}>{children}</Fab>;
});

FloatActionButton.displayName = 'FabButton';

export default FloatActionButton;
