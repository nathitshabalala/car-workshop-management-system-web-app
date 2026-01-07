import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Customer, CustomerApi, PatchedCustomerRequest } from 'api';

interface EditCustomerModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    customer: Customer;
}

const EditCustomerModal = ({ open, onClose, onSave, customer }: EditCustomerModalProps) => {
    const [editData, setEditData] = useState<PatchedCustomerRequest>({
        user: {
            name: customer.user.name || '',          // Ensure it's a non-undefined string
            surname: customer.user.surname || '',
            phone: customer.user.phone ?? '',        // Handle null or undefined values
            email: customer.user.email || '',
            street_address: customer.user.street_address || '',
            city: customer.user.city || '',
            postal_code: customer.user.postal_code || ''
        },
        password: ''
    });
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Load customer data when the modal opens
    useEffect(() => {
        if (customer) {
            setEditData({
                user: {
                    name: customer.user.name,
                    surname: customer.user.surname,
                    phone: customer.user.phone || '',
                    email: customer.user.email,
                    street_address: customer.user.street_address,
                    city: customer.user.city,
                    postal_code: customer.user.postal_code,
                },
                password: '', // Leave password blank unless updated
            });
        }
    }, [customer]);

    const handleSave = async () => {
        setError(null);
    
        // Check if passwords match
        if (editData.password && editData.password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
    
        try {
            setSubmitting(true);
            const customerApi = new CustomerApi();
    
            // Make a copy of editData and remove password if it's empty
            const dataToSend = { ...editData };
            if (!editData.password) {
                delete dataToSend.password;
            }
    
            // Call the partial update API with updated customer details
            await customerApi.usersCustomerPartialUpdate(customer.user.id, dataToSend);
    
            onSave();
            setOpenSnackbar(true);
            onClose(); // Close the modal on success
        } catch (error) {
            setError('Failed to update customer details');
        } finally {
            setSubmitting(false);
        }
    };
    

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEditData((prev) => ({
            ...prev,
            user: {
                ...prev.user,
                [e.target.name]: e.target.value || '', 
            },
        } as PatchedCustomerRequest));
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Customer Details
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="name"
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="surname"
                            label="Surname"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.surname}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="email"
                            label="Email"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                    <TextField
                        name="phone"
                        label="Phone"
                        fullWidth
                        variant="outlined"
                        value={editData.user?.phone || ''}  // Convert null/undefined to empty string
                        onChange={handleChange}
                    />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="street_address"
                            label="Street Address"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.street_address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="city"
                            label="City"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.city}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            name="postal_code"
                            label="Postal Code"
                            fullWidth
                            variant="outlined"
                            value={editData.user?.postal_code}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            fullWidth
                            type="password"
                            variant="outlined"
                            value={editData.password || ''}
                            onChange={(e) =>
                                setEditData({ ...editData, password: e.target.value })
                            }
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Confirm Password"
                            fullWidth
                            type="password"
                            variant="outlined"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Grid>
                </Grid>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="outlined" color="secondary">
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity="success">
                    Customer details updated successfully!
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default EditCustomerModal;
