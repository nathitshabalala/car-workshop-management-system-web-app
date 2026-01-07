import { InvoiceApi, } from 'api';
import { Invoice } from 'api';


const invoiceApi = new InvoiceApi();
let invoiceData: Array<Invoice> = [];
try {
  const invoiceResponse = await invoiceApi.invoicesList();
  invoiceData = invoiceResponse.data as unknown as Array<Invoice>;

} catch (error) {
  console.error(error);
}

export default invoiceData;

