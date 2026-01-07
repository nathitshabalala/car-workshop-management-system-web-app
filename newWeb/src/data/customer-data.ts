import { GridRowsProp } from '@mui/x-data-grid';
import { Customer, CustomerApi } from 'api';

const customerApi = new CustomerApi();
const response = await customerApi.usersCustomersList();
const data = response.data as unknown as Array<Customer>

export const rows: GridRowsProp = data.map((customer) => {
  const { user } = customer;
  return {
    id: user.id,
    name: `${user.name} ${user.surname}`,
    email: user.email,
    phone: user.phone,
    is_active: user.is_active,
    'billing-address': `${user.street_address}, ${user.city}, ${user.postal_code}`
  };
});
