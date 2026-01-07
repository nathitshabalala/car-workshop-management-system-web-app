import { useState, ChangeEvent, useCallback, ReactElement, useEffect } from 'react';
import { Box, Paper, Stack, TextField, Typography, InputAdornment, Button, Modal, Grid2 } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import MechanicTable from './MechanicTable';
import { Mechanic, MechanicApi } from 'api';

const Mechanics = (): ReactElement => {
  const [search, setSearch] = useState<string>('');
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  interface User {
    name: string;
    surname: string;
    phone: string;
    email: string;
    street_address: string;
    city: string;
    postal_code: string;
  }

  interface NewMechanic {
    user: User;
    password: string;
    is_available: boolean;
    current_workload: number;
  }

  async function createMechanic({
    user,
    password,
    is_available,
    current_workload,
  }: NewMechanic): Promise<void> {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users/mechanic/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            name: user.name,
            surname: user.surname,
            phone: user.phone,
            email: user.email,
            street_address: user.street_address,
            city: user.city,
            postal_code: user.postal_code,
          },
          password: password,
          is_available: is_available,
          current_workload: current_workload,
        }),
      });

      if (response.ok) {
        console.log('Mechanic created successfully');
        const responseData = await response.json();
        console.log('Response data:', responseData);
      } else {
        console.error(`Failed to create mechanic: ${response.status}`);
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  //Adding new Mechanic
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [newMechanic, setNewMechanic] = useState<NewMechanic>({
    user: {
      name: '',
      surname: '',
      phone: '',
      email: '',
      street_address: '',
      city: '',
      postal_code: '',
    },
    password: 'password',
    is_available: false,
    current_workload: 0,
  });

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value);
  }, []);

  // Fetch mechanics data
  useEffect(() => {
    const fetchMechanics = async () => {
      const mechanicApi = new MechanicApi();
      try {
        const response = await mechanicApi.usersMechanicsList();
        setMechanics(response.data);
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanics();
  }, []);


  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setNewMechanic({
        user: {
          name: 'Jacob',
          surname: 'Kgomo',
          phone: '123456789',
          email: 'email@example.com',
          street_address: '123 Main St',
          city: 'Johannesburg',
          postal_code: '10001',
        },
        password: 'password',
        is_available: true,
        current_workload: 0,
      });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    setNewMechanic((prev) => ({
      ...prev,
      user: {
        ...prev.user,
        [name]: value,
      },
    }));
  };

  const handleWorkloadChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewMechanic((prev) => ({
      ...prev,
      current_workload: Number(event.currentTarget.value),
    }));
  };

  const handleAddMechanic = async () => {
    createMechanic(newMechanic);
    handleCloseModal();
  };

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
          Mechanics
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
      <Typography variant="h4" color="common.white">
      <Typography variant="h4" color="common.white">
        <Button onClick={handleOpenModal}>Add New Mechanic</Button>
      </Typography>
       {/* Modal for adding new mechanic */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={{ p: 3, bgcolor: '#003366', margin: 'auto', width: 800, borderRadius: 2 }}>
          <Typography variant="h6">Add New Mechanic</Typography>
          <Grid2 container spacing={2}>
    <Grid2>
      <TextField
        label="Name"
        name="name"
        value={newMechanic.user.name}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2>
      <TextField
        label="Surname"
        name="surname"
        value={newMechanic.user.surname}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2 >
      <TextField
        label="Phone"
        name="phone"
        value={newMechanic.user.phone}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2 >
      <TextField
        label="Email"
        name="email"
        value={newMechanic.user.email}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2>
      <TextField
        label="Street"
        name="street"
        value={newMechanic.user.street_address}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2 >
      <TextField
        label="City"
        name="city"
        value={newMechanic.user.city}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2>
      <TextField
        label="Postal Code"
        name="postal_code"
        value={newMechanic.user.postal_code}
        onChange={handleInputChange}
        fullWidth
      />
    </Grid2>
    <Grid2>
  <TextField
    label="Password"
    name="password"
    value={newMechanic.password}  // Fix here
    onChange={handleInputChange}
    fullWidth
  />
</Grid2>

    <Grid2>
      <TextField
        label="Current Workload"
        type="number"
        value={newMechanic.current_workload}
        onChange={handleWorkloadChange}
        fullWidth
      />

    </Grid2>
      <Button onClick={handleAddMechanic} variant="contained" fullWidth>
        Add Mechanic
      </Button>

  </Grid2>

        </Box>
      </Modal>
        </Typography>
      <Box width={1} flexGrow={1} minHeight={325}>
        <MechanicTable searchText={search} rows={mechanics} loading={loading}/>
      </Box>
    </Paper>
  );
};

export default Mechanics;
