import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Card, CardContent, IconButton, Grid, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MechanicApi, Mechanic } from 'api';

interface ViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    MechanicId: number;
}

const ViewDetailDialog = ({ open, onClose, MechanicId }: ViewDetailDialogProps) => {
    const [mechanic, setMechanic] = useState<Mechanic | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && MechanicId) {
            fetchMechanicData(MechanicId);
        }
    }, [open, MechanicId]);

    const fetchMechanicData = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = (await new MechanicApi().usersMechanicRetrieve(id)).data as unknown as Mechanic;
            setMechanic(data);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null; 

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
                Mechanic Details
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
                    overflowY: 'auto',
                    padding: '16px',
                }}
            >
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="250px">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : mechanic ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '250px' }}>
                                <CardContent >
                                    <Typography variant="h6" gutterBottom>Personal Details</Typography>
                                    <Box display="flex" flexDirection="column" gap="10px">
                                        <Typography><strong>Name:</strong> {mechanic.user.name} {mechanic.user.surname}</Typography>
                                        <Typography><strong>Email:</strong> {mechanic.user.email}</Typography>
                                        <Typography><strong>Phone:</strong> {mechanic.user.phone}</Typography>
                                        <Typography><strong>Address:</strong> {mechanic.user.street_address}, {mechanic.user.city}, {mechanic.user.postal_code}</Typography>
                                        <Typography><strong>Outstanding tasks:</strong> {mechanic.current_workload}</Typography>
                                        <Typography><strong>Mechanic Since:</strong> {new Date(mechanic.user.created_at).toLocaleDateString()}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">No mechanic details available.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailDialog;
