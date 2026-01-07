import totalSales from 'assets/images/todays-sales/total-sales.png';
import totalOrder from 'assets/images/todays-sales/total-order.png';
import productSold from 'assets/images/todays-sales/product-sold.png';
import newCustomer from 'assets/images/todays-sales/new-customer.png';
import { Customer, CustomerApi, InvoiceApi, Invoice } from 'api';

export interface SaleItem {
  id?: number;
  icon: string;
  title: string;
  subtitle: string;
  increment: string;
  color: string;
}

const salesData: SaleItem[] = [
  {
    id: 1,
    icon: totalSales,
    title: '$5k',
    subtitle: 'Total Sales',
    increment: '10',
    color: 'warning.main',
  },
  {
    id: 2,
    icon: totalOrder,
    title: '500',
    subtitle: 'Completed Services',
    increment: '8',
    color: 'primary.main',
  },
  {
    id: 3,
    icon: productSold,
    title: '9',
    subtitle: 'Unique Service Offerings',
    increment: '2',
    color: 'secondary.main',
  },
  {
    id: 4,
    icon: newCustomer,
    title: '12',
    subtitle: 'New Customer',
    increment: '3',
    color: 'info.main',
  },
];

// Utility function to calculate increment percentage
const calculateIncrement = (todayValue: number, yesterdayValue: number): string => {
  if (yesterdayValue === 0) return 'No data from yesterday';

  const increment = ((todayValue - yesterdayValue) / yesterdayValue) * 100;

  return increment < 0
    ? `${Math.round(increment)}% from yesterday`
    : `+${Math.round(increment)}% from yesterday`;
};

// Fetch and update sales data
export const fetchAndUpdateSalesData = async () => {
  const invoiceApi = new InvoiceApi();
  const customerApi = new CustomerApi();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  try {
    const invoiceResponse = await invoiceApi.invoicesList();
    const invoiceData = invoiceResponse.data as Invoice[];

    const custResponse = await customerApi.usersCustomersList();
    const custData = custResponse.data as Customer[];

    // Make sure data is not empty or undefined
    if (!invoiceData || invoiceData.length === 0) {
      console.warn('No invoice data fetched');
      return;
    }

    if (!custData || custData.length === 0) {
      console.warn('No customer data fetched');
      return;
    }

    // Total Sales (salesData[0])
    const invoicesTodayTotal = invoiceData
      .filter(inv => new Date(inv.date).toDateString() === today.toDateString())
      .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

    const invoicesYesterdayTotal = invoiceData
      .filter(inv => new Date(inv.date).toDateString() === yesterday.toDateString())
      .reduce((acc, curr) => acc + Number(curr.total_amount), 0);

    console.log('Today\'s total:', invoicesTodayTotal);
    console.log('Yesterday\'s total:', invoicesYesterdayTotal);

    salesData[0].title = `R${invoicesTodayTotal.toFixed(2)}`;
    salesData[0].increment = calculateIncrement(invoicesTodayTotal, invoicesYesterdayTotal);

    // Completed Services (salesData[1])
    const completedServicesToday = invoiceData.filter(inv => new Date(inv.date).toDateString() === today.toDateString()).length;
    const completedServicesYesterday = invoiceData.filter(inv => new Date(inv.date).toDateString() === yesterday.toDateString()).length;

    console.log('Today\'s completed services:', completedServicesToday);
    console.log('Yesterday\'s completed services:', completedServicesYesterday);

    salesData[1].title = `${completedServicesToday}`;
    salesData[1].increment = calculateIncrement(completedServicesToday, completedServicesYesterday);

    // Unique Service Offerings (salesData[2])
    const getUniqueServiceCount = (invoices: Invoice[], date: Date) => new Set(
      invoices
        .filter(inv => new Date(inv.date).toDateString() === date.toDateString())
        .map(inv => inv.service.service_type.id)
    ).size;

    const uniqueServicesToday = getUniqueServiceCount(invoiceData, today);
    const uniqueServicesYesterday = getUniqueServiceCount(invoiceData, yesterday);

    console.log('Today\'s unique services:', uniqueServicesToday);
    console.log('Yesterday\'s unique services:', uniqueServicesYesterday);

    salesData[2].title = `${uniqueServicesToday}`;
    salesData[2].increment = calculateIncrement(uniqueServicesToday, uniqueServicesYesterday);

    // New Customers (salesData[3])
    const customersToday = custData.filter(cust => new Date(cust.user.created_at).toDateString() === today.toDateString()).length;
    const customersYesterday = custData.filter(cust => new Date(cust.user.created_at).toDateString() === yesterday.toDateString()).length;

    console.log('Today\'s new customers:', customersToday);
    console.log('Yesterday\'s new customers:', customersYesterday);

    salesData[3].title = `${customersToday}`;
    salesData[3].increment = calculateIncrement(customersToday, customersYesterday);
  } catch (error) {
    console.error('Error fetching sales data:', error);
  }
};

fetchAndUpdateSalesData();

export default salesData;