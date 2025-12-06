import { Box, Card, Typography, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';

const DesignGuideFont = () => {
  const theme = useTheme();

  const FontBox = styled(Box)(() => ({
    padding: theme.spacing(1),
    borderBottom: '1px solid #eee',
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Font" muiLink="https://mui.com/material-ui/react-typography/" />
      <FontBox>
        <Typography variant="h1"> H1 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h2"> H2 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h3"> H3 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h4"> H4 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h5"> H5 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h6"> H6 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="h5"> H7 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="body1"> BODY1 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="body2"> BODY2 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="body2"> BODY4 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="body5"> BODY5 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="body6"> BODY6 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="button"> BUTTON - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="caption"> CAPTION - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="cell"> CELL - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="subtitle1"> SUBTITLE1 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
      <FontBox>
        <Typography variant="subtitle2"> SUBTITLE2 - Lorem Ipsum is simply dummy text of the pri</Typography>
      </FontBox>
    </Card>
  );
};

export default DesignGuideFont;
