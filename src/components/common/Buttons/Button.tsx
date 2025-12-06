import { Button, ButtonProps } from '@mui/material';
import { PropsWithChildren, forwardRef } from 'react';

interface Props extends ButtonProps {
  id: string;
}

const CustomButton = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <Button ref={ref} {...rest} data-testid="figo-button">
      {children}
    </Button>
  );
});

CustomButton.displayName = 'Button';

export default CustomButton;
