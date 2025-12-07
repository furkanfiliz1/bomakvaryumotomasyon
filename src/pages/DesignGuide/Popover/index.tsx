import { Box, Card, Divider, Grid, Typography, useTheme } from '@mui/material';
import { Button, MenuPopover } from '@components';
import { useRef, useState } from 'react';
import { useResponsive } from '@hooks';
import DesignGuideHeader from '../_partials/pageHeader';

const DesignGuidePopover = () => {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Popover" muiLink="https://mui.com/material-ui/react-popover/" />
      <Box sx={{ borderRight: `1px solid${theme.palette.grey.A300}`, display: 'flex', justifyContent: 'center' }}>
        <Button id="openPopover" onClick={handleOpen} ref={anchorRef} variant="contained">
          Popover Aç
        </Button>
      </Box>

      <MenuPopover open={Boolean(open)} anchorEl={anchorRef.current} onClose={handleClose}>
        <Box sx={{ width: smDown ? '100%' : '600px' }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <Typography variant="body1" sx={{ fontSize: '20px', fontWeight: 500 }}>
                Deneme 1
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Grid container alignItems="center" sx={{ p: 2 }}>
            <Grid item lg={12}>
              <Box>
                <Typography variant="body5">deneme</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </MenuPopover>
    </Card>
  );
};

export default DesignGuidePopover;
