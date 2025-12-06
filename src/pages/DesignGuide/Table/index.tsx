import { Card, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { Table } from '@components';

const DesignGuideTable = () => {
  const theme = useTheme();

  const LoadingBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const header = [
    { id: 'name', label: 'Ad' },
    { id: 'position', label: 'Bölüm' },
  ];

  const data = [
    {
      name: 'John',
      position: 'Backend Developer',
    },
    {
      name: 'James',
      position: 'Frontend Developer',
    },
  ];

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Table" muiLink="https://mui.com/material-ui/react-progress/" hideFigmaLink />
      <LoadingBox>
        <Table checkbox={true} rowId="name" headers={header} data={data} id="Table" />
      </LoadingBox>
    </Card>
  );
};

export default DesignGuideTable;
