import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import { BarSeriesOption } from 'echarts';
import ReactEChart from 'components/base/ReactEChart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { alpha, SxProps, useTheme } from '@mui/material';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';

// Function to generate colors
const generateColors = (count: number) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    colors.push(`hsl(${(i * 360) / count}, 70%, 50%)`); // Generate colors using HSL
  }
  return colors;
}

type BrandsChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  carMakes: string[];
  carMakesAmount: number[];
  sx?: SxProps;
};

type BrandsChartOptions = echarts.ComposeOption<
  BarSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const BrandsChart = ({ chartRef, carMakes, carMakesAmount, ...rest }: BrandsChartProps): ReactElement => {
  const theme = useTheme();
  const colors = generateColors(carMakes.length); // Generate colors based on car makes length

  const option: BrandsChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      legend: {
        show: false,
        data: ['Total Amount'],
      },
      xAxis: {
        type: 'category',
        show: true,
        axisTick: { show: false },
        data: carMakes,
        axisLabel: {
          show: true,
          interval: 0,
          rotate: 45,
          textStyle: {
            color: theme.palette.text.secondary,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
            width: 1,
          },
        },
      },
      yAxis: {
        type: 'value',
        show: false,
        axisLabel: {
          color: theme.palette.text.secondary,
        },
      },
      grid: {
        left: 40,
        right: 40,
        top: 40,
        bottom: 100,
      },
      series: [
        {
          name: 'Total Amount',
          type: 'bar',
          barWidth: 25,
          data: carMakesAmount,
          itemStyle: {
            color: (params) => colors[params.dataIndex % colors.length], // Assign color based on index
            borderRadius: 4,
          },
        },
      ],
    }),
    [theme, carMakes, carMakesAmount],
  );

  return <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />;
};

export default BrandsChart;
