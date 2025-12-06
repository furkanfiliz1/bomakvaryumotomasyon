import { Alert, Divider, Typography, Link } from '@mui/material';
import { FC, ReactNode } from 'react';

interface DesignGuideHeaderProps {
  title: string;
  muiLink?: string;
  figmaLink?: string;
  hideMuiLink?: boolean;
  hideFigmaLink?: boolean;
  children?: ReactNode | ReactNode[];
}

const DesignGuideHeader: FC<DesignGuideHeaderProps> = ({
  title,
  muiLink,
  figmaLink = 'https://www.figma.com/design/QrgUTe1WYk40yqYeOM3agP/Figopara-Portal-Final-%2F-Design-Kit?node-id=1843-338852&t=jTL3HxWEl3SH9tlb-0',
  hideMuiLink = false,
  hideFigmaLink = false,
  children,
}) => {
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
        {!hideFigmaLink && (
          <>
            Ui kitini incelemek kitini incelemek için -&gt; &nbsp;&nbsp;
            <Link href={figmaLink} target="_blank">
              Figma Link
            </Link>
          </>
        )}
      </Alert>
    </>
  );
};

export default DesignGuideHeader;
