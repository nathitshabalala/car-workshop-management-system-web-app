import { useState, ChangeEvent, useCallback, ReactElement, useEffect } from 'react';
import { Box, Paper, Stack, TextField, Typography, InputAdornment } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import ManagerTable from './ManagerTable';
import { Manager, ManagerApi } from 'api';

const Managers = (): ReactElement => {
  const [search, setSearch] = useState<string>('');
  const [managers, setManagers] = useState<Manager[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); 

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  }, []);

  // Fetch managers data
  useEffect(() => {
    const fetchManagers = async () => {
      const managerApi = new ManagerApi();
      try {
        const response = await managerApi.usersManagersList();
        setManagers(response.data); 
      } catch (error) {
        console.error('Error fetching managers:', error);
      } finally {
        setLoading(false);  
      }
    };

    fetchManagers();
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
          Managers
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
        <ManagerTable searchText={search} rows={managers} loading={loading}/>
      </Box>
    </Paper>
  );
};

export default Managers;
