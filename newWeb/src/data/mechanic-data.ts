import { GridRowsProp } from '@mui/x-data-grid';
import { Mechanic, MechanicApi } from 'api';

const mechanicApi = new MechanicApi();
const response = await mechanicApi.usersMechanicsList();
const data = response.data as unknown as Array<Mechanic>

export const rows: GridRowsProp = data.map((mech) => {
  const { user } = mech;
  return {
    id: user.id,
    name: `${user.name} ${user.surname}`,
    email: user.email,
    phone: user.phone,
    workload: mech.current_workload,
    is_active: user.is_active,
    'billing-address': `${user.street_address}, ${user.city}, ${user.postal_code}`
  };
});
