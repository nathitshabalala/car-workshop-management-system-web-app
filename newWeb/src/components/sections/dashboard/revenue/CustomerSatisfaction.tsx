import { Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useEffect, useState, ReactElement } from 'react';
import CustomerSatisfactionChart from './CustomerSatisfactionChart';
import { FeedbackApi, Feedback } from 'api'; // Ensure your actual API imports are correct

const CustomerSatisfaction = (): ReactElement => {
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [averageRatings, setAverageRatings] = useState<number[]>([]);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFeedback = (await new FeedbackApi().feedbackList()).data as Feedback[];
      const feedbackByServiceType = fetchedFeedback.reduce((acc: { [key: string]: number[] }, feedback) => {
        const serviceType = feedback.service.service_type.name;
        if (!acc[serviceType]) acc[serviceType] = [];
        acc[serviceType].push(feedback.rating);
        return acc;
      }, {});

      const filteredServiceTypes = Object.keys(feedbackByServiceType).filter(type => {
        // Filtering logic for service type based on dates
        return true; // Placeholder: Implement actual filtering logic if needed
      });

      const averageRatings = filteredServiceTypes.map(
        (type) => feedbackByServiceType[type].reduce((a, b) => a + b, 0) / feedbackByServiceType[type].length
      );

      setServiceTypes(filteredServiceTypes);
      setAverageRatings(averageRatings);
    };

    fetchData();
  }, [startDate, endDate, selectedServiceType]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Customer Satisfaction
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
            {/* Assuming you have a way to get service types for filtering */}
            {/* {serviceTypes.map((type) => ( */}
            {/*   <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem> */}
            {/* ))} */}
          </Select>
        </FormControl>
      </Stack>

      <CustomerSatisfactionChart
        serviceTypes={serviceTypes}
        averageRatings={averageRatings}
        sx={{ height: '300px !important', flexGrow: 1, width: '100%' }}
      />
    </Paper>
  );
};

export default CustomerSatisfaction;
