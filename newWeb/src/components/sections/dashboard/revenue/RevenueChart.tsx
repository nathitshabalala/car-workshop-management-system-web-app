import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactEChart from 'components/base/ReactEChart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { alpha, SxProps, useTheme } from '@mui/material';
import { BarSeriesOption, TooltipComponentOption, GridComponentOption } from 'echarts';

type RevenueChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  serviceTypes: string[];
  serviceTypeAmounts: number[];
  sx?: SxProps;
};

type ChartOptions = echarts.ComposeOption<BarSeriesOption | TooltipComponentOption | GridComponentOption>;

const RevenueChart = ({
  chartRef,
  serviceTypes,
  serviceTypeAmounts,
  ...rest
}: RevenueChartProps): ReactElement => {
  const theme = useTheme();

  const option: ChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: serviceTypes,
        axisLabel: {
          color: theme.palette.text.secondary,
          interval: 0, // Ensure all labels are displayed
          rotate: 45, // Rotate labels for better visibility
          formatter: (value: string) => {
            return value.length > 10 ? `${value.substring(0, 10)}...` : value; // Shorten long labels
          },
        },
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: theme.palette.text.secondary,
        },
        axisLine: {
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
          },
        },
      },
      series: [
        {
          type: 'bar',
          data: serviceTypeAmounts,
          itemStyle: {
            color: (params) => {
              // Dynamically assign colors for each bar
              return `hsl(${(params.dataIndex * 360) / serviceTypes.length}, 70%, 50%)`;
            },
            borderRadius: 4,
          },
          barWidth: '30%', // Adjust the width of the bars
        },
      ],
    }),
    [theme, serviceTypes, serviceTypeAmounts]
  );

  return <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />;
};

export default RevenueChart;
