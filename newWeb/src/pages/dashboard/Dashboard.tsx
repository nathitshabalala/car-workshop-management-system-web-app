import { ReactElement } from 'react';
import { Box } from '@mui/material';
import ServiceEstimation from 'components/sections/dashboard/service-estimation/ServiceEstimation';
import ServiceInsights from 'components/sections/dashboard/service-insights/ServiceInsights';
import TodaysSales from 'components/sections/dashboard/todays-sales/TodaysSales';
import TopProducts from 'components/sections/dashboard/top-products/TopProducts';
import Earnings from 'components/sections/dashboard/earnings/Earnings';
import TodaysAppointments from 'components/sections/dashboard/appointments/TodaysAppointments';

const Dashboard = (): ReactElement => {
  return (
    <>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={3.5}>
        <Box gridColumn={{ xs: 'span 12', '2xl': 'span 12' }} order={{ xs: 0 }}>
          <TodaysSales />
        </Box>

        <Box gridColumn={{ xs: 'span 12', lg: 'span 8' }} order={{ xs: 2, '2xl': 2 }}>
          <TopProducts />
        </Box>
        <Box
          gridColumn={{ xs: 'span 12', md: 'span 6', xl: 'span 4' }}
          order={{ xs: 3, xl: 3, '2xl': 3 }}
        >
          <ServiceEstimation />
        </Box>
        <Box
          gridColumn={{ xs: 'span 12', md: 'span 6', xl: 'span 4' }}
          order={{ xs: 4, xl: 5, '2xl': 4 }}
        >
          <Earnings />
        </Box>
        <Box gridColumn={{ xs: 'span 12', xl: 'span 8' }} order={{ xs: 5, xl: 4, '2xl': 5 }}>
          <ServiceInsights />
        </Box>
        <Box gridColumn={{ xs: 'span 12', '2xl': 'span 12' }} order={{ xs: 0 }}>
          <TodaysAppointments />
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
