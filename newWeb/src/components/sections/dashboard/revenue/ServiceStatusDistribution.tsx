import { Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ReactElement, useEffect, useRef, useState } from 'react';
import ServiceStatusDistributionChart from './ServiceStatusDistributionChart';
import { ServiceApi, Service, ServiceTypeApi } from 'api';

const ServiceStatusDistribution = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [totalServicesByType, setTotalServicesByType] = useState<{ [key: string]: number }>({});
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const fetchedServiceTypes = (await new ServiceTypeApi().serviceTypesList()).data;
      setServiceTypes(fetchedServiceTypes);
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedServices = (await new ServiceApi().servicesList()).data as Service[];

      // Filter services based on date range and selected service type
      const filteredServices = fetchedServices.filter(service => {
        const serviceDate = new Date(service.date);
        const isWithinDateRange =
          (!startDate || serviceDate >= new Date(startDate)) &&
          (!endDate || serviceDate <= new Date(endDate));
        const isServiceTypeMatch =
          !selectedServiceType || service.service_type.id === parseInt(selectedServiceType);
        return isWithinDateRange && isServiceTypeMatch;
      });

      // Aggregate total services requested by service type
      const totalServices: { [key: string]: number } = {};
      filteredServices.forEach(service => {
        const serviceTypeName = service.service_type.name;
        if (!totalServices[serviceTypeName]) {
          totalServices[serviceTypeName] = 0;
        }
        totalServices[serviceTypeName]++;
      });

      setTotalServicesByType(totalServices);
    };

    fetchData();
  }, [startDate, endDate, selectedServiceType]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Service Status Distribution
        </Typography>
      </Stack>

      {/* Date Filters */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <FormControl>
          <InputLabel>Service Type</InputLabel>
          <Select
            value={selectedServiceType}
            onChange={(e) => setSelectedServiceType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            {serviceTypes.map((type) => (
              <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      <ServiceStatusDistributionChart
        chartRef={chartRef}
        totalServicesByType={totalServicesByType} // Pass updated data
        sx={{ height: '300px !important', flexGrow: 1, width: '100%' }}
      />
    </Paper>
  );
};

export default ServiceStatusDistribution;
