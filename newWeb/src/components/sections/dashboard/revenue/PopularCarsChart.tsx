import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactEChart from 'components/base/ReactEChart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { alpha, SxProps, useTheme } from '@mui/material';
import { BarSeriesOption, TooltipComponentOption, GridComponentOption } from 'echarts';

// Function to generate colors
const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // Generate colors using HSL
  }
  return colors;
}

type PopularCarsChartProps = {
  carModels: string[];
  serviceCounts: number[];
  sx?: SxProps;
};

type ChartOptions = echarts.ComposeOption<BarSeriesOption | TooltipComponentOption | GridComponentOption>;

const PopularCarsChart = ({ carModels, serviceCounts, ...rest }: PopularCarsChartProps): ReactElement => {
  const theme = useTheme();
  const colors = generateColors(carModels.length); // Generate colors based on car models length

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
        data: carModels,
        axisLabel: {
          color: theme.palette.text.secondary,
          rotate: 45,
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
          data: serviceCounts,
          itemStyle: {
            color: (params) => colors[params.dataIndex % colors.length], // Assign color based on index
            borderRadius: 4,
          },
        },
      ],
    }),
    [theme, carModels, serviceCounts]
  );

  return <ReactEChart option={option} echarts={echarts} {...rest} />;
};

export default PopularCarsChart;
