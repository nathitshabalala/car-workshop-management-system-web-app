import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactEChart from 'components/base/ReactEChart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { alpha, SxProps, useTheme } from '@mui/material';
import { PieSeriesOption, TooltipComponentOption, GridComponentOption } from 'echarts';

type ServiceStatusDistributionChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  totalServicesByType: { [key: string]: number }; // Change prop name to reflect total services
  sx?: SxProps;
};

type ChartOptions = echarts.ComposeOption<PieSeriesOption | TooltipComponentOption | GridComponentOption>;

const ServiceStatusDistributionChart = ({
  chartRef,
  totalServicesByType,
  ...rest
}: ServiceStatusDistributionChartProps): ReactElement => {
  const theme = useTheme();

  const option: ChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'item',
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: Object.entries(totalServicesByType).map(([type, count]) => ({
            name: type,
            value: count,
          })),
          itemStyle: {
            borderRadius: 4,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: alpha(theme.palette.common.black, 0.5),
            },
          },
        },
      ],
    }),
    [theme, totalServicesByType]
  );

  return <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />;
};

export default ServiceStatusDistributionChart;
