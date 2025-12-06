import { Box, Typography } from '@mui/material';

interface FigoLoadingProps {
  background?: string;
  description?: string;
}

const FigoLoading = ({ background = 'transparent', description }: FigoLoadingProps) => {
  return (
    <Box
      data-testid="figo-loading"
      className="loadingContainer"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: '99999999999',
        width: '100%',
        height: '100%',
        background,
        gap: 2,
      }}>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Box component="span">
          <img src="/assets/icons/favicon.png" alt="loadingLogo1" />
        </Box>
        <Box component="span">
          <img src="/assets/icons/favicon.png" alt="loadingLogo2" />
        </Box>
        <Box component="span">
          <img src="/assets/icons/favicon.png" alt="loadingLogo3" />
        </Box>
      </Box>
      {description && (
        <Typography variant="body1" color="primary" fontWeight="medium">
          {description}
        </Typography>
      )}
    </Box>
  );
};
export default FigoLoading;
