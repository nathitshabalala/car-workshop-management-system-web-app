import { Box, Paper } from '@mui/material';
import Revenue from 'components/sections/dashboard/revenue/Revenue';
import PopularCars from 'components/sections/dashboard/revenue/PopularCars';
import ServiceStatusDistribution from 'components/sections/dashboard/revenue/ServiceStatusDistribution';
//import CustomerSatisfaction from "components/sections/dashboard/revenue/CustomerSatisfaction";
import Brand from "components/sections/dashboard/popular-brands/Brands";
import { ReactElement } from 'react';

const CompanyReports = (): ReactElement => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <Revenue />
        </Paper>
      </Box>

      {/* <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <CustomerSatisfaction />
        </Paper>
      </Box> */}

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <ServiceStatusDistribution />
        </Paper>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Paper sx={{ p: 2 }}>
          <PopularCars />
        </Paper>
      </Box>

      <Box>
        <Paper sx={{ p: 2 }}>
          <Brand />
        </Paper>
      </Box>
    </Box>
  );
};

export default CompanyReports;


