import { Box } from '@mui/system';
import { ReactNode } from 'react';
export interface SlotProps<T> {
  id: string;
  children: (item?: string | number, row?: T, index?: number) => ReactNode;
}

const Slot = <T,>(props: SlotProps<T>) => {
  const { id, children } = props;

  return <Box id={id}>{children()}</Box>;
};

export default Slot;
