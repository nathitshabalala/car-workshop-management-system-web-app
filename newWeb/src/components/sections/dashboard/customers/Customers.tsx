import { useState, ChangeEvent, useCallback, ReactElement, useEffect } from 'react';
import { Box, Paper, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import CustomerTable from './CustomerTable';
import { Customer, CustomerApi } from 'api';

const Customers = (): ReactElement => {
  const [search, setSearch] = useState<string>('');
  const [customers, setCustomers] = useState<Customer[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  }, []);

  // Fetch customers data
  useEffect(() => {
    const fetchCustomers = async () => {
      const customerApi = new CustomerApi();
      try {
        const response = await customerApi.usersCustomersList();
        setCustomers(response.data); 
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchCustomers();
  }, []);

  return (
    <Paper sx={{ p: { xs: 4, sm: 8 }, height: 1 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        flexWrap="wrap"
        gap={3}
      >
        <Typography variant="h4" color="common.white">
          Customers
        </Typography>
        <TextField
          variant="filled"
          placeholder="Search..."
          value={search}
          onChange={handleChange}
          sx={{
            '.MuiFilledInput-root': {
              bgcolor: 'grey.A100',
              ':hover': {
                bgcolor: 'background.default',
              },
              ':focus': {
                bgcolor: 'background.default',
              },
              ':focus-within': {
                bgcolor: 'background.default',
              },
            },
            borderRadius: 2,
            height: 40,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="end">
                <IconifyIcon icon="akar-icons:search" width={13} height={13} />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Box width={1} flexGrow={1} minHeight={325}>
        <CustomerTable searchText={search} rows={customers} loading={loading}/>
      </Box>
    </Paper>
  );
};

export default Customers;
