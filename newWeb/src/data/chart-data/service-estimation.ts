import { InvoiceApi, QuoteApi } from "api";

interface ServiceEstimationData {
  'Quote': number[];
  'Invoice': number[];
  'Service': string[];
}

export const ServiceEstimationData: ServiceEstimationData = {
  'Quote': [],
  'Invoice': [],
  'Service': [],
};

export async function fetchPrices(): Promise<ServiceEstimationData> {
  try {
    // Fetch quotes
    const quotesResponse = await new QuoteApi().quotesList();
    const quotes = quotesResponse.data;

    // Fetch invoices
    const invoicesResponse = await new InvoiceApi().invoicesList();
    const invoices = invoicesResponse.data;

    // Filter and map based on matching service_id
    const matchingPrices = quotes
      .filter((quote) =>
        invoices.some((invoice) => invoice.service.id === quote.service.id)
      )
      .map((quote) => {
        const matchingInvoice = invoices.find(
          (invoice) => invoice.service.id === quote.service.id
        );

        ServiceEstimationData['Service'].push(quote.service.service_type.name);

        return {
          quotePrice: parseFloat(quote.total_price),
          invoicePrice: matchingInvoice ? parseFloat(matchingInvoice.total_amount) : 0
        };
      });

    // Separate quote prices and invoice prices
    ServiceEstimationData['Quote'] = matchingPrices.reverse().map(data => data.quotePrice);
    ServiceEstimationData['Invoice'] = matchingPrices.reverse().map(data => data.invoicePrice);

    console.log(ServiceEstimationData);

    return ServiceEstimationData;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
}
