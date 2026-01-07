import { Paper, Stack, Typography, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import EChartsReactCore from 'echarts-for-react/lib/core';
import { ReactElement, useEffect, useRef, useState } from 'react';
import RevenueChart from './RevenueChart';
import { Invoice, InvoiceApi, ServiceTypeApi } from 'api';
import IconifyIcon from 'components/base/IconifyIcon';
import DateRangePickerModal from 'components/common/DateRangePicker';

const Revenue = (): ReactElement => {
  const chartRef = useRef<EChartsReactCore | null>(null);
  const [serviceTypes, setServiceTypes] = useState<any[]>([]);
  const [serviceTypeAmounts, setServiceTypeAmounts] = useState<number[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const today = new Date();
  const twelveMonthsBefore = new Date(today);
  twelveMonthsBefore.setMonth(twelveMonthsBefore.getMonth() - 12);

  const [startDate, setStartDate] = useState<Date | null>(twelveMonthsBefore);
  const [endDate, setEndDate] = useState<Date | null>(today);
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
    const fetchData = async () => {
      const fetchedInvoices = (await new InvoiceApi().invoicesList()).data as Invoice[];

      const filteredInvoices = fetchedInvoices.filter((invoice) => {
        const serviceDate = new Date(invoice.date); // Ensure date is parsed correctly
        const isWithinDateRange =
          (!startDate || serviceDate >= startDate) && (!endDate || serviceDate <= endDate);
        const isServiceTypeMatch = !selectedServiceType || invoice.service.service_type.id === parseInt(selectedServiceType);
        return isWithinDateRange && isServiceTypeMatch;
      });

      const serviceTypeTotals = filteredInvoices.reduce((acc: { [key: string]: number }, invoice) => {
        const serviceType = invoice.service.service_type.name;
        acc[serviceType] = (acc[serviceType] || 0) + Number(invoice.total_amount);
        return acc;
      }, {});

      setServiceTypeAmounts(Object.values(serviceTypeTotals));
    };

    fetchData();
  }, [startDate, endDate, selectedServiceType]);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: '1', overflow: 'hidden' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h4" color="common.white">
          Revenue
        </Typography>
        <IconifyIcon icon="carbon:filter" sx={{ fontSize: 'inherit', color: 'primary.main' }} onClick={handleOpenModal} />
      </Stack>

      {/* Date Filters and Service Type Selector */}
      <Stack direction="row" spacing={2} mb={2}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate ? startDate.toISOString().substring(0, 10) : ''}
          onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate ? endDate.toISOString().substring(0, 10) : ''}
          onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
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

      <RevenueChart
        chartRef={chartRef}
        serviceTypes={serviceTypes.map(type => type.name)}
        serviceTypeAmounts={serviceTypeAmounts}
        sx={{ height: '300px !important', flexGrow: 1, width: '100%', minWidth: '600px' }}
      />
      
      <DateRangePickerModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveDateRange}
      />
    </Paper>
  );
};

export default Revenue;
