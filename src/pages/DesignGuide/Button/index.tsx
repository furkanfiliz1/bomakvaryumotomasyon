import { Card, styled, useTheme, Typography, Alert, Box } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Button, LoadingButton } from '@components';

const DesignGuideButton = () => {
  const theme = useTheme();

  const ButtonCard = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const ButtonCardTitle = styled(Typography)(() => ({
    marginBottom: theme.spacing(1),
  }));

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Button" muiLink="https://mui.com/material-ui/react-button/" />
      <ButtonCard>
        <ButtonCardTitle>Contained</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1, mb: 1}}>
          <Button id="primaryContained" variant='contained' color='primary'>
            Primary
          </Button>

          <Button id="errorContained" variant='contained' color='error'>
            Error
          </Button>
          <Button id="warningContained" variant='contained' color='warning'>
            Warning
          </Button>
          <Button id="successContained" variant='contained' color='success'>
            Success
          </Button>
          <Button id="secondaryContained" variant='contained' color='secondary'>
            Secondary
          </Button>
        </Box>
        <ButtonCardTitle> Disabled</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1}}>
          <Button id="disabledPrimaryContained" variant='contained' color='primary' disabled>
            Primary
          </Button>
          <Button id="disabledErrorContained" variant='contained' color='error' disabled>
            Error
          </Button>
          <Button id="disabledWarningContained" variant='contained' color='warning' disabled>
            Warning
          </Button>
          <Button id="disabledSuccessContained" variant='contained' color='success' disabled>
            Success
          </Button>
          <Button id="disabledSecondaryContained" variant='contained' color='secondary' disabled>
            Secondary
          </Button>
        </Box>
      </ButtonCard>
      <ButtonCard>
        <ButtonCardTitle>Outlined</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1, mb: 1}}>
          <Button id="primaryContained" variant='outlined' color='primary'>
            Primary
          </Button>

          <Button id="errorContained" variant='outlined' color='error'>
            Error
          </Button>
          <Button id="warningContained" variant='outlined' color='warning'>
            Warning
          </Button>
          <Button id="successContained" variant='outlined' color='success'>
            Success
          </Button>
          <Button id="secondaryContained" variant='outlined' color='secondary'>
            Secondary
          </Button>
        </Box>
        <ButtonCardTitle> Disabled</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1}}>
          <Button id="disabledPrimaryContained" variant='outlined' color='primary' disabled>
            Primary
          </Button>
          <Button id="disabledErrorContained" variant='outlined' color='error' disabled>
            Error
          </Button>
          <Button id="disabledWarningContained" variant='outlined' color='warning' disabled>
            Warning
          </Button>
          <Button id="disabledSuccessContained" variant='outlined' color='success' disabled>
            Success
          </Button>
          <Button id="disabledSecondaryContained" variant='outlined' color='secondary' disabled>
            Secondary
          </Button>
        </Box>
      </ButtonCard>
      <ButtonCard>
        <ButtonCardTitle>Text</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1, mb: 1}}>
          <Button id="primaryContained" variant='text' color='primary'>
            Primary
          </Button>

          <Button id="errorContained" variant='text' color='error'>
            Error
          </Button>
          <Button id="warningContained" variant='text' color='warning'>
            Warning
          </Button>
          <Button id="successContained" variant='text' color='success'>
            Success
          </Button>
          <Button id="secondaryContained" variant='text' color='secondary'>
            Secondary
          </Button>
        </Box>
        <ButtonCardTitle> Disabled</ButtonCardTitle>
        <Box sx={{ display:'flex', gap: 1}}>
          <Button id="disabledPrimaryContained" variant='text' color='primary' disabled>
            Primary
          </Button>
          <Button id="disabledErrorContained" variant='text' color='error' disabled>
            Error
          </Button>
          <Button id="disabledWarningContained" variant='text' color='warning' disabled>
            Warning
          </Button>
          <Button id="disabledSuccessContained" variant='text' color='success' disabled>
            Success
          </Button>
          <Button id="disabledSecondaryContained" variant='text' color='secondary' disabled>
            Secondary
          </Button>
        </Box>
      </ButtonCard> 
      <ButtonCard>
        <DesignGuideHeader title="Loading Button" muiLink="https://mui.com/material-ui/api/loading-button/" />
        <Alert variant='filled' color='warning' severity='warning'  sx={{ mb : 2}} >
          Burada tasarımdan bağımsız bir şekilde loading button bu şekilde ilerlenmiş. Tasarıma uyalım mı konuşulması lazım.
        </Alert>  
         <LoadingButton
          id="CREATE_REQUEST"
          loading={true}
          disabled={true}
          variant="contained">
          Loading Button
        </LoadingButton>
      </ButtonCard>
    </Card>
  );
};

export default DesignGuideButton;
