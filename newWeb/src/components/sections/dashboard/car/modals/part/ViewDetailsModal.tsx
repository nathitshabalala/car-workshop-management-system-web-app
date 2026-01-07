import { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, Box, IconButton, Stack, InputAdornment, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import IconifyIcon from 'components/base/IconifyIcon';
import PartTable from '../../PartTable';

interface ViewDetailDialogProps {
    open: boolean;
    onClose: () => void;
    carId: number;
}

interface Part {
    id: 1;
    predefined_part: 1;
    predefined_part_name: string;
    predefined_part_description: string;
    price: string;
}

const ViewDetailDialog = ({ open, onClose, carId }: ViewDetailDialogProps) => {
    const [parts, setParts] = useState<Part[]>();
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setSearch(event.currentTarget.value);
    }, []);

    useEffect(() => {
        if (open && carId) {
            fetchPartData(carId);
        }
    }, [open, carId]);

    const fetchPartData = async (id: number) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/parts/list/?car_id=${id}`);
            const data = await response.json() as unknown as Array<Part>;
            setParts(data);
        } catch (error) {
            console.error('Error fetching car data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!parts) return null;

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
                Car Details
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
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={5}
                    flexWrap="wrap"
                    gap={3}
                >
                    <TextField
                        variant="filled"
                        placeholder="Search..."
                        value={search}
                        onChange={handleChange}
                        sx={{
                            '.MuiFilledInput-root': {
                                bgcolor: 'grey.A100',
                                ':hover': {
                                    bgcolor: 'background.default',
                                },
                                ':focus': {
                                    bgcolor: 'background.default',
                                },
                                ':focus-within': {
                                    bgcolor: 'background.default',
                                },
                            },
                            borderRadius: 2,
                            height: 40,
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <IconifyIcon icon="akar-icons:search" width={13} height={13} />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Stack>
                <Box width={1} flexGrow={1} minHeight={325}>
                    <PartTable searchText={search} rows={parts} loading={loading} carId={carId} />
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ViewDetailDialog;
