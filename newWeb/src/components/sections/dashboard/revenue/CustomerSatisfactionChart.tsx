import { ReactElement, useMemo } from 'react';
import * as echarts from 'echarts';
import ReactEChart from 'components/base/ReactEChart'; // Use the correct import for your React ECharts component
import { alpha, SxProps, useTheme } from '@mui/material';
import { BarSeriesOption, TooltipComponentOption, GridComponentOption } from 'echarts';

type CustomerSatisfactionChartProps = {
  serviceTypes: string[];
  averageRatings: number[];
  sx?: SxProps;
};

type ChartOptions = echarts.ComposeOption<BarSeriesOption | TooltipComponentOption | GridComponentOption>;

const CustomerSatisfactionChart = ({
  serviceTypes,
  averageRatings,
  ...rest
}: CustomerSatisfactionChartProps): ReactElement => {
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
          data: averageRatings,
          itemStyle: {
            color: theme.palette.secondary.main,
            borderRadius: 4,
          },
        },
      ],
    }),
    [theme, serviceTypes, averageRatings]
  );

  return <ReactEChart option={option} echarts={echarts} {...rest} />;
};

export default CustomerSatisfactionChart;
