import { currencyFormatter } from '@utils';
import ReactApexChart from 'react-apexcharts';

interface IColumnChart {
  series: Array<{ name: string; data: Array<number | null> }>;
  columnWidth?: string | number;
}

const ColumnChart = (props: IColumnChart) => {
  const { series, columnWidth = '100%' } = props;

  const options = {
    chart: {
      locales: [
        {
          name: 'tr',
          options: {
            toolbar: {
              exportToSVG: 'SVG Olarak İndir',
              exportToPNG: 'PNG Olarak İndir',
              exportToCSV: 'CSV Olarak İndir',
            },
          },
        },
      ],
      defaultLocale: 'tr',
      type: 'bar',
      height: 250,
      toolbar: {
        export: {
          csv: {
            headerCategory: 'Tarih',
          },
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: columnWidth,
        endingShape: 'rounded',
      },
    },

    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: [
        'Ocak',
        'Şubat',
        'Mart',
        'Nisan',
        'Mayıs',
        'Haziran',
        'Temmuz',
        'Ağustos',
        'Eylül',
        'Ekim',
        'Kasım',
        'Aralık',
      ],
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: number) {
          return currencyFormatter(val, 'TRY');
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value: string) => {
          return currencyFormatter(Number(value), 'TRY');
        },
      },
    },
  };

  return (
    <div className="app">
      <div className="row">
        <div id="chart">
          <ReactApexChart options={options as never} series={series} type="bar" height={300} />
        </div>
      </div>
    </div>
  );
};

export default ColumnChart;
