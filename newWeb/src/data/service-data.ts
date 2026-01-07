import { GridRowsProp } from '@mui/x-data-grid';
import { Service, ServiceApi } from 'api';

const customerApi = new ServiceApi();
const response = await customerApi.servicesList();
const data = response.data as unknown as Array<Service>

export const rows: GridRowsProp = data.map((service) => {
  return {
    id: service.id,
    customer: `${service.car.customer_details.user.name} ${service.car.customer_details.user.surname}`,
    car: `${service.car.predefined_car.make} ${service.car.predefined_car.model} ${service.car.predefined_car.year}`,
    phone: service.car.customer_details.user.phone,
    name: service.service_type.name,
    status: service.status,
    date: service.date,
  };
}).reverse();
