import { Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem, Slider } from '@mui/material';
import { useEffect, useState, ReactElement } from 'react';
import PopularCarsChart from './PopularCarsChart';
import { ServiceApi, Service, ServiceTypeApi } from 'api';

const PopularCars = (): ReactElement => {
  const [carModels, setCarModels] = useState<string[]>([]);
  const [serviceCounts, setServiceCounts] = useState<number[]>([]);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');
  const [popularityThreshold, setPopularityThreshold] = useState<number>(1); // State for popularity threshold

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

      const filteredServices = fetchedServices.filter(service => {
        const serviceDate = new Date(service.date);
        const isWithinDateRange =
          (!startDate || serviceDate >= new Date(startDate)) &&
          (!endDate || serviceDate <= new Date(endDate));
        const isServiceTypeMatch =
          !selectedServiceType || service.service_type.id === parseInt(selectedServiceType);
        return isWithinDateRange && isServiceTypeMatch;
      });

      const servicesByCarModel = filteredServices.reduce((acc: { [key: string]: number }, service) => {
        const carModel = `${service.car.predefined_car.make} ${service.car.predefined_car.model}`;
        if (!acc[carModel]) acc[carModel] = 0;
        acc[carModel] += 1;
        return acc;
      }, {});

      setCarModels(Object.keys(servicesByCarModel));
      setServiceCounts(Object.values(servicesByCarModel));
    };

    fetchData();
  }, [startDate, endDate, selectedServiceType]);

  // Filtered car models based on popularity threshold
  const filteredCarModels = carModels.filter((_, index) => serviceCounts[index] >= popularityThreshold);
  const filteredServiceCounts = serviceCounts.filter(count => count >= popularityThreshold);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Popular Cars Serviced
        </Typography>
      </Stack>

      {/* Date Filters and Service Type Selector */}
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

      {/* Slider for Popularity Threshold */}
      <Typography gutterBottom color="common.white">
        Popularity Threshold: {popularityThreshold}
      </Typography>
      <Slider
        value={popularityThreshold}
        onChange={(e, newValue) => setPopularityThreshold(newValue as number)}
        aria-labelledby="popularity-threshold-slider"
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={Math.max(...serviceCounts, 1)} // Set max to the highest count, at least 1
      />

      <PopularCarsChart
        carModels={filteredCarModels} // Use filtered car models based on slider
        serviceCounts={filteredServiceCounts} // Use filtered service counts based on slider
        sx={{ height: '300px !important', flexGrow: 1, width: '100%' }}
      />
    </Paper>
  );
};

export default PopularCars;
