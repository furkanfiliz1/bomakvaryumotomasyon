import { Box } from '@mui/material';
import { memo } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Logo = () => {
  const logo = (
    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img src="/assets/logos/logo.png" width="auto" height={90} alt="Bom Akvaryum Logo" />
    </Box>
  );

  return (
    <Box
      component={RouterLink}
      to="/"
      style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
      {logo}
    </Box>
  );
};

export default memo(Logo);
