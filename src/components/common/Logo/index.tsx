import { Box } from '@mui/material';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  const logo = (
    <Box sx={{ mt: 1 }}>
      <img src="/assets/logos/logo-black.svg" width="auto" height={30} alt="Figopara Logo" />
    </Box>
  );

  return (
    <Box component={RouterLink} to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
      {logo}
    </Box>
  );
};

export default memo(Logo);
