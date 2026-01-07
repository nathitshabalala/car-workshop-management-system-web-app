import { Service, ServiceApi } from "api";

interface ServiceInsightsProps {
  'Services': number[];
}

const serviceApi = new ServiceApi();
const response = await serviceApi.servicesList();
const data = response.data as unknown as Array<Service>;

const earliestDate = new Date(Math.min(...data.map((service) => new Date(service.date).getTime())));
const currentMonth = new Date().getMonth();
const currentYear = new Date().getFullYear();
const earliestMonth = earliestDate.getMonth();
const earliestYear = earliestDate.getFullYear();

const months = [];
for (let year = earliestYear; year <= currentYear; year++) {
  const startMonth = year === earliestYear ? earliestMonth : 0;
  const endMonth = year === currentYear ? currentMonth : 11;
  for (let month = startMonth; month <= endMonth; month++) {
    months.push(new Date(year, month, 1));
  }
}

export const serviceInsightsData: ServiceInsightsProps = {
  'Services': months.map((month) => {
    const servicesInMonth = data.filter((service) => {
      const serviceDate = new Date(service.date);
      return serviceDate.getFullYear() === month.getFullYear() && serviceDate.getMonth() === month.getMonth();
    });
    return servicesInMonth.length;
  }).reverse(),
};