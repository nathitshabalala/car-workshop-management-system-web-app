import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Typography, Box, Card, CardContent, IconButton, Grid, CircularProgress, Alert } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ManagerApi, Manager } from 'api';

interface ViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    ManagerId: number;
}

const ViewDetailDialog = ({ open, onClose, ManagerId }: ViewDetailDialogProps) => {
    const [manager, setManager] = useState<Manager | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (open && ManagerId) {
            fetchManagerData(ManagerId);
        }
    }, [open, ManagerId]);

    const fetchManagerData = async (id: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = (await new ManagerApi().usersManagerRetrieve(id)).data as unknown as Manager;
            setManager(data);
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
                Manager Details
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
                ) : manager ? (
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ marginBottom: '20px', minHeight: '250px' }}>
                                <CardContent >
                                    <Typography variant="h6" gutterBottom>Personal Details</Typography>
                                    <Box display="flex" flexDirection="column" gap="10px">
                                        <Typography><strong>Name:</strong> {manager.user.name} {manager.user.surname}</Typography>
                                        <Typography><strong>Email:</strong> {manager.user.email}</Typography>
                                        <Typography><strong>Phone:</strong> {manager.user.phone}</Typography>
                                        <Typography><strong>Address:</strong> {manager.user.street_address}, {manager.user.city}, {manager.user.postal_code}</Typography>
                                        <Typography><strong>Manager Since:</strong> {new Date(manager.user.created_at).toLocaleDateString()}</Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Typography variant="body1">No manager details available.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailDialog;
