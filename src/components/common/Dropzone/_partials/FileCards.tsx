import { Icon } from '@components';
import { Box, Card, Typography, styled, useTheme } from '@mui/material';

const FileCardStyle = styled(Card)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '8px 16px',
  minHeight: 106,
}));

interface FileCardProps {
  file: File | null;
  onDelete: () => void;
  disabled: boolean;
}

const FileCards = (props: FileCardProps) => {
  const { file, onDelete, disabled } = props;
  const theme = useTheme();

  if (!file) return null;

  return (
    <Box sx={{ mt: 2, minHeight: 106 }}>
      <FileCardStyle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <img src="/assets/icons/success.png" width={35} height={44} alt="success" />
          <Box sx={{ display: 'flex', flexDirection: 'column', ml: 2 }}>
            <Typography
              variant="subtitle2"
              sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: 250 }}>
              {file?.name}
            </Typography>
            {(file?.size / 1000).toFixed(2)} Kb
          </Box>
        </Box>
        <Icon
          onClick={() => !disabled && onDelete()}
          cursor="pointer"
          icon="x-close"
          width={18}
          height={18}
          color={theme.palette.common.black}
        />
      </FileCardStyle>
    </Box>
  );
};

export default FileCards;
