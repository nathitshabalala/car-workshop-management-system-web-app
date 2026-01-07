import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { CarApi, PredefinedCar, PredefinedCarRequest } from 'api';

interface EditCarModalProps {
    open: boolean;
    onClose: () => void;
    onSave: () => void;
    car: PredefinedCar;
}

const EditCarModal = ({ open, onClose, onSave, car }: EditCarModalProps) => {
    const [editData, setEditData] = useState<PredefinedCarRequest>({
        make: car.make || '',
        model: car.model || '',
        year: car.year || 2024,
        image: null,
    });
    const [imagePreview, setImagePreview] = useState<string | null>(car.image || null);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setSubmitting] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Load car data when the modal opens
    useEffect(() => {
        if (car && car.image) {
            const loadImageAsFile = async () => {
                try {
                    const imageUrl = car.image?.startsWith('http') ? car.image : `http://127.0.0.1:8000${car.image}`;
                    const response = await fetch(imageUrl);
                    if (!response.ok) throw new Error('Failed to fetch image');

                    const blob = await response.blob();
                    const file = new File([blob], car.image?.split('/').pop() || 'car_image.png', { type: blob.type });

                    // Set image file in state
                    setEditData(prevData => ({
                        ...prevData,
                        image: file,
                    }));

                    // Set preview URL
                    setImagePreview(URL.createObjectURL(file));
                } catch (error) {
                    console.error("Error loading image:", error);
                }
            };

            loadImageAsFile();
        }
    }, [car]);

    const handleSave = async () => {
        setError(null);
        try {
            setSubmitting(true);
            const carApi = new CarApi();

            // Make a copy of editData and remove image if empty
            const dataToSend = { ...editData };
            if (!editData?.image) {
                delete dataToSend.image;
            }
            delete dataToSend.image;

            console.log('Request Body:', dataToSend);

            // Call the partial update API with updated car details
            await carApi.carsPredefinedCarsEditPartialUpdate(car.id, dataToSend);

            onSave();
            setOpenSnackbar(true);
            onClose(); // Close the modal on success
        } catch (error) {
            setError('Failed to update car details');

            if (error.response) {
                // Server responded with a status other than 200 range
                console.error('Response Data:', error.response.data);  // Response body
                console.error('Response Status:', error.response.status); // HTTP status code
                console.error('Response Headers:', error.response.headers); // Headers
            } else if (error.request) {
                // The request was made, but no response was received
                console.error('Request Data:', error.request);
            } else {
                // Something else happened while setting up the request
                console.error('Error Message:', error.message);
            }

            console.error('Error Config:', error.config); // Request configuration that caused the error

        } finally {
            setSubmitting(false);
        }
    };


    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditData((prev) => ({
            ...prev,
            [name]: value, // Update the field corresponding to the input name
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setEditData(prevData => ({
                ...prevData,
                image: file, // Update with the uploaded file
            }));
            setImagePreview(URL.createObjectURL(file)); // Update preview with the new file
        }
    };


    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Edit Car Details
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
                    <Grid item xs={12}>
                        <TextField
                            name="make"
                            label="Make"
                            fullWidth
                            variant="outlined"
                            value={editData.make}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="model"
                            label="Model"
                            fullWidth
                            variant="outlined"
                            value={editData.model}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            name="year"
                            label="Year"
                            fullWidth
                            variant="outlined"
                            value={editData.year}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ marginTop: '16px' }}
                        />
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Car"
                                style={{ width: '100%', marginTop: '16px' }} // Display the current or uploaded image
                            />
                        )}
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
                    Car details updated successfully!
                </Alert>
            </Snackbar>
        </Dialog>
    );
};

export default EditCarModal;
