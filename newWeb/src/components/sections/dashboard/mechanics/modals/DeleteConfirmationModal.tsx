import { Modal, Box, Button, Typography } from '@mui/material';

interface DeleteConfirmationModalProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    mechanic: any;
}

const DeleteConfirmationModal = ({ open, onClose, onConfirm }: DeleteConfirmationModalProps) => {
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ width: 400, p: 4, backgroundColor: 'white', mx: 'auto', my: '10%' }}>
                <Typography variant="h6">Delete Mechanic</Typography>
                <Typography variant="body1">
                    Are you sure you want to delete this mechanic? This action cannot be undone.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                    <Button variant="outlined" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error" onClick={onConfirm}>
                        Delete
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default DeleteConfirmationModal;
