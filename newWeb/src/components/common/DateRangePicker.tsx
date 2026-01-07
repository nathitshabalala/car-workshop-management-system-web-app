import React, { useState } from 'react';
import { Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface DateRangePickerModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (startDate: Date | null, endDate: Date | null) => void;
}

const DateRangePickerModal: React.FC<DateRangePickerModalProps> = ({ open, onClose, onSave }) => {
    const [startDate, setStartDate] = useState<Date | null>();
    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const handleSave = () => {
        if (startDate !== undefined && endDate !== undefined) {
            onSave(startDate, endDate);
            onClose();
        }
    };
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Date Range Picker</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 300 }}>
                        <DatePicker
                            label="Start Date"
                            value={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                        <DatePicker
                            label="End Date"
                            value={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                    </Box>
                </LocalizationProvider>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
};

export default DateRangePickerModal;