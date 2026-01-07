import { LinearProgressProps } from '@mui/material';
import { InvoiceApi, Invoice } from 'api';

export interface ProductItem {
  id?: string;
  name: string;
  color: LinearProgressProps['color'];
  sales: number;
}

const invoiceApi = new InvoiceApi();
let topServiceTypes = null;
let serviceTypeAmounts = null;
let totalSales: number = 0;
let data: Array<Invoice>;

try {
  const response = await invoiceApi.invoicesList();
  data = response.data as unknown as Array<Invoice>;

  topServiceTypes = [...new Set(data.map((invoice) => invoice.service.service_type.name))]
    .sort((a, b) => {
      const frequencyA = data.filter((invoice) => invoice.service.service_type.name === a).length;
      const frequencyB = data.filter((invoice) => invoice.service.service_type.name === b).length;
      return frequencyB - frequencyA;
    });

  totalSales = data.reduce((acc: number, invoice) => acc + Number(invoice.total_amount), 0);

  serviceTypeAmounts = topServiceTypes.map((serviceType) => {
    const amount = data.reduce((acc: number, invoice) => {
      if (invoice.service.service_type.name === serviceType) {
        return acc + Number(invoice.total_amount);
      }
      return acc;
    }, 0);
    const popularity = Math.round((amount / totalSales) * 100);
    return { serviceType, amount, popularity };
  });


} catch (error) {
  console.error(error);
}

export const productTableRows: ProductItem[] = topServiceTypes ? topServiceTypes.map((serviceType, index) => {
  const amount = data.reduce((acc: number, invoice) => {
    if (invoice.service.service_type.name === serviceType) {
      return acc + Number(invoice.total_amount);
    }
    return acc;
  }, 0);
  const popularity = Math.round((amount / totalSales) * 100);
  return {
    id: `${index + 1}`,
    name: serviceType,
    color: ['warning', 'primary', 'info', 'secondary'][index % 4] as LinearProgressProps['color'],
    sales: popularity,
  };
}) : [];