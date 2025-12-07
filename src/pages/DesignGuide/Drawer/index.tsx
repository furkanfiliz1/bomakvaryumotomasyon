import { Card, Typography, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Button, InfoDrawer, InfoDrawerMethods } from '@components';
import { useRef } from 'react';

const DesignGuideDrawer = () => {
  const theme = useTheme();

  const LoadingBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const infoDrawer = useRef<InfoDrawerMethods>(null);

  const handleInfoDrawer = () => {
    infoDrawer?.current?.open();
  };

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Bilgi Penceresi " muiLink="https://mui.com/material-ui/react-drawer/" />
      <LoadingBox>
        <Button id="button" onClick={() => handleInfoDrawer()} variant="contained">
          Bilgi Penceresini aç{' '}
        </Button>
        <InfoDrawer title="Başlık" ref={infoDrawer}>
          <Typography variant="body2">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the standard
            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a
            type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets
            containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker
            including versions of Lorem Ipsum.
          </Typography>
        </InfoDrawer>
      </LoadingBox>
    </Card>
  );
};

export default DesignGuideDrawer;
