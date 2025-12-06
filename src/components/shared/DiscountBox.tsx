import { Box, Typography, useTheme } from '@mui/material';
import { useMemo } from 'react';

interface DiscountBoxProps {
  paymentAmount: number;
  discountAmount: number;
}
export const DiscountBox = (props: DiscountBoxProps) => {
  const { paymentAmount, discountAmount } = props;
  const theme = useTheme();

  const discountRate = useMemo(() => {
    const rate = (Number(discountAmount) * 100) / Number(paymentAmount);
    const rateText = rate.toString().substring(0, 5);
    return rateText;
  }, [paymentAmount, discountAmount]);

  return (
    <Box
      height={19}
      alignItems={'center'}
      display={'flex'}
      border={`1px solid ${theme.palette.success[700]}`}
      borderRadius={1}
      padding={'6px 5px'}
      width={'fit-content'}
      minWidth={38}
      sx={{
        background: theme.palette.success.background100,
      }}>
      <Typography
        color={theme.palette.success[700]}
        fontSize={11}
        fontWeight={600}
        textAlign={'center'}
        lineHeight={'20px'}>
        {`-%${discountRate}`}
      </Typography>
    </Box>
  );
};
