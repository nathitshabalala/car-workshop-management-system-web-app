import { SxProps, useTheme } from '@mui/material';
import ReactEChart from 'components/base/ReactEChart';
import * as echarts from 'echarts/core';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { LineSeriesOption } from 'echarts/charts';
import {
  GridComponentOption,
  LegendComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import { ReactElement, useMemo } from 'react';

type ServiceInsightsChartProps = {
  chartRef: React.MutableRefObject<EChartsReactCore | null>;
  data?: any;
  sx?: SxProps;
  startDate: any,
  endDate: any,
};

type ServiceInsightsChartOptions = echarts.ComposeOption<
  LineSeriesOption | LegendComponentOption | TooltipComponentOption | GridComponentOption
>;

const ServiceInsightsChart = ({
  chartRef,
  data = { 'Services': [] },
  startDate,
  endDate,
  ...rest
}: ServiceInsightsChartProps): ReactElement => {
  const theme = useTheme();
  const monthlyData = data['Services'] || [];

  // Calculate the months based on the passed startDate and endDate
  const monthsToDisplay: string[] = [];
  let tempDate = new Date(startDate);

  while (tempDate <= endDate) {
    monthsToDisplay.push(tempDate.toLocaleString('default', { month: 'short' }));
    tempDate.setMonth(tempDate.getMonth() + 1);
  }

  console.log(monthlyData);

  const option: ServiceInsightsChartOptions = useMemo(
    () => ({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: theme.palette.warning.main,
          },
          label: {
            backgroundColor: theme.palette.warning.main,
          },
        },
      },
      legend: {
        show: false,
        data: ['Services'],
      },
      grid: {
        top: '5%',
        right: '1%',
        bottom: '2.5%',
        left: '1.25%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: false,
          data: monthsToDisplay,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            formatter: (value: string) => value.substring(0, 3),
            padding: [10, 25, 10, 15],
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightMedium as number,
            color: theme.palette.common.white,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: Math.max(...monthlyData, 500),
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            show: false,
          },
          axisLabel: {
            padding: [0, 10, 0, 0],
            fontSize: theme.typography.body2.fontSize,
            fontWeight: theme.typography.fontWeightMedium as number,
            color: theme.palette.common.white,
          },
        },
      ],
      series: [
        {
          id: 1,
          name: 'Services',
          type: 'line',
          stack: 'Total',
          smooth: false,
          color: theme.palette.primary.main,
          lineStyle: {
            width: 2,
            color: theme.palette.primary.main,
          },
          showSymbol: false,
          areaStyle: {
            opacity: 1,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
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
          data: monthlyData.slice(-12),
        },
      ],
    }),
    [],
  );
  return <ReactEChart ref={chartRef} echarts={echarts} option={option} {...rest} />;
};

export default ServiceInsightsChart;
