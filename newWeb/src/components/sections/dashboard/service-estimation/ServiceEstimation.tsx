import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Button, Divider, Paper, Stack, Typography, alpha, useTheme } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import ServiceEstimationChart from './ServiceEstimationChart';
import { currencyFormat } from 'helpers/format-functions';
import { fetchPrices } from 'data/chart-data/service-estimation';
import IconifyIcon from 'components/base/IconifyIcon';

interface ServiceEstimationDataI {
  'Quote': number[];
  'Invoice': number[];
}

const ServiceEstimation = (): ReactElement => {
  const theme = useTheme();
  const chartRef = useRef<EChartsReactCore | null>(null);

  // State to hold the fetched data
  const [ServiceEstimationData, setServiceEstimationData] = useState<ServiceEstimationDataI>({
    'Quote': [],
    'Invoice': [],
  });

  useEffect(() => {
    async function fetchData() {
      const data = await fetchPrices();  // Wait for the Promise to resolve
      setServiceEstimationData(data);  // Update state with the fetched data
    }
    fetchData();

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

  const getTotalFulfillment = useCallback(
    (chartData: number[]) => {
      return currencyFormat(chartData.reduce((prev, current) => prev + current, 0));
    },
    [ServiceEstimationData],
  );

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Service Estimation
        </Typography>
      </Stack>
      {ServiceEstimationData && Object.keys(ServiceEstimationData).length > 0 && (
        <ServiceEstimationChart
          chartRef={chartRef}
          sx={{ height: '220px !important', flexGrow: 1 }}
          data={Object.fromEntries(
            Object.entries(ServiceEstimationData).map(([key, value]) => [
              key,
              value.slice(0, 10),
            ])
          )}
        />
      )}
      <Stack
        direction="row"
        justifyContent="space-around"
        divider={
          <Divider
            orientation="vertical"
            flexItem
            sx={{ borderColor: alpha(theme.palette.common.white, 0.06), height: 1 }}
          />
        }
        px={2}
        pt={3}
        sx={{
          transitionProperty: 'all',
          transitionDelay: '1s',
        }}
      >
        <Stack gap={1.25} alignItems="center">
          <Button
            variant="text"
            sx={{
              p: 0.5,
              borderRadius: 1,
              fontSize: 'body2.fontSize',
              color: 'text.disabled',
              '&:hover': {
                bgcolor: 'transparent',
              },
              '& .MuiButton-startIcon': {
                mx: 0,
                mr: 1,
              },
            }}
            disableRipple
            startIcon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: 'secondary.main',
                  borderRadius: 400,
                }}
              />
            }
          >
            Quote
          </Button>
          <Typography variant="body2" color="common.white">
            {getTotalFulfillment(ServiceEstimationData['Quote'].slice(0, 10))}
          </Typography>
        </Stack>
        <Stack gap={1.25} alignItems="center">
          <Button
            variant="text"
            sx={{
              p: 0.5,
              borderRadius: 1,
              fontSize: 'body2.fontSize',
              color: 'text.disabled',
              '&:hover': {
                bgcolor: 'transparent',
              },
              '& .MuiButton-startIcon': {
                mx: 0,
                mr: 1,
              },
            }}
            disableRipple
            startIcon={
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  bgcolor: 'primary.main',
                  borderRadius: 400,
                }}
              />
            }
          >
            Invoice
          </Button>
          <Typography variant="body2" color="common.white">
            {getTotalFulfillment(ServiceEstimationData['Invoice'].slice(0, 10))}
          </Typography>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default ServiceEstimation;
