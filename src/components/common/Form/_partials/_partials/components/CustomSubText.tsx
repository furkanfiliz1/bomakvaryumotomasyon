import { Box, FormHelperText, useTheme } from '@mui/material';
import { FC } from 'react';

interface Props {
  text: string | undefined;
  id: string;
}

const CustomSubText: FC<Props> = (props) => {
  const { text, id } = props;
  const theme = useTheme();

  if (!text) return;

  return (
    <Box id={id} sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
      <FormHelperText sx={{ color: theme.palette.grey[400], mt: '-1.2px', fontSize: '12px' }}>{text}</FormHelperText>
    </Box>
  );
};

export default CustomSubText;
