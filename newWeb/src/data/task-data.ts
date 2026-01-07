import { GridRowsProp } from '@mui/x-data-grid';
import { Task, TaskApi } from 'api';

const taskApi = new TaskApi();
const response = await taskApi.tasksList();
const data = response.data as unknown as Array<Task>

export const rows: GridRowsProp = data.map((task) => {
    return {
        id: task.id,
        car: task.service.car.predefined_car.make + ' ' + task.service.car.predefined_car.model + ' ' + '(' + task.service.car.reg_no + ')',
        mechanic: task.assigned_to.user.name + ' ' + task.assigned_to.user.surname,
        status: task.status,
        description: task.description
    };
}).reverse();