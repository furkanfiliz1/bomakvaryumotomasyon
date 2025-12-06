import { Box, Card, Grid, Typography, useTheme } from '@mui/material';
import palette from 'src/theme/palette';
import DesignGuideHeader from '../_partials/pageHeader';

const DesignGuidePalette = () => {
  interface IPaletteList {
    900: string;
    800: string;
    700: string;
    600?: string;
    500?: string;
    400?: string;
    300?: string;
    200?: string;
    100?: string;
  }

  const theme = useTheme();

  const { success, neutral, error, primary, dark, warning } = palette;

  const paletteList = [
    {
      name: 'success',
      orjinalList: success,
      list: Object.keys(success) as unknown as Array<keyof IPaletteList>,
    },

    {
      name: 'primary',
      orjinalList: primary,
      list: Object.keys(primary) as unknown as Array<keyof IPaletteList>,
    },
    {
      name: 'error',
      orjinalList: error,
      list: Object.keys(error) as unknown as Array<keyof IPaletteList>,
    },
    {
      name: 'dark',
      orjinalList: dark,
      list: Object.keys(dark) as unknown as Array<keyof IPaletteList>,
    },
    {
      name: 'warning',
      orjinalList: warning,
      list: Object.keys(warning) as unknown as Array<keyof IPaletteList>,
    },

    {
      name: 'neutral',
      orjinalList: neutral,
      list: Object.keys(neutral) as unknown as Array<keyof IPaletteList>,
    },
  ];

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader muiLink="https://mui.com/material-ui/customization/color/" title="Renk Paleti" />
      <Grid container spacing={2}>
        {paletteList.map((listItem) => {
          return (
            <Grid key={listItem.name} item md={3} sm={4} xs={12}>
              <Card sx={{ p: 2, height: '100%' }}>
                <Typography sx={{ textTransform: 'capitalize', p: 1 }}> {listItem.name}</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column-reverse' }}>
                  {listItem.list.map((color) => {
                    return (
                      <Box display="flex" key={color}>
                        <Box
                          key={color}
                          sx={{
                            backgroundColor: color && listItem.orjinalList[color],
                            width: '50px',
                            height: '50px',
                            flex: '0 0 50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 3,
                            mb: 2,
                          }}></Box>
                        <Box sx={{ ml: 1 }}>
                          <Typography
                            component="div"
                            variant="body5"
                            fontWeight={500}
                            sx={{ textTransform: 'capitalize' }}>
                            {`${listItem.name} ${color}`}
                          </Typography>
                          <Typography variant="caption" color={theme.palette.neutral[500]}>
                            {color && listItem.orjinalList[color]}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Card>
  );
};

export default DesignGuidePalette;
