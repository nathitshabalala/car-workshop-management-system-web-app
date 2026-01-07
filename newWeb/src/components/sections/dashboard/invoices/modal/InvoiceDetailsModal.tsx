import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography, Box, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

interface InvoiceDetailsModalProps {
    open: boolean;
    onClose: () => void;
    invoiceId: string | number;
}

// interface PartInvoice {
//     predefined_part_name: string;
//     quantity: number;
//     price: number;
// }
interface PartInvoice {
    id: number; 
    part: {
      id: number;
      predefined_part: number;
      predefined_part_name: string;
      predefined_part_description: string;
      price: number; 
    };
    quantity: number;
    price: number;
  }

interface CustomerDetails {
    user: {
        name: string;
        surname: string;
        phone: string;
        email: string;
        street_address: string;
        city: string;
        postal_code: string;
    };
}

interface Car {
    predefined_car: {
        make: string;
        model: string;
        year: number;
    };
    reg_no: string;
    customer_details: CustomerDetails;
}

interface Service {
    car: Car;
    service_type: { name: string };
    date: string;
}

interface Invoice {
    id: number;
    part_invoices: PartInvoice[];
    labor_fees: number;
    tax: number;
    status: string;
    service: Service;
}


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
}));

const InvoiceDetailsDialog = ({ open, onClose, invoiceId }: InvoiceDetailsModalProps) => {
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (invoiceId) {
            fetch(`http://127.0.0.1:8000/api/invoices/${invoiceId}/`)
                .then((response) => response.json())
                .then((data) => {
                    setInvoice(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching invoice details:", error);
                    setLoading(false);
                });
        }
    }, [invoiceId]);

    if (!open) return null;
    if (loading) return <CircularProgress />;
    if (!invoice) return <Typography>No invoice data available</Typography>;

    const toNumber = (value: any): number => {
        const num = Number(value);
        return isNaN(num) ? 0 : num;
    };


    const totalPartsAmount = invoice.part_invoices.reduce(
        (total: number, part: PartInvoice) => total + toNumber(part.quantity) * toNumber(part.price),
        0
    );

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle
                sx={{
                    background: 'linear-gradient(to right, #3f51b5, #2196f3)',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '16px',
                    position: 'relative',
                }}
            >
                Invoice Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: '#fff',
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent
                sx={{
                    padding: '16px',
                    overflowY: 'auto',
                }}
            >
                <Box p={3}>
                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>Customer Information</Typography>
                        <Typography><strong>Name:</strong> {invoice.service.car.customer_details.user.name} {invoice.service.car.customer_details.user.surname}</Typography>
                        <Typography><strong>Phone:</strong> {invoice.service.car.customer_details.user.phone}</Typography>
                        <Typography><strong>Email:</strong> {invoice.service.car.customer_details.user.email}</Typography>
                        <Typography><strong>Address:</strong> {invoice.service.car.customer_details.user.street_address}, {invoice.service.car.customer_details.user.city}, {invoice.service.car.customer_details.user.postal_code}</Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Box mb={3}>
                        <Typography variant="h6" gutterBottom>Vehicle Information</Typography>
                        <Typography><strong>Make/Model:</strong> {invoice.service.car.predefined_car.make} {invoice.service.car.predefined_car.model}</Typography>
                        <Typography><strong>Year:</strong> {invoice.service.car.predefined_car.year}</Typography>
                        <Typography><strong>Reg No:</strong> {invoice.service.car.reg_no}</Typography>
                        <Typography><strong>Service Type:</strong> {invoice.service.service_type.name}</Typography>
                        <Typography><strong>Service Date:</strong> {new Date(invoice.service.date).toLocaleDateString()}</Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography variant="h6" gutterBottom>Invoice Details</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Description</StyledTableCell>
                                    <StyledTableCell align="right">Quantity</StyledTableCell>
                                    <StyledTableCell align="right">Unit Price (R)</StyledTableCell>
                                    <StyledTableCell align="right">Total (R)</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {invoice.part_invoices.map((part, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{part.part.predefined_part_name || 'N/A'}</TableCell>
                                        <TableCell align="right">{part.quantity}</TableCell>
                                        <TableCell align="right">{toNumber(part.price).toFixed(2)}</TableCell>
                                        <TableCell align="right">{(toNumber(part.quantity) * toNumber(part.price)).toFixed(2)}</TableCell>
                                    </TableRow>
                                ))}
                                <TableRow>
                                    <TableCell colSpan={3}><strong>Labor Fees</strong></TableCell>
                                    <TableCell align="right">{toNumber(invoice.labor_fees).toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}><strong>Tax</strong></TableCell>
                                    <TableCell align="right">{toNumber(invoice.tax).toFixed(2)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={3}><strong>Total Amount</strong></TableCell>
                                    <TableCell align="right"><strong>{(totalPartsAmount + toNumber(invoice.labor_fees) + toNumber(invoice.tax)).toFixed(2)}</strong></TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box mt={2}>
                        <Typography><strong>Invoice Status:</strong> {invoice.status}</Typography>
                        <Typography><strong>Invoice ID:</strong> {invoice.id}</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default InvoiceDetailsDialog;
