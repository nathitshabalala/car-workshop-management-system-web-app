import { Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ReactElement, useEffect, useRef, useState } from 'react';
import BrandsChart from './BrandsChart';
import { Invoice, InvoiceApi, ServiceTypeApi } from 'api';
import IconifyIcon from 'components/base/IconifyIcon';
import DateRangePickerModal from 'components/common/DateRangePicker';

const Brand = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [carMakes, setCarMakes] = useState<string[]>([]);
  const [carMakesAmount, setCarMakesAmount] = useState<number[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const today = new Date();
  const twelveMonthsBefore = new Date(today);
  twelveMonthsBefore.setMonth(twelveMonthsBefore.getMonth() - 12);

  const [startDate, setStartDate] = useState<Date | null>(twelveMonthsBefore);
  const [endDate, setEndDate] = useState<Date | null>(today);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [selectedServiceType, setSelectedServiceType] = useState<string>('');

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveDateRange = (startDate: Date | null, endDate: Date | null) => {
    setStartDate(startDate);
    setEndDate(endDate);
  };

  useEffect(() => {
    const fetchServiceTypes = async () => {
      const fetchedServiceTypes = (await new ServiceTypeApi().serviceTypesList()).data;
      setServiceTypes(fetchedServiceTypes);
    };

    fetchServiceTypes();
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      const fetchData = async () => {
        const fetchedInvoices = (await new InvoiceApi().invoicesList()).data as Invoice[];
        const filteredInvoices = fetchedInvoices.filter(
          (invoice) =>
            new Date(invoice.service.date) >= startDate && new Date(invoice.service.date) <= endDate &&
            (!selectedServiceType || invoice.service.service_type.id === parseInt(selectedServiceType))
        );

        const carMakeTotals = filteredInvoices.reduce((acc: { [key: string]: number }, invoice) => {
          const carMake = invoice.service.car.predefined_car.make;
          if (!acc[carMake]) {
            acc[carMake] = 0;
          }
          acc[carMake] += 1;
          return acc;
        }, {} as { [key: string]: number });

        setCarMakes(Object.keys(carMakeTotals));
        setCarMakesAmount(Object.values(carMakeTotals));
      };

      fetchData();
    }
  }, [startDate, endDate, selectedServiceType]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Most Serviced Makes
        </Typography>
        <IconifyIcon
          icon="carbon:filter"
          sx={{ fontSize: 'inherit', color: 'primary.main', cursor: 'pointer' }}
          onClick={handleOpenModal}
        />
      </Stack>

      {/* Date Filters */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate ? startDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setStartDate(new Date(e.target.value))}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate ? endDate.toISOString().split('T')[0] : ''}
          onChange={(e) => setEndDate(new Date(e.target.value))}
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

      <BrandsChart
        chartRef={chartRef}
        carMakes={carMakes}
        carMakesAmount={carMakesAmount}
        sx={{ height: '300px !important', flexGrow: 1, width: '100%' }}
      />

      <DateRangePickerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDateRange}
      />
    </Paper>
  );
};

export default Brand;
