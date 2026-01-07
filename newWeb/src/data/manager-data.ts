import { GridRowsProp } from '@mui/x-data-grid';
import { Manager, ManagerApi } from 'api';

const managerApi = new ManagerApi();
const response = await managerApi.usersManagersList();
const data = response.data as unknown as Array<Manager>

export const rows: GridRowsProp = data;
