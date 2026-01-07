import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Typography, Box, Button, CircularProgress, Checkbox, Divider, MenuItem, Select, InputLabel, FormControl
} from '@mui/material';
import { TaskApi, Task, Mechanic, MechanicApi } from 'api';

const ServiceInfoModal = ({
    open,
    onClose,
    service,
}: {
    open: boolean;
    onClose: () => void;
    service: any;
}) => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [selectedMechanic, setSelectedMechanic] = useState('');

    useEffect(() => {
        if (open && service?.id) {
            fetchTasks(service.id);
            fetchMechanics();
        }
    }, [open, service?.id]);

    const fetchTasks = async (serviceId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            const serviceApi = new TaskApi();
            const response = await serviceApi.tasksServiceList(serviceId);
            setTasks(response.data as unknown as Array<Task>);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch tasks');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMechanics = async () => {
        try {
            const response = await new MechanicApi().usersMechanicsList();
            const data = response.data as unknown as Mechanic[];
            setMechanics(data);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch mechanics');
        }
    };

    const handleReassignMechanic = async (taskId: number, mechanicId: string) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/tasks/edit/${taskId}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assigned_to_id: mechanicId }),
            });
            if (!response.ok) throw new Error('Failed to reassign mechanic');
            fetchTasks(service.id); // Refresh tasks after reassignment
        } catch (err: any) {
            setError(err.message || 'Failed to reassign mechanic');
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Service Information</DialogTitle>
            <DialogContent>
                {service ? (
                    <>
                        <Box mb={2}>
                            <Typography variant="h6">Overview</Typography>
                            <Typography><strong>Service:</strong> {service.name}</Typography>
                            <Typography><strong>Customer:</strong> {service.customer}</Typography>
                            <Typography><strong>Description:</strong> {service.description}</Typography>
                            <Typography><strong>Mechanic:</strong> {service.mechanic}</Typography>
                            <Typography><strong>Car:</strong> {service.car}</Typography>
                        </Box>
                        <Divider />
                        <Box mt={2}>
                            <Typography variant="h6">Tasks</Typography>
                            {isLoading ? (
                                <CircularProgress />
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <Box key={task.id} display="flex" flexDirection="column" my={2}>
                                        <Box display="flex" alignItems="center" my={1}>
                                            <Checkbox checked={task.status === "Completed"} disabled />
                                            <Box flexGrow={1}>
                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        fontWeight: task.status === "In Progress" ? "bold" : "normal",
                                                    }}
                                                >
                                                    {index + 1}. {task.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        {task.status !== "Completed" && (
                                            <FormControl fullWidth sx={{ mt: 2 }}>
                                                <InputLabel>Reassign Mechanic</InputLabel>
                                                <Select
                                                    value={selectedMechanic}
                                                    onChange={(e) => setSelectedMechanic(e.target.value)}
                                                    label="Reassign Mechanic"
                                                >
                                                    {mechanics.map((mechanic) => (
                                                        <MenuItem key={mechanic.user.id} value={mechanic.user.id}>
                                                            {mechanic.user.name} {mechanic.user.surname}
                                                        </MenuItem>
                                                    ))}
                                                </Select>

                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    onClick={() => handleReassignMechanic(task.id, selectedMechanic)}
                                                    sx={{ mt: 2 }}
                                                >
                                                    Confirm Reassign
                                                </Button>
                                            </FormControl>
                                        )}
                                    </Box>
                                ))
                            ) : (
                                <Typography>No tasks available.</Typography>
                            )}
                        </Box>
                    </>
                ) : (
                    <Typography>No service selected.</Typography>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ServiceInfoModal;
