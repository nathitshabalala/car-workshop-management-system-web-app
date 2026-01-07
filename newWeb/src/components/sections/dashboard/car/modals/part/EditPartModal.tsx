import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert, } from '@mui/material';

interface PartE {
  predefined_part: string;
  price: string;
}

interface PartY {
  id: number;
  predefined_part: string;
  predefined_part_name: string;
  predefined_part_description: string;
  price: string;
}


interface EditPartModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  part: any;
  carId: number
}

const EditPartModal = ({ open, onClose, onSave, carId, part }: EditPartModalProps) => {
  const [partData, setPartData] = useState<PartE>(part || { predefined_part: '', price: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [availableParts, setAvailableParts] = useState<PartY[]>([]);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'warning' | 'info'>('success');

  console.log(part);
  useEffect(() => {
    if (part) {
      setPartData(part);
    } else {
      setPartData({ predefined_part: '', price: '' });
    }
    fetchAvailableParts();
  }, [part]);

  const fetchAvailableParts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/parts/list/');
      const data = await response.json() as unknown as PartE[];

      // Transform PartE[] to PartY[] with dummy values for the missing fields
      const transformedData: PartY[] = data.map(part => ({
        ...part,
        id: Math.random(),  // Assuming no id is provided, generate a random one
        predefined_part_name: part.predefined_part,
        predefined_part_description: "No description", // Set default value
      }));
      setAvailableParts(transformedData);
    } catch (error) {
      console.error('Error fetching parts:', error);
    }
  };


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setPartData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const endpoint = part ? `http://127.0.0.1:8000/api/parts/edit/${part.id}/` : 'http://127.0.0.1:8000/api/parts/add/';
    const method = part ? 'PATCH' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...partData, predefined_car: carId }),
      });
      if (response.ok) {
        setSnackbarMessage(part ? 'Part updated successfully.' : 'Part added successfully.');
        setSnackbarSeverity('success');
        onSave();
        onClose();
      } else {
        setSnackbarMessage('Failed to save part.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error saving part:', error);
      setSnackbarMessage('Error saving part.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>{part ? 'Edit Part' : 'Add New Part'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Part"
            fullWidth
            select
            SelectProps={{ native: true }}
            variant="outlined"
            name="predefined_part"
            value={partData.predefined_part}
            onChange={handleChange}
          >
            <option value=""></option>
            {availableParts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.predefined_part_name}
              </option>
            ))}
          </TextField>
          <TextField
            margin="normal"
            label="Price"
            fullWidth
            variant="outlined"
            name="price"
            value={partData.price}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

    </>
  );
};

export default EditPartModal;
