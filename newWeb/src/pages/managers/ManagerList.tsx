import { Box } from "@mui/material"
import Managers from "components/sections/dashboard/managers/Managers";
import { ReactElement } from "react"

const ManagerList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Managers />
            </Box>
        </>
    );
};

export default ManagerList;