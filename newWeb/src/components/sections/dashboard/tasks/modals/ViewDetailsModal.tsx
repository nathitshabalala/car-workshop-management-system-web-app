import {
    Modal, Box, Typography, Divider
} from '@mui/material';
import { Task } from 'api';
import { ReactElement } from 'react';

const TaskInfoModal = ({
    open,
    onClose,
    task,
}: {
    open: boolean;
    onClose: () => void;
    task: Task;
}): ReactElement => {

    return (
        <Modal open={open} onClose={onClose} aria-labelledby="task-info-title">
            <Box
                sx={{
                    bgcolor: 'background.paper',
                    p: 4,
                    width: { xs: '90%', md: '80%' },
                    margin: 'auto',
                    mt: '10%',
                    maxHeight: '80vh',
                    overflowY: 'auto', // Makes the dialog scrollable
                    borderRadius: 2,
                    boxShadow: 3,
                }}
            >
                <Typography id="task-info-title" variant="h6" component="h2" gutterBottom>
                    Service Information
                </Typography>
                {task ? (
                    <>
                        <Box mb={2}>
                            <Typography><strong>Service:</strong> {task.service.service_type.name}</Typography>
                            <Typography><strong>Description:</strong> {task.description}</Typography>
                            <Typography><strong>Mechanic:</strong> {task.assigned_to.user.name} </Typography>
                            <Typography><strong>Car:</strong> {task.service.car.predefined_car.make}</Typography>
                            <Typography><strong>Status:</strong> {task.status}</Typography>
                        </Box>
                        <Divider />
                        {/* <Box>
                            <Typography variant="h6">Tasks</Typography>
                            {tasks.length > 0 ? (
                                tasks
                                    .sort((a, b) => a.id - b.id)
                                    .map((task, index) => (
                                        <Box key={task.id} display="flex" alignItems="center" my={1}>
                                            <Typography variant="body1" sx={{ flexGrow: 1 }}>
                                                {index + 1}. {task.description} - {task.status}
                                            </Typography>
                                        </Box>
                                    ))
                            ) : (
                                <Typography>No tasks available.</Typography>
                            )}
                        </Box> */}

                    </>
                ) : (
                    <Typography>No task selected.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default TaskInfoModal;
