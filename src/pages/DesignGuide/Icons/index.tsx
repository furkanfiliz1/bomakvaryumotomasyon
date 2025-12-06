import { Box, Card, Grid, TextField, Typography } from '@mui/material';
import { Icon, IconTypes } from '@components';
import DesignGuideHeader from '../_partials/pageHeader';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

const DesignGuideIcons = () => {
  const { enqueueSnackbar } = useSnackbar();

  const iconList = Object.keys(IconTypes).map((icon: string) => icon as keyof typeof IconTypes);
  const [iconData, setIconData] = useState(iconList);

  const onFilter = (icon: string) => {
    if (icon) {
      setIconData(
        iconList.filter((r) => {
          return r.includes(icon);
        }),
      );
    } else {
      setIconData(iconList);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader
        title="Icon"
        hideMuiLink
        figmaLink="https://www.figma.com/design/hf2WVazKBuScaEc9Bp40Fb/%E2%9D%96-Untitled-UI-Icons-%E2%80%93-1%2C100%2B-essential-Figma-icons-(Community)?node-id=181-128951&t=d0deZ8ZpDy7XZur2-0"
      />
      <TextField size="small" sx={{ mb: 2, width: '100%' }} onChange={(e) => onFilter(e.target.value)} />
      <Grid container spacing={2}>
        {iconData.map((icon) => {
          return (
            <Grid
              item
              lg={2}
              md={2}
              sm={4}
              xs={6}
              gap={0}
              sx={{}}
              onClick={() => {
                navigator.clipboard.writeText(icon);
                enqueueSnackbar('Kopyalandı', { variant: 'success' });
              }}
              key={icon}>
              <Box
                sx={{
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  wordBreak: 'break-all',
                  minHeight: '90px',
                  p: 1,
                }}>
                <Icon size={16} icon={icon} />
                <Typography variant="caption" sx={{ mt: 1 }}>
                  {icon}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default DesignGuideIcons;
