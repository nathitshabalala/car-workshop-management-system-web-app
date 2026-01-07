import { ReactElement } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import appointmentsData from 'data/appointment-data'
import AppointmentCard from './AppointmentCard';

const TodaysAppointments = (): ReactElement => {
  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Typography variant="h4" color="common.white" mb={1.25}>
        Today’s Appointments
      </Typography>
      <Typography variant="subtitle2" color="text.disabled" mb={6}>
        Appointments Summary
      </Typography>
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={{ xs: 4, sm: 6 }}>
        {appointmentsData.map((appointmentItem) => (
          <Box key={appointmentItem.id} gridColumn={{ xs: 'span 12', sm: 'span 6', lg: 'span 3' }}>
            <AppointmentCard appointmentItem={appointmentItem} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default TodaysAppointments;
