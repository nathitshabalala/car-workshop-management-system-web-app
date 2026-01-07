import { Box, Paper, Typography } from '@mui/material';
import EarningsChart from './EarningsChart';
import { ReactElement, useEffect, useRef, useState } from 'react';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { TaskApi } from 'api';

const Earnings = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [allCount, setAllCount] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        const echartsInstance = chartRef.current.getEchartsInstance();
        echartsInstance.resize({ width: 'auto', height: 'auto' });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [chartRef]);

  useEffect(() => {
    const fetchData = async () => {
      const tasksApi = new TaskApi();
      const pendingResponse = await tasksApi.tasksPendingList();
      setPendingCount(pendingResponse.data.length);

      const allResponse = await tasksApi.tasksList();
      setAllCount(allResponse.data.length);

      setPercentage(Math.round(pendingResponse.data.length / allResponse.data.length * 100));
    };
    fetchData();
  }, []);


  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={2.5}>
        Task Overview
      </Typography>
      <Typography variant="body1" color="text.primary" mb={4.5}>
        Pending Tasks
      </Typography>
      <Typography
        variant="h1"
        color="primary.main"
        mb={4.5}
        fontSize={{ xs: 'h2.fontSize', sm: 'h1.fontSize' }}
      >
        {pendingCount}
      </Typography>
      {/* <Typography variant="body1" color="text.primary" mb={15}>
        Profit is 48% More than Invoice
      </Typography> */}
      <Box
        flex={1}
        sx={{
          position: 'relative',
        }}
      >
        <EarningsChart
          chartRef={chartRef}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flex: '1 1 0%',
            maxHeight: 152,
          }}
          percentage={percentage}
        />
        <Typography
          variant="h1"
          color="common.white"
          textAlign="center"
          mx="auto"
          position="absolute"
          left={0}
          right={0}
          bottom={0}
        >
          {percentage}%
        </Typography>
      </Box>
    </Paper>
  );
};

export default Earnings;
