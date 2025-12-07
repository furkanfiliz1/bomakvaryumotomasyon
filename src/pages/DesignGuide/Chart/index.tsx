import { Card, Link, styled, useTheme } from '@mui/material';
import DesignGuideHeader from '../_partials/pageHeader';
import { ColumnChart } from '@components';

const DesignGuideMobileChart = () => {
  const theme = useTheme();

  const ChartBox = styled(Card)(() => ({
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
  }));

  const graphicData = [
    {
      name: 'Chart Data',
      data: [902900, 13000, null, null, 30000, null, 50000, 242000, null, null, 230000, 45990],
    },
    {
      name: 'Chart Data-100',
      data: [549800, 52722, 40204, 4837, 5, null, 1400, 100, 136800, 313620, 1839000, null],
    },
  ];

  return (
    <Card sx={{ p: 3 }}>
      <DesignGuideHeader title="Chart" hideMuiLink>
        Chart için{' '}
        <Link href="https://apexcharts.com/react-chart-demos/" target="_blank">
          apexcharts
        </Link>{' '}
        plugini kullanılmaktadır.
      </DesignGuideHeader>
      <ChartBox sx={{ marginBlock: 2 }}>
        <ColumnChart series={graphicData} />
      </ChartBox>
    </Card>
  );
};

export default DesignGuideMobileChart;
