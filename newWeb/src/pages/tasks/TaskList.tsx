import { Box } from "@mui/material"
import Tasks from "components/sections/dashboard/tasks/Tasks";
import { ReactElement } from "react"

const TaskList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Tasks />
            </Box>
        </>
    );
};

export default TaskList;