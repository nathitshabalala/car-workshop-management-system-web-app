import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import { LineSeriesOption } from 'echarts';
import ReactEChart from 'components/base/ReactEChart';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { alpha, SxProps, useTheme } from '@mui/material';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';

type ServiceEstimationChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  data?: any;
  sx?: SxProps;
};

type ServiceEstimationChartOptions = echarts.ComposeOption<
  LineSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const ServiceEstimationChart = ({
  chartRef,
  data = { 'Quote': [], 'Invoice': [] },
  ...rest
}: ServiceEstimationChartProps): ReactElement => {
  const theme = useTheme()
  const xAxisLabels = data['Quote'].map((_: any, index: string | number) => `${data['Service'][index]}`);

  const option: ServiceEstimationChartOptions = useMemo(
    () => ({
      color: [theme.palette.secondary.main, theme.palette.primary.main],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      legend: {
        show: false,
        data: ['Quote', 'Invoice'],
      },
      grid: {
        top: 0,
        right: 5,
        bottom: 1,
        left: 5,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        show: true,
        data: xAxisLabels,
        axisLabel: {
          show: false,
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: alpha(theme.palette.common.white, 0.06),
            width: 1,
          },
        },
      },

      // Set the yAxis to auto-scale
      yAxis: {
        type: 'value',
        show: false,
        min: 'dataMin', // auto-scale to the minimum data value
        max: 'dataMax', // auto-scale to the maximum data value
      },
      series: [
        {
          id: 1,
          name: 'Quote',
          type: 'line',
          lineStyle: {
            width: 2,
          },
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: {
            opacity: 0.8,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.9, [
              {
                offset: 1,
                color: theme.palette.grey.A100,
              },
              {
                offset: 0,
                color: theme.palette.secondary.main,
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data['Quote'],
        },
        {
          id: 2,
          name: 'Invoice',
          type: 'line',
          lineStyle: {
            width: 2,
          },
          showSymbol: true,
          symbol: 'circle',
          symbolSize: 5,
          areaStyle: {
            opacity: 0.75,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 0.95, [
              {
                offset: 1,
                color: theme.palette.grey.A100,
              },
              {
                offset: 0,
                color: theme.palette.primary.main,
              },
            ]),
          },
          emphasis: {
            focus: 'series',
          },
          data: data['Invoice'],
        },
      ],
    }),
    [data, theme, xAxisLabels],
  );


  return <ReactEChart ref={chartRef} option={option} echarts={echarts} {...rest} />;
};

export default ServiceEstimationChart;
