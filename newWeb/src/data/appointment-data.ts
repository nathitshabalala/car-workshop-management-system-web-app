import { AppointmentApi, Appointment } from 'api';

export interface AppointmentItem {
  id?: number;
  service: string;
  customer: string;
  time: string;
}

const appointmentApi = new AppointmentApi()
const response = await appointmentApi.appointmentsList();
const appointmentData = response.data as unknown as Array<Appointment>

const today = new Date().toISOString().split('T')[0]
const AppointmentData: AppointmentItem[] = appointmentData
  .filter((appointment) => appointment.date === today)
  .map((appointment) => ({
    id: appointment.id,
    service: appointment.service_details.service_type.name,
    customer: appointment.service_details.car.customer_details.user.name + ' ' + appointment.service_details.car.customer_details.user.surname,
    time: appointment.time.slice(0, 5),
  }))

console.log(AppointmentData)

export default AppointmentData.slice(0, 4);
