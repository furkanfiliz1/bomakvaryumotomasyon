import { useRef, useState, useLayoutEffect, ReactNode } from 'react';
import { Box, Tooltip } from '@mui/material';

interface OverflowTooltipProps {
  children: ReactNode;
}

const OverflowTooltip = ({ children }: OverflowTooltipProps) => {
  const textRef = useRef<HTMLDivElement>(null);
  const [isOverflowed, setIsOverflowed] = useState(false);

  const checkOverflow = () => {
    const el = textRef.current;
    if (el) {
      const hasOverflow = el.scrollWidth > el.clientWidth;
      setIsOverflowed(hasOverflow);
    }
  };

  // `useLayoutEffect` to avoid visual flicker
  useLayoutEffect(() => {
    checkOverflow();
  }, [children]);

  return (
    <Tooltip title={children} disableHoverListener={!isOverflowed} placement="bottom" arrow>
      <Box
        ref={textRef}
        sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
        {children}
      </Box>
    </Tooltip>
  );
};

export default OverflowTooltip;
