import { ReactElement } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { AppointmentItem } from 'data/appointment-data';
import IconifyIcon from 'components/base/IconifyIcon';

const AppointmentCard = ({ appointmentItem }: { appointmentItem: AppointmentItem }): ReactElement => {
  return (
    <Stack gap={6} p={5} borderRadius={4} height={1} bgcolor="background.default">
      <IconifyIcon icon="bi:calendar2-event-fill" width={26} height={26} />
      <Box>
        <Typography variant="h4" color="common.white" mb={4}>
          {appointmentItem.service}
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={2}>
          {appointmentItem.customer}
        </Typography>
        <Typography variant="body2" color="info" lineHeight={1.25}>
          {appointmentItem.time}
        </Typography>
      </Box>
    </Stack>
  );
};

export default AppointmentCard;
