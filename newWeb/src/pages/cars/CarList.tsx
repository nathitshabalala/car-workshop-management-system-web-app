import { Box } from "@mui/material"
import Cars from "components/sections/dashboard/car/Cars";
import { ReactElement } from "react"

const CarList = (): ReactElement => {
    return (
        <>
            <Box gridColumn={{ xs: 'span 12', '2xl': 'span 6' }} order={{ xs: 7 }}>
                <Cars />
            </Box>
        </>
    );
};

export default CarList;