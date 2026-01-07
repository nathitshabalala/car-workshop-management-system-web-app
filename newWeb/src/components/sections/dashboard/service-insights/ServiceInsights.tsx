import { Paper, Stack, Typography } from '@mui/material';
import ServiceInsightsChart from './ServiceInsightsChart';
import { ReactElement, useEffect, useMemo, useRef } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { serviceInsightsData } from 'data/chart-data/service-insights';
import IconifyIcon from 'components/base/IconifyIcon';

const ServiceInsights = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);

  // Calculate the start and end date for the chart based on the available data
  const currentDate = new Date();
  const monthlyData = serviceInsightsData['Services'] || [];

  console.log(monthlyData)

  // Calculate the earliest date, which is current date - (months in data)
  const startDate = useMemo(() => {
    return new Date(currentDate.setMonth(currentDate.getMonth() - monthlyData.length + 1));
  }, [monthlyData.length]);

  // Reset currentDate (it gets mutated in the above calculation)
  const endDate = new Date();

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        flexWrap="wrap"
        gap={2}
        mb={6}
      >

        <Typography variant="h4" color="common.white">
          Service Insights
        </Typography>

      </Stack>
      <ServiceInsightsChart
        chartRef={chartRef}
        data={serviceInsightsData}
        startDate={startDate}
        endDate={endDate}
        sx={{ height: '342px !important', flexGrow: 1 }}
      />
    </Paper>
  );
};

export default ServiceInsights;
