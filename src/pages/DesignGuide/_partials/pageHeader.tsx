import { Alert, Divider, Typography, Link } from '@mui/material';
import { FC, ReactNode } from 'react';

interface DesignGuideHeaderProps {
  title: string;
  muiLink?: string;
  figmaLink?: string;
  hideMuiLink?: boolean;
  children?: ReactNode | ReactNode[];
}

const DesignGuideHeader: FC<DesignGuideHeaderProps> = ({ title, muiLink, hideMuiLink = false, children }) => {
  return (
    <>
      <Typography variant="h5" color={'black'} fontWeight={500}>
        {title}
      </Typography>
      <Divider sx={{ marginBlock: 2 }} />
      <Alert variant="filled" color="info" severity="info" sx={{ mb: 2, alignItems: 'center' }}>
        {children && children}

        {!hideMuiLink && (
          <>
            Component&rsquo;in api sistemini detaylı bir şekilde inceleme için&nbsp;&nbsp;
            <Link href={muiLink} target="_blank">
              Material Ui Linki
            </Link>{' '}
            <br />
          </>
        )}
      </Alert>
    </>
  );
};

export default DesignGuideHeader;
