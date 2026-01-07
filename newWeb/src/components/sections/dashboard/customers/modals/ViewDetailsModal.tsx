import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, List, ListItem, ListItemText, Box, Card, CardContent, IconButton, Grid, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    customerId: number;
}

// interface CarHealth {
//     battery: number;
//     tires: number;
//     oilLevel: number;
//     brakePads: number;
//     airFilter: number;
// }

interface Invoice {
    id: number;
    customerName: string;
    total_amount: number;
    date: string;
    status: string;
}

interface Service {
    service_type: {
        name: string;
    };
    status: string;
    date: Date;
}

interface Appointment {
    id: number;
    date: string;
    time: string;
    status: string;
}

interface Customer {
    name: string;
    surname: string;
    email: string;
    phone: string;
    street_address: string;
    city: string;
    postal_code: string;
    created_at: string;
}

const ViewDetailDialog = ({ open, onClose, customerId }: ViewDetailDialogProps) => {
    const [customer, setCustomer] = useState<Customer>();
    const [cars, setCars] = useState<any>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    // const [carHealth, setCarHealth] = useState<CarHealth>();

    useEffect(() => {
        if (open && customerId) {
            fetchCustomerData(customerId);
        }
    }, [open, customerId]);

    const fetchCustomerData = async (id: number) => {
        try {
            const customerResponse = await fetch(`http://127.0.0.1:8000/api/users/customer/${id}/`);
            const customerData = await customerResponse.json();
            setCustomer(customerData.user);

            const carsResponse = await fetch(`http://127.0.0.1:8000/api/cars/users/${id}/cars/`);
            const carsData = await carsResponse.json();
            setCars(carsData);

            const servicesResponse = await fetch(`http://127.0.0.1:8000/api/services/user/${id}/latest_service/`);
            const servicesData = await servicesResponse.json();
            setServices(servicesData);

            const invoicesResponse = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/invoices/`);
            const invoicesData = await invoicesResponse.json();
            setInvoices(invoicesData);

            const appointmentsResponse = await fetch(`http://127.0.0.1:8000/api/appointments/user/${id}/`);
            const appointmentsData = await appointmentsResponse.json();
            setAppointments(appointmentsData);

            // if (carsData.length > 0) {
            //     const carHealthResponse = await fetch(`http://127.0.0.1:8000/api/carhealth/${carsData[0].id}/carhealth/`);
            //     const carHealthData = await carHealthResponse.json();
            //     setCarHealth(carHealthData);
            // }
        } catch (error) {
            console.error('Error fetching customer data:', error);
        }
    };

    if (!customer) return null;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle
                sx={{
                    background: 'linear-gradient(to right, #3f51b5, #2196f3)',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '16px',
                    position: 'relative',
                }}
            >
                Customer Details
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
                    // maxHeight: '60vh', // Restrict height and make it scrollable
                    overflowY: 'auto', // Allow vertical scrolling
                    padding: '16px',
                }}
            >
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '250px' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Personal Details</Typography>
                                <Box display="flex" flexDirection="column" gap="10px">
                                    <Typography><strong>Name:</strong> {customer.name} {customer.surname}</Typography>
                                    <Typography><strong>Email:</strong> {customer.email}</Typography>
                                    <Typography><strong>Phone:</strong> {customer.phone}</Typography>
                                    <Typography><strong>Address:</strong> {customer.street_address}, {customer.city}, {customer.postal_code}</Typography>
                                    <Typography><strong>Customer Since:</strong> {new Date(customer.created_at).toLocaleDateString()}</Typography>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '200px' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom><b>Cars</b></Typography>
                                <List>
                                    {cars.map((car: { id: React.Key | null | undefined; predefined_car: { make: any; model: any; year: any; }; reg_no: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; is_default: any; }) => (
                                        <ListItem key={car.id}>
                                            <ListItemText
                                                primary={`${car.predefined_car.make} ${car.predefined_car.model} (${car.predefined_car.year})`}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" color="text.primary">
                                                            Reg No: {car.reg_no}
                                                        </Typography>
                                                        {car.is_default && (
                                                            <Chip label="Default" color="primary" size="small" sx={{ marginLeft: 1 }} />
                                                        )}
                                                    </>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '200px' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Latest Service</Typography>
                                {services.length > 0 ? (
                                    <List>
                                        <ListItem>
                                            <ListItemText
                                                primary={services[0].service_type.name}
                                                secondary={`Status: ${services[0].status}, Date: ${new Date(services[0].date).toLocaleDateString()}`}
                                            />
                                        </ListItem>
                                    </List>
                                ) : (
                                    <Typography>No services recorded</Typography>
                                )}
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '200px' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Upcoming Appointments</Typography>
                                <List>
                                    {appointments.filter(app => new Date(app.date) > new Date()).map((appointment) => (
                                        <ListItem key={appointment.id}>
                                            <ListItemText
                                                primary={`Date: ${new Date(appointment.date).toLocaleDateString()}`}
                                                secondary={`Time: ${appointment.time}, Status: ${appointment.status}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '200px' }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>Recent Invoices</Typography>
                                <List>
                                    {invoices.slice(0, 3).map((invoice) => (
                                        <ListItem key={invoice.id}>
                                            <ListItemText
                                                primary={`Invoice #${invoice.id}`}
                                                secondary={`Total: R${invoice.total_amount}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailDialog;
