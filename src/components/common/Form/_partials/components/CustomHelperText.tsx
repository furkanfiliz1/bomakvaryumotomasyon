import { Box, FormHelperText, useTheme } from '@mui/material';
import { FC } from 'react';
import { FieldError } from 'react-hook-form';

interface Props {
  error: FieldError | undefined;
  id: string;
}

const CustomHelperText: FC<Props> = (props) => {
  const { error, id } = props;
  const theme = useTheme();

  if (!error?.message) return;

  return (
    <Box id={id} sx={{ display: 'flex', alignItems: 'flex-start', mt: 1 }}>
      <FormHelperText error={false} sx={{ color: theme.palette.error[700], mt: '-1.2px', fontSize: '13px' }}>
        {error ? error.message : null}
      </FormHelperText>
    </Box>
  );
};

export default CustomHelperText;
