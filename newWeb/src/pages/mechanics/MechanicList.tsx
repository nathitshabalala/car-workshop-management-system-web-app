import { Box } from "@mui/material"
import Mechanics from "components/sections/dashboard/mechanics/Mechanics";
import { ReactElement } from "react"

const MechanicList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Mechanics />
            </Box>
        </>
    );
};

export default MechanicList;