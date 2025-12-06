import { LoadingButton, LoadingButtonProps } from '@mui/lab';
import { PropsWithChildren, forwardRef } from 'react';

interface Props extends LoadingButtonProps {
  id: string;
}

const CustomLoadingButton = forwardRef<HTMLButtonElement, PropsWithChildren<Props>>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <LoadingButton ref={ref} {...rest}>
      {children}
    </LoadingButton>
  );
});

CustomLoadingButton.displayName = 'LoadingButton';

export default CustomLoadingButton;
